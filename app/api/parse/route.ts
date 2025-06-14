import { SitemapProcessor } from "@/lib/sitemap-processor";
import { StreamResponse, RequestBody } from "@/lib/types";
import type { NextRequest } from "next/server";
import { URL } from "url";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendUpdate = async (update: StreamResponse) => {
    try {
      await writer.write(encoder.encode(JSON.stringify(update) + "\n"));
    } catch (error) {
      console.error("Error sending update:", error);
    }
  };

  (async () => {
    try {
      const body: RequestBody = await request.json();
      const { sitemapUrl, options = {} } = body;

      if (!sitemapUrl) {
        await sendUpdate({ type: "error", message: "Sitemap URL is required" });
        return;
      }

      // Validate URL
      try {
        new URL(sitemapUrl);
      } catch (e) {
        await sendUpdate({
          type: "error",
          message: "Invalid sitemap URL provided",
        });
        return;
      }

      const processor = new SitemapProcessor(options);
      const result = await processor.processSitemap(sitemapUrl, sendUpdate);

      await sendUpdate({ type: "result", content: result });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      await sendUpdate({ type: "error", message: errorMessage });
    } finally {
      try {
        await writer.close();
      } catch (error) {
        console.error("Error closing writer:", error);
      }
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
