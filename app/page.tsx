"use client";

import { PageHeader } from "@/components/common/PageHeader";
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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
      <div className='max-w-4xl mx-auto space-y-6'>
        <PageHeader />

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
