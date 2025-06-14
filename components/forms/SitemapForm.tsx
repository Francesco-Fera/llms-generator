import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Globe, Loader2 } from "lucide-react";
import { AdvancedOptions } from "./AdvancedOptions";

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

interface SitemapFormProps {
  formData: FormData;
  isProcessing: boolean;
  onInputChange: (
    field: keyof FormData,
    value: string | number | boolean
  ) => void;
  onSubmit: () => void;
  onStop: () => void;
}

export function SitemapForm({
  formData,
  isProcessing,
  onInputChange,
  onSubmit,
  onStop,
}: SitemapFormProps) {
  return (
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
        <div className='space-y-2'>
          <Label htmlFor='sitemapUrl'>Sitemap URL *</Label>
          <Input
            id='sitemapUrl'
            type='url'
            placeholder='https://example.com/sitemap.xml'
            value={formData.sitemapUrl}
            onChange={(e) => onInputChange("sitemapUrl", e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Switch
            id='advanced-options'
            checked={formData.useAdvancedOptions}
            onCheckedChange={(checked) =>
              onInputChange("useAdvancedOptions", checked)
            }
            disabled={isProcessing}
          />
          <Label htmlFor='advanced-options'>Show advanced options</Label>
        </div>

        {formData.useAdvancedOptions && (
          <AdvancedOptions
            formData={formData}
            isProcessing={isProcessing}
            onInputChange={onInputChange}
          />
        )}

        <div className='flex gap-3'>
          <Button
            onClick={onSubmit}
            disabled={isProcessing || !formData.sitemapUrl.trim()}
            className='flex-1'
            size='lg'
          >
            {isProcessing ? (
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

          {isProcessing && (
            <Button onClick={onStop} variant='outline' size='lg'>
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
