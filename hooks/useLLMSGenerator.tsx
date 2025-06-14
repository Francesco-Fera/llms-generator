"use client";
import { useState, useRef, useCallback } from "react";

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

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  total: number;
  message: string;
  result: string | null;
  error: string | null;
}

export function useLLMSGenerator() {
  const [formData, setFormData] = useState<FormData>({
    sitemapUrl: "",
    concurrency: 8,
    priorityThreshold: 30,
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

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | number | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (state.error) {
        setState((prev) => ({ ...prev, error: null }));
      }
    },
    [state.error]
  );

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      progress: 0,
      total: 0,
      message: "",
      result: null,
      error: null,
    });
  }, []);

  const stopProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isProcessing: false,
      message: "Processing stopped by user",
    }));
  }, []);

  const downloadResult = useCallback(
    (content: string, filename: string = "llms.txt") => {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    []
  );

  const processSitemap = useCallback(async () => {
    if (!formData.sitemapUrl.trim()) {
      setState((prev) => ({ ...prev, error: "Please enter a sitemap URL" }));
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.sitemapUrl.trim());
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Please enter a valid URL" }));
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
  }, [formData, resetState]);

  return {
    formData,
    state,
    handleInputChange,
    processSitemap,
    stopProcessing,
    downloadResult,
    resetState,
  };
}
