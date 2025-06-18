"use client";

import { PageHeader } from "@/components/common/PageHeader";
import Hero from "@/components/features/Hero";
import { ProgressTracker } from "@/components/features/ProgressTracker";
import { ResultDisplay } from "@/components/features/ResultDisplay";
import { SitemapForm } from "@/components/forms/SitemapForm";
import { useLLMSGenerator } from "@/hooks/useLLMSGenerator";

export default function LLMSGeneratorPage() {
  const {
    formData,
    state,
    handleInputChange,
    processSitemap,
    stopProcessing,
    downloadResult,
  } = useLLMSGenerator();

  return (
    <div className=''>
      <Hero />

      <div className='max-w-4xl mx-auto space-y-6' id='generate'>
        <SitemapForm
          formData={formData}
          isProcessing={state.isProcessing}
          onInputChange={handleInputChange}
          onSubmit={processSitemap}
          onStop={stopProcessing}
        />

        <ProgressTracker state={state} />

        {state.result && (
          <ResultDisplay result={state.result} onDownload={downloadResult} />
        )}
      </div>
    </div>
  );
}
