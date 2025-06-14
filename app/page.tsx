"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Download,
  Globe,
  Settings,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  total: number;
  message: string;
  result: string | null;
  error: string | null;
}

interface FormData {
  sitemapUrl: string;
  concurrency: number;
  priorityThreshold: number;
  customTitle: string;
  customDescription: string;
  includePaths: string;
  excludePaths: string;
  useAdvancedOptions: boolean;
}

export default function LLMSGeneratorPage() {
  const [formData, setFormData] = useState<FormData>({
    sitemapUrl: "",
    concurrency: 8,
    priorityThreshold: 0.3,
    customTitle: "",
    customDescription: "",
    includePaths: "",
    excludePaths: "",
    useAdvancedOptions: false,
  });

  const [state, setState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    total: 0,
    message: "",
    result: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const downloadResult = (content: string, filename: string = "llms.txt") => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetState = () => {
    setState({
      isProcessing: false,
      progress: 0,
      total: 0,
      message: "",
      result: null,
      error: null,
    });
  };

  const stopProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isProcessing: false,
      message: "Processing stopped by user",
    }));
  };

  const processSitemap = async () => {
    if (!formData.sitemapUrl.trim()) {
      setState((prev) => ({ ...prev, error: "Please enter a sitemap URL" }));
      return;
    }

    resetState();
    setState((prev) => ({ ...prev, isProcessing: true }));

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const requestBody = {
        sitemapUrl: formData.sitemapUrl.trim(),
        options: formData.useAdvancedOptions
          ? {
              concurrency: formData.concurrency,
              priorityThreshold: formData.priorityThreshold / 100,
              customTitle: formData.customTitle.trim() || undefined,
              customDescription: formData.customDescription.trim() || undefined,
              includePaths: formData.includePaths.trim()
                ? formData.includePaths
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : undefined,
              excludePaths: formData.excludePaths.trim()
                ? formData.excludePaths
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : undefined,
            }
          : {},
      };

      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            try {
              const update = JSON.parse(line);

              if (update.type === "progress") {
                setState((prev) => ({
                  ...prev,
                  progress: update.processed,
                  total: update.total,
                  message: update.message,
                }));
              } else if (update.type === "result") {
                setState((prev) => ({
                  ...prev,
                  isProcessing: false,
                  result: update.content,
                  message: "Generation completed successfully!",
                }));
              } else if (update.type === "error") {
                setState((prev) => ({
                  ...prev,
                  isProcessing: false,
                  error: update.message,
                }));
              }
            } catch (e) {
              console.error("Error parsing JSON:", e, "Line:", line);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Request was aborted, don't update state as it's already handled
        return;
      }

      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }));
    } finally {
      abortControllerRef.current = null;
    }
  };

  const progressPercentage =
    state.total > 0 ? (state.progress / state.total) * 100 : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center space-y-4 py-8'>
          <div className='flex items-center justify-center gap-3'>
            <Globe className='h-8 w-8 text-blue-600' />
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              LLMS.txt Generator
            </h1>
          </div>
          <p className='text-xl text-slate-600 max-w-2xl mx-auto'>
            Transform your website sitemap into a structured LLMS.txt file for
            AI training and documentation
          </p>
        </div>

        {/* Main Form */}
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Configuration
            </CardTitle>
            <CardDescription>
              Enter your sitemap URL and configure the generation options
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Sitemap URL */}
            <div className='space-y-2'>
              <Label htmlFor='sitemapUrl'>Sitemap URL *</Label>
              <Input
                id='sitemapUrl'
                type='url'
                placeholder='https://example.com/sitemap.xml'
                value={formData.sitemapUrl}
                onChange={(e) =>
                  handleInputChange("sitemapUrl", e.target.value)
                }
                disabled={state.isProcessing}
              />
            </div>

            {/* Advanced Options Toggle */}
            <div className='flex items-center space-x-2'>
              <Switch
                id='advanced-options'
                checked={formData.useAdvancedOptions}
                onCheckedChange={(checked) =>
                  handleInputChange("useAdvancedOptions", checked)
                }
                disabled={state.isProcessing}
              />
              <Label htmlFor='advanced-options'>Show advanced options</Label>
            </div>

            {/* Advanced Options */}
            {formData.useAdvancedOptions && (
              <div className='space-y-6 p-4 bg-slate-50 rounded-lg border'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Custom Title */}
                  <div className='space-y-2'>
                    <Label htmlFor='customTitle'>Custom Title</Label>
                    <Input
                      id='customTitle'
                      placeholder='My Website Documentation'
                      value={formData.customTitle}
                      onChange={(e) =>
                        handleInputChange("customTitle", e.target.value)
                      }
                      disabled={state.isProcessing}
                    />
                  </div>

                  {/* Concurrency */}
                  <div className='space-y-2'>
                    <Label htmlFor='concurrency'>
                      Concurrency: {formData.concurrency}
                    </Label>
                    <Slider
                      id='concurrency'
                      min={1}
                      max={20}
                      step={1}
                      value={[formData.concurrency]}
                      onValueChange={(value) =>
                        handleInputChange("concurrency", value[0])
                      }
                      disabled={state.isProcessing}
                      className='w-full'
                    />
                  </div>
                </div>

                {/* Custom Description */}
                <div className='space-y-2'>
                  <Label htmlFor='customDescription'>Custom Description</Label>
                  <Textarea
                    id='customDescription'
                    placeholder='A comprehensive website with guides, articles, and resources...'
                    value={formData.customDescription}
                    onChange={(e) =>
                      handleInputChange("customDescription", e.target.value)
                    }
                    disabled={state.isProcessing}
                    rows={3}
                  />
                </div>

                {/* Priority Threshold */}
                <div className='space-y-2'>
                  <Label htmlFor='priorityThreshold'>
                    Priority Threshold: {formData.priorityThreshold}%
                  </Label>
                  <Slider
                    id='priorityThreshold'
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.priorityThreshold]}
                    onValueChange={(value) =>
                      handleInputChange("priorityThreshold", value[0])
                    }
                    disabled={state.isProcessing}
                    className='w-full'
                  />
                  <p className='text-sm text-slate-500'>
                    Only include pages with priority above this threshold
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Include Paths */}
                  <div className='space-y-2'>
                    <Label htmlFor='includePaths'>Include Paths</Label>
                    <Input
                      id='includePaths'
                      placeholder='/blog, /guides, /docs'
                      value={formData.includePaths}
                      onChange={(e) =>
                        handleInputChange("includePaths", e.target.value)
                      }
                      disabled={state.isProcessing}
                    />
                    <p className='text-xs text-slate-500'>
                      Comma-separated paths to include (leave empty for all)
                    </p>
                  </div>

                  {/* Exclude Paths */}
                  <div className='space-y-2'>
                    <Label htmlFor='excludePaths'>Exclude Paths</Label>
                    <Input
                      id='excludePaths'
                      placeholder='/admin, /private, /temp'
                      value={formData.excludePaths}
                      onChange={(e) =>
                        handleInputChange("excludePaths", e.target.value)
                      }
                      disabled={state.isProcessing}
                    />
                    <p className='text-xs text-slate-500'>
                      Comma-separated paths to exclude
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <Button
                onClick={processSitemap}
                disabled={state.isProcessing || !formData.sitemapUrl.trim()}
                className='flex-1'
                size='lg'
              >
                {state.isProcessing ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    <Globe className='h-4 w-4 mr-2' />
                    Generate LLMS.txt
                  </>
                )}
              </Button>

              {state.isProcessing && (
                <Button onClick={stopProcessing} variant='outline' size='lg'>
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {(state.isProcessing || state.message) && (
          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                {state.isProcessing ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : state.result ? (
                  <CheckCircle2 className='h-5 w-5 text-green-600' />
                ) : (
                  <AlertCircle className='h-5 w-5 text-red-600' />
                )}
                Processing Status
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {state.total > 0 && (
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Progress</span>
                    <span>
                      {state.progress}/{state.total} pages
                    </span>
                  </div>
                  <Progress value={progressPercentage} className='h-2' />
                </div>
              )}

              {state.message && (
                <div className='flex items-center gap-2'>
                  <Badge
                    variant={
                      state.result
                        ? "default"
                        : state.error
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {state.message}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {state.error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {/* Result */}
        {state.result && (
          <Card className='shadow-lg'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    Generated LLMS.txt
                  </CardTitle>
                  <CardDescription>
                    Your LLMS.txt file has been generated successfully
                  </CardDescription>
                </div>
                <Button
                  onClick={() => downloadResult(state.result!)}
                  variant='outline'
                  size='sm'
                >
                  <Download className='h-4 w-4 mr-2' />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Separator />
                <div className='bg-slate-50 rounded-lg p-4 max-h-96 overflow-auto'>
                  <pre className='text-sm whitespace-pre-wrap font-mono text-slate-800'>
                    {state.result}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
