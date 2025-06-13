import type { NextRequest } from "next/server";
import { URL } from "url";
import * as cheerio from "cheerio";
import Sitemapper from "sitemapper";
import TurndownService from "turndown";
import picomatch from "picomatch";

const sitemap = new Sitemapper();

const turndownService = new TurndownService({
  codeBlockStyle: "fenced",
  headingStyle: "atx",
  bulletListMarker: "-",
  emDelimiter: "*",
  hr: "---",
});

turndownService.addRule("table", {
  filter: "table",
  replacement: (content: any, node: any) => {
    return "\n" + turndownService.turndown(node.outerHTML) + "\n";
  },
});

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function getTitle(html: string): string | null {
  try {
    const $ = cheerio.load(html);
    return $("head > title").text().trim();
  } catch (error) {
    return null;
  }
}

function getDescription(html: string): string | null {
  try {
    const $ = cheerio.load(html);

    let description = $('head > meta[name="description"]').attr("content");

    if (!description) {
      description = $('head > meta[property="og:description"]').attr("content");
    }

    if (!description) {
      description = $('head > meta[name="twitter:description"]').attr(
        "content"
      );
    }

    return description || null;
  } catch (error) {
    return null;
  }
}

function parseSection(uri: string): string {
  try {
    const url = new URL(uri);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[0] || "ROOT";
  } catch (error) {
    return "ROOT";
  }
}

function parseSubstitutionCommand(command: string) {
  const match = command.match(/^s\/(.*?)\/(.*?)\/([gimsuy]*)$/);

  if (match) {
    const pattern = match[1];
    const replacement = match[2];
    const flags = match[3] || "";
    return { pattern: new RegExp(pattern, flags), replacement };
  } else {
    throw new Error("Invalid substitution command format");
  }
}

function substituteTitle(title: string, command: string): string {
  if (!command || command.length < 1 || !command.startsWith("s/")) {
    return title;
  }

  const { pattern, replacement } = parseSubstitutionCommand(command);
  return title.replace(pattern, replacement);
}

function cleanTitle(title: string): string {
  if (!title) return "";

  return title.replace(/^\|\s*/, "").trim();
}

function capitalizeString(str: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function processInBatches<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  concurrency = 10,
  progressCallback?: (processed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  const totalItems = items.length;
  let processedItems = 0;

  for (let i = 0; i < totalItems; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchPromises = batch.map(async (item, index) => {
      const result = await processor(item, i + index);
      processedItems++;
      if (progressCallback) {
        progressCallback(processedItems, totalItems);
      }
      return result;
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results.filter(Boolean as any);
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    try {
      const { sitemapUrl } = await request.json();

      const defaultTitle = "My Default Documentation Title";
      const defaultDescription =
        "This is the default description for the documentation.";

      if (!sitemapUrl) {
        await writer.write(
          encoder.encode(JSON.stringify({ error: "Sitemap URL is required" }))
        );
        await writer.close();
        return;
      }

      // Fixed mode = "summary"
      const mode = "summary";

      // Default empty include and exclude paths, no replaceTitle, concurrency fixed
      const excludePaths: string[] = [];
      const includePaths: string[] = [];
      const replaceTitle: string[] = [];
      const concurrency = 5;

      const isExcluded = picomatch(excludePaths);
      const isIncluded = picomatch(includePaths, { ignore: excludePaths });

      const sites = await sitemap.fetch(sitemapUrl);
      console.log("sites: " + sites.sites);
      const urls = sites.sites || [];

      const sendProgress = (processed: number, total: number) => {
        writer.write(
          encoder.encode(
            JSON.stringify({
              progress: { processed, total },
            })
          )
        );
      };

      if (mode === "summary") {
        const sections: Record<
          string,
          Array<{ title: string; url: string; description: string | null }>
        > = {};

        const processUrl = async (url: string, index: number) => {
          if (isExcluded(url)) {
            return null;
          }
          if (includePaths.length > 0 && !isIncluded(url)) {
            return null;
          }

          const html = await fetchHtml(url);
          if (!html) {
            return null;
          }

          let title = getTitle(html);
          if (!title) {
            return null;
          }

          for (const command of replaceTitle) {
            title = substituteTitle(title, command);
          }
          title = cleanTitle(title);

          const description = getDescription(html);

          const section = parseSection(url);
          console.log("HEre", title, url, description, section);

          return { title, url, description, section };
        };

        const results = await processInBatches(
          urls,
          processUrl,
          concurrency,
          sendProgress
        );
        console.log("result:", results);

        for (const result of results) {
          if (!result) continue;

          const { title, url, description, section } = result;

          sections[section] ||= [];

          sections[section].push({ title, url, description });
        }

        let output = "";

        const root = sections.ROOT || [];
        delete sections.ROOT;

        output += `# ${defaultTitle}`;
        output += "\n\n";
        output += `> ${defaultDescription}`;
        output += "\n\n";

        console.log("section: ", sections);
        for (const section in sections) {
          output += `## ${capitalizeString(section)}\n`;
          for (const line of sections[section]) {
            const { title, url, description } = line;
            output += `\n- [${title}](${url})${
              description ? ": " + description : ""
            }`;
          }
          output += "\n\n";
          console.log("Output", output);
        }

        await writer.write(encoder.encode(output));
      }
    } catch (error) {
      console.error("Error processing sitemap:", error);
      await writer.write(
        encoder.encode(
          JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          })
        )
      );
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
