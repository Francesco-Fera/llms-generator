import React from 'react';
import { Globe } from 'lucide-react';

export function PageHeader() {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="flex items-center justify-center gap-3">
        <Globe className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          LLMS.txt Generator
        </h1>
      </div>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Transform your website sitemap into a structured LLMS.txt file for AI training and documentation
      </p>
    </div>
  );
}