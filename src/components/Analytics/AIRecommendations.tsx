import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIRecommendationsProps {
  recommendations: string | null;
  isLoading: boolean;
  error: string | null;
}

export function AIRecommendations({ recommendations, isLoading, error }: AIRecommendationsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {!isLoading && !error && recommendations && (
          <div className="prose prose-sm max-w-none">
            {recommendations.split('\n').map((line, index) => (
              line.trim() && (
                <p key={index} className="mb-2">
                  {line}
                </p>
              )
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}