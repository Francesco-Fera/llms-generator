import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Download, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ResultDisplayProps {
  result: string;
  onDownload: (content: string) => void;
}

export function ResultDisplay({ result, onDownload }: ResultDisplayProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied!", {
        description: "LLMS.txt content copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to copy to clipboard",
        duration: 2000,
      });
    }
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Generated LLMS.txt",
          text: "Check out this generated LLMS.txt file",
          url: window.location.href,
        });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const getPreviewText = (content: string, maxLines: number = 15) => {
    const lines = content.split("\n");
    if (lines.length <= maxLines) {
      return content;
    }
    return (
      lines.slice(0, maxLines).join("\n") + "\n\n... (truncated for preview)"
    );
  };

  const lineCount = result.split("\n").length;
  const wordCount = result
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = result.length;

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              Generated LLMS.txt
            </CardTitle>
            <CardDescription className='mt-2'>
              Your LLMS.txt file has been generated successfully
            </CardDescription>
            <div className='flex gap-4 mt-2 text-sm text-muted-foreground'>
              <span>{lineCount} lines</span>
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button onClick={copyToClipboard} variant='outline' size='sm'>
              <Copy className='h-4 w-4 mr-2' />
              Copy
            </Button>
            <Button onClick={shareResult} variant='outline' size='sm'>
              <Share2 className='h-4 w-4 mr-2' />
              Share
            </Button>
            <Button onClick={() => onDownload(result)} size='sm'>
              <Download className='h-4 w-4 mr-2' />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <Separator />

          <div className='bg-slate-50 rounded-lg p-4 max-h-96 overflow-auto'>
            <pre className='text-sm whitespace-pre-wrap font-mono text-slate-800'>
              {getPreviewText(result)}
            </pre>
          </div>

          {lineCount > 15 && (
            <div className='text-center'>
              <Button
                onClick={() => onDownload(result)}
                variant='outline'
                size='sm'
              >
                Download full file to view complete content
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
