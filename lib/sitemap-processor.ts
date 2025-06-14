import Sitemapper from "sitemapper";
import * as cheerio from "cheerio";
import {
  DEFAULT_CONFIG,
  SECTION_RULES,
  SECTION_DISPLAY_NAMES,
} from "./constants";
import { ProcessedPage, StreamResponse } from "./types";

export class SitemapProcessor {
  private sitemap: Sitemapper;
  private config: typeof DEFAULT_CONFIG;

  constructor(config: Partial<typeof DEFAULT_CONFIG> = {}) {
    this.sitemap = new Sitemapper({
      timeout: config.requestTimeout || DEFAULT_CONFIG.requestTimeout,
    });
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async fetchHtml(url: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.requestTimeout
      );

      const response = await fetch(url, {
        headers: {
          "User-Agent": this.config.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(
          `Failed to fetch ${url}: ${response.status} ${response.statusText}`
        );
        return null;
      }

      return await response.text();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.warn(`Timeout fetching ${url}`);
      } else {
        console.warn(`Error fetching ${url}:`, error);
      }
      return null;
    }
  }

  extractPageData(html: string): {
    title: string | null;
    description: string | null;
  } {
    try {
      const $ = cheerio.load(html);

      let title = $("head > title").text().trim();
      if (!title) {
        title = $("h1").first().text().trim();
      }

      // Clean title
      // Remove site name suffix
      title = title
        .replace(/^\|\s*/, "")
        .replace(/\s*\|\s*[^|]*$/, "")
        .trim();

      let description = $('head > meta[name="description"]').attr("content");

      if (!description) {
        description = $('head > meta[property="og:description"]').attr(
          "content"
        );
      }

      if (!description) {
        description = $('head > meta[name="twitter:description"]').attr(
          "content"
        );
      }

      // Fallback to first paragraph if no meta description
      if (!description) {
        const firstP = $("main p, article p, .content p, #content p")
          .first()
          .text()
          .trim();
        if (firstP && firstP.length > 50 && firstP.length < 300) {
          description =
            firstP.substring(0, 200) + (firstP.length > 200 ? "..." : "");
        }
      }

      return {
        title: title || null,
        description: description?.trim() || null,
      };
    } catch (error) {
      console.warn("Error parsing HTML:", error);
      return { title: null, description: null };
    }
  }

  categorizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase().replace(/^\/|\/$/g, "");
      const segments = pathname.split("/").filter(Boolean);

      for (const [section, keywords] of Object.entries(SECTION_RULES)) {
        for (const keyword of keywords) {
          if (
            segments.some(
              (segment) =>
                segment.includes(keyword) ||
                keyword.includes(segment) ||
                segment === keyword
            )
          ) {
            return section;
          }
        }
      }

      if (segments.length === 0 || segments[0] === "") {
        return "home";
      }

      return "other";
    } catch (error) {
      return "other";
    }
  }

  shouldProcessUrl(url: string): boolean {
    const { includePaths, excludePaths } = this.config;

    if (excludePaths.length > 0) {
      for (const pattern of excludePaths) {
        if (url.includes(pattern)) {
          return false;
        }
      }
    }

    if (includePaths.length > 0) {
      for (const pattern of includePaths) {
        if (url.includes(pattern)) {
          return true;
        }
      }
      return false;
    }

    return true;
  }

  async processInBatches<T, R>(
    items: T[],
    processor: (item: T, index: number) => Promise<R>,
    progressCallback?: (
      processed: number,
      total: number,
      message: string
    ) => void
  ): Promise<R[]> {
    const results: R[] = [];
    const totalItems = items.length;
    let processedItems = 0;

    for (let i = 0; i < totalItems; i += this.config.concurrency) {
      const batch = items.slice(i, i + this.config.concurrency);

      const batchPromises = batch.map(async (item, batchIndex) => {
        const globalIndex = i + batchIndex;
        const result = await processor(item, globalIndex);
        processedItems++;

        if (progressCallback) {
          progressCallback(
            processedItems,
            totalItems,
            `Processing page ${processedItems}/${totalItems}`
          );
        }

        return result;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean));

      // Small delay between batches to be respectful
      if (i + this.config.concurrency < totalItems) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  generateSiteDescription(
    pages: ProcessedPage[],
    customDescription?: string
  ): string {
    if (customDescription) return customDescription;

    const homePage = pages.find((p) => p.section === "home");
    if (homePage?.description) {
      return homePage.description;
    }

    const sections = [...new Set(pages.map((p) => p.section))];
    const hasGuides = sections.includes("guides");
    const hasBlog = sections.includes("blog");
    const hasServices = sections.includes("services");

    let description = "A website with: ";
    const features = [];

    if (hasGuides) features.push("Guides & Tutorials");
    if (hasBlog) features.push("Articles & News");
    if (hasServices) features.push("Services & Products");

    if (features.length === 0) {
      features.push("Useful contents");
    }

    return description + features.join(", ") + ".";
  }

  generateLLMSText(
    pages: ProcessedPage[],
    siteTitle: string,
    siteDescription: string
  ): string {
    const sections: Record<string, ProcessedPage[]> = {};

    pages.forEach((page) => {
      if (!sections[page.section]) {
        sections[page.section] = [];
      }
      sections[page.section].push(page);
    });

    Object.keys(sections).forEach((sectionKey) => {
      sections[sectionKey].sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.title.localeCompare(b.title);
      });
    });

    let output = `# ${siteTitle}\n\n`;
    output += `> ${siteDescription}\n\n`;

    const sectionOrder = [
      "home",
      "about",
      "services",
      "guides",
      "blog",
      "reviews",
      "insights",
      "resources",
      "contact",
      "legal",
      "other",
    ];

    sectionOrder.forEach((sectionKey) => {
      if (sections[sectionKey] && sections[sectionKey].length > 0) {
        const displayName =
          SECTION_DISPLAY_NAMES[
            sectionKey as keyof typeof SECTION_DISPLAY_NAMES
          ];
        output += `## ${displayName}\n\n`;

        sections[sectionKey].forEach((page) => {
          output += `- [${page.title}](${page.url})`;
          if (page.description) {
            output += `: ${page.description}`;
          }
          output += "\n";
        });

        output += "\n";
      }
    });

    return output.trim();
  }

  async processSitemap(
    sitemapUrl: string,
    progressCallback?: (update: StreamResponse) => void
  ): Promise<string> {
    try {
      progressCallback?.({
        type: "progress",
        processed: 0,
        total: 0,
        message: "Fetching sitemap...",
      });

      const sitemapData = await this.sitemap.fetch(sitemapUrl);
      const urls = sitemapData.sites || [];

      if (urls.length === 0) {
        throw new Error("No URLs found in sitemap");
      }

      progressCallback?.({
        type: "progress",
        processed: 0,
        total: urls.length,
        message: `Found ${urls.length} URLs in sitemap`,
      });

      const validUrls = urls.filter((url) => this.shouldProcessUrl(url));

      if (validUrls.length === 0) {
        throw new Error("No valid URLs to process after filtering");
      }

      const processUrl = async (
        url: string,
        index: number
      ): Promise<ProcessedPage | null> => {
        const html = await this.fetchHtml(url);
        if (!html) return null;

        const { title, description } = this.extractPageData(html);
        if (!title) return null;

        const section = this.categorizeUrl(url);

        let priority = 0.5; // default priority
        try {
          const urlObj = new URL(url);
          // This is a simplified approach
          // TODO: Parse the XML sitemap directly to get accurate priority values
          if (section === "home") priority = 1.0;
          else if (["about", "contact", "services"].includes(section))
            priority = 0.8;
          else if (["guides", "blog", "reviews"].includes(section))
            priority = 0.7;
          else if (section === "legal") priority = 0.3;
        } catch (e) {
          // Keep default priority
        }

        return {
          title,
          url,
          description,
          section,
          priority,
        };
      };

      const results = await this.processInBatches(
        validUrls,
        processUrl,
        (processed, total, message) => {
          progressCallback?.({ type: "progress", processed, total, message });
        }
      );

      const validResults = results.filter(
        (page): page is ProcessedPage =>
          page !== null && page.priority >= this.config.priorityThreshold
      );

      if (validResults.length === 0) {
        throw new Error("No pages met the minimum priority threshold");
      }

      const siteTitle =
        this.config.customTitle || this.extractSiteTitle(validResults);
      const siteDescription = this.generateSiteDescription(
        validResults,
        this.config.customDescription
      );

      const llmsText = this.generateLLMSText(
        validResults,
        siteTitle,
        siteDescription
      );

      progressCallback?.({
        type: "progress",
        processed: validUrls.length,
        total: validUrls.length,
        message: "Generation completed!",
      });

      return llmsText;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      progressCallback?.({ type: "error", message: errorMessage });
      throw error;
    }
  }

  private extractSiteTitle(pages: ProcessedPage[]): string {
    const homePage = pages.find((p) => p.section === "home");
    if (homePage?.title) {
      // Extract domain-based title
      try {
        const url = new URL(homePage.url);
        const domain = url.hostname.replace("www.", "");
        const siteName = domain.split(".")[0];
        return siteName.charAt(0).toUpperCase() + siteName.slice(1);
      } catch (e) {
        return homePage.title;
      }
    }

    return pages[0]?.title || "Documentation";
  }
}
