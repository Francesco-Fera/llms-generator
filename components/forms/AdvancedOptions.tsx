import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

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

interface AdvancedOptionsProps {
  formData: FormData;
  isProcessing: boolean;
  onInputChange: (
    field: keyof FormData,
    value: string | number | boolean
  ) => void;
}

export function AdvancedOptions({
  formData,
  isProcessing,
  onInputChange,
}: AdvancedOptionsProps) {
  return (
    <div className='space-y-6 p-4 bg-slate-50 rounded-lg border'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Custom Title */}
        <div className='space-y-2'>
          <Label htmlFor='customTitle'>Custom Title</Label>
          <Input
            id='customTitle'
            placeholder='My Website Documentation'
            value={formData.customTitle}
            onChange={(e) => onInputChange("customTitle", e.target.value)}
            disabled={isProcessing}
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
          onChange={(e) => onInputChange("customDescription", e.target.value)}
          disabled={isProcessing}
          rows={3}
        />
      </div>

      {/*
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
            onInputChange("priorityThreshold", value[0])
          }
          disabled={isProcessing}
          className='w-full'
        />
        <p className='text-sm text-slate-500'>
          Only include pages with priority above this threshold
        </p>
      </div> */}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Include Paths */}
        <div className='space-y-2'>
          <Label htmlFor='includePaths'>Include Paths</Label>
          <Input
            id='includePaths'
            placeholder='/blog, /guides, /docs'
            value={formData.includePaths}
            onChange={(e) => onInputChange("includePaths", e.target.value)}
            disabled={isProcessing}
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
            onChange={(e) => onInputChange("excludePaths", e.target.value)}
            disabled={isProcessing}
          />
          <p className='text-xs text-slate-500'>
            Comma-separated paths to exclude
          </p>
        </div>
      </div>
    </div>
  );
}
