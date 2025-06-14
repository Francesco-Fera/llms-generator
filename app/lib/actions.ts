// "use server";

//import axios from "axios";
// import * as cheerio from "cheerio";
// import * as xml2js from "xml2js";

// export async function getMetadata(
//   url: string
// ): Promise<{ title?: string; description?: string }> {
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//       },
//     });

//     const html = response.data;
//     const $ = cheerio.load(html);

//     const title = $("head > title").text().trim() || undefined;
//     const description = $('meta[name="description"]').attr("content")?.trim();

//     return { title, description };
//   } catch (error) {
//     console.error(`Error fetching metadata from ${url}:`, error);
//     return {};
//   }
// }

// export async function parseSitemap(sitemapUrl: string): Promise<string[]> {
//   try {
//     const response = await axios.get(sitemapUrl, {
//       headers: { "User-Agent": "Mozilla/5.0" },
//     });
//     const parsed = await xml2js.parseStringPromise(response.data);
//     const urls = parsed?.urlset?.url?.map((entry: any) => entry.loc[0]) || [];

//     return urls;
//   } catch (error) {
//     console.error(`Errore durante il parsing della sitemap:`, error);
//     return [];
//   }
// }

// export async function generateLlmsTxt(urls: string[]): Promise<string> {
//   const mainUrl = urls[0];
//   const baseDomain = new URL(mainUrl).hostname.replace("www.", "");

//   const mainMetadata = await getMetadata(mainUrl);
//   let output = `# ${baseDomain}\n\n> ${
//     mainMetadata.description || "Descrizione non disponibile."
//   }\n\n`;

//   output += `# ${baseDomain} > ${
//     mainMetadata.description || "Descrizione non disponibile."
//   } Il sito si distingue per contenuti curati e aggiornati.\n\n`;
//   output += `## Contenuti Principali\n`;

//   for (const url of urls) {
//     const meta = await getMetadata(url);
//     if (!meta.title) continue;
//     output += `- [${meta.title}](${url}): ${
//       meta.description || "Descrizione non disponibile."
//     }  \n`;
//   }

//   return output;
// }
