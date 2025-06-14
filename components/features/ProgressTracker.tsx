import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  total: number;
  message: string;
  result: string | null;
  error: string | null;
}

interface ProgressTrackerProps {
  state: ProcessingState;
}

export function ProgressTracker({ state }: ProgressTrackerProps) {
  const progressPercentage =
    state.total > 0 ? (state.progress / state.total) * 100 : 0;

  if (!state.isProcessing && !state.message && !state.error) {
    return null;
  }

  return (
    <div className='space-y-4'>
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

      {state.error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
