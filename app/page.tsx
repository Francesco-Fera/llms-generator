"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("summary");
  const [excludePaths, setExcludePaths] = useState("");
  const [includePaths, setIncludePaths] = useState("");
  const [replaceTitle, setReplaceTitle] = useState("");
  const [concurrency, setConcurrency] = useState(5);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [processedUrls, setProcessedUrls] = useState(0);
  const [totalUrls, setTotalUrls] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");
    setProcessedUrls(0);
    setTotalUrls(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sitemapUrl,
          mode,
          excludePaths: excludePaths.split("\n").filter(Boolean),
          includePaths: includePaths.split("\n").filter(Boolean),
          replaceTitle: replaceTitle.split("\n").filter(Boolean),
          concurrency,
          title,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process sitemap");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get response reader");

      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        try {
          // Check if the chunk is a progress update
          if (chunk.startsWith('{"progress":')) {
            const progressData = JSON.parse(chunk);
            setProcessedUrls(progressData.progress.processed);
            setTotalUrls(progressData.progress.total);
          } else {
            // Otherwise append to the output
            result += chunk;
            setOutput((prev) => prev + chunk);
          }
        } catch (e: any) {
          // If it's not valid JSON, just append to output
          result += chunk;
          setOutput((prev) => prev + chunk);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sitemap-to-llms-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className='container mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        Sitemap to LLMs Converter
      </h1>
      <p className='text-center mb-8 text-muted-foreground'>
        Transform sitemap.xml files into structured markdown for LLM training
        and reference
      </p>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Enter a sitemap URL and configure processing options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='sitemapUrl'>Sitemap URL</Label>
                <Input
                  id='sitemapUrl'
                  placeholder='https://example.com/sitemap.xml'
                  value={sitemapUrl}
                  onChange={(e: any) => setSitemapUrl(e.target.value)}
                  required
                />
              </div>

              <Tabs value={mode} onValueChange={setMode}>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='summary'>Summary</TabsTrigger>
                  <TabsTrigger value='full'>Full Content</TabsTrigger>
                </TabsList>
                <TabsContent value='summary' className='space-y-4 mt-4'>
                  <p className='text-sm text-muted-foreground'>
                    Generates a structured document with sections based on URL
                    paths, including titles and descriptions.
                  </p>
                </TabsContent>
                <TabsContent value='full' className='space-y-4 mt-4'>
                  <p className='text-sm text-muted-foreground'>
                    Creates a comprehensive document with full content from each
                    page, converted from HTML to markdown.
                  </p>
                </TabsContent>
              </Tabs>

              <div className='space-y-2'>
                <Label htmlFor='title'>Document Title (Optional)</Label>
                <Input
                  id='title'
                  placeholder='Documentation Title'
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>
                  Document Description (Optional)
                </Label>
                <Input
                  id='description'
                  placeholder='Documentation Description'
                  value={description}
                  onChange={(e: any) => setDescription(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='concurrency'>Concurrency</Label>
                <Input
                  id='concurrency'
                  type='number'
                  min='1'
                  max='20'
                  value={concurrency}
                  onChange={(e: any) =>
                    setConcurrency(Number.parseInt(e.target.value))
                  }
                />
                <p className='text-xs text-muted-foreground'>
                  Number of URLs to process concurrently (1-20)
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='excludePaths'>
                  Exclude Paths (one per line)
                </Label>
                <Textarea
                  id='excludePaths'
                  placeholder='*/blog/*\n*/archive/*'
                  value={excludePaths}
                  onChange={(e: any) => setExcludePaths(e.target.value)}
                  className='h-20'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='includePaths'>
                  Include Paths (one per line)
                </Label>
                <Textarea
                  id='includePaths'
                  placeholder='*/docs/*\n*/guide/*'
                  value={includePaths}
                  onChange={(e: any) => setIncludePaths(e.target.value)}
                  className='h-20'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='replaceTitle'>
                  Title Replacements (one per line)
                </Label>
                <Textarea
                  id='replaceTitle'
                  placeholder='s/Company Name - //g\ns/ | Documentation//g'
                  value={replaceTitle}
                  onChange={(e: any) => setReplaceTitle(e.target.value)}
                  className='h-20'
                />
                <p className='text-xs text-muted-foreground'>
                  Use sed-like syntax: s/pattern/replacement/flags
                </p>
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  "Process Sitemap"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription className='flex justify-between items-center'>
              <span>Generated markdown content</span>
              {loading && totalUrls > 0 && (
                <Badge variant='outline'>
                  Processing: {processedUrls}/{totalUrls} URLs
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Textarea
              value={output}
              readOnly
              className='h-[600px] font-mono text-sm'
              placeholder='Processed content will appear here...'
            />
          </CardContent>
          <CardFooter className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={copyToClipboard}
              disabled={!output}
            >
              <Copy className='mr-2 h-4 w-4' />
              Copy
            </Button>
            <Button
              variant='default'
              onClick={downloadOutput}
              disabled={!output}
            >
              <Download className='mr-2 h-4 w-4' />
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
