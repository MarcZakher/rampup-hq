import { useState } from 'react';
import { pipeline, TextClassificationOutput } from '@huggingface/transformers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface SalesRep {
  name: string;
  month1: number[];
  month2: number[];
  month3: number[];
  manager: string;
}

export function AIInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string>('');

  const analyzeSalesData = async () => {
    setLoading(true);
    try {
      // Get sales data from localStorage
      const salesReps: SalesRep[] = JSON.parse(localStorage.getItem('salesReps') || '[]');
      
      if (salesReps.length === 0) {
        toast.error('No sales data available for analysis');
        return;
      }

      // Prepare data for analysis
      const dataForAnalysis = salesReps.map(rep => ({
        name: rep.name,
        averageScore: [...rep.month1, ...rep.month2, ...rep.month3]
          .reduce((sum, score) => sum + score, 0) / 
          [...rep.month1, ...rep.month2, ...rep.month3].length,
        trend: calculateTrend(rep),
      }));

      // Initialize the text classification pipeline
      const classifier = await pipeline(
        'text-classification',
        'SamLowe/roberta-base-go_emotions',
        { device: 'cpu' }
      );

      // Generate insights text
      const insightText = generateInsightsText(dataForAnalysis);
      
      // Analyze the sentiment/emotion of the insights
      const emotions = await classifier(insightText) as TextClassificationOutput[];
      const emotionLabel = Array.isArray(emotions) && emotions.length > 0 
        ? emotions[0].label || 'neutral'
        : 'neutral';
      
      // Combine everything into a comprehensive analysis
      const finalInsight = `
Performance Analysis Summary:

${insightText}

Key Observations:
- ${dataForAnalysis.length} sales representatives analyzed
- Team average performance: ${calculateTeamAverage(dataForAnalysis)}
- Top performer: ${findTopPerformer(dataForAnalysis)}
- Most improved: ${findMostImproved(salesReps)}

AI Sentiment Analysis: This report indicates a ${emotionLabel} outlook for the team's performance.
      `.trim();

      setInsights(finalInsight);
      toast.success('Analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing data:', error);
      toast.error('Failed to analyze data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (rep: SalesRep) => {
    const month1Avg = rep.month1.reduce((sum, score) => sum + score, 0) / rep.month1.length;
    const month3Avg = rep.month3.reduce((sum, score) => sum + score, 0) / rep.month3.length;
    return month3Avg - month1Avg;
  };

  const generateInsightsText = (data: Array<{ name: string; averageScore: number; trend: number }>) => {
    const trends = data.map(d => d.trend);
    const avgTrend = trends.reduce((sum, trend) => sum + trend, 0) / trends.length;
    
    return `
The sales team shows ${avgTrend > 0 ? 'positive' : 'concerning'} performance trends. 
${avgTrend > 0 
  ? 'There is consistent improvement across most team members.' 
  : 'Some team members may need additional support and training.'}
    `.trim();
  };

  const calculateTeamAverage = (data: Array<{ averageScore: number }>) => {
    const avg = data.reduce((sum, d) => sum + d.averageScore, 0) / data.length;
    return avg.toFixed(2);
  };

  const findTopPerformer = (data: Array<{ name: string; averageScore: number }>) => {
    return data.reduce((top, current) => 
      current.averageScore > top.averageScore ? current : top
    ).name;
  };

  const findMostImproved = (reps: SalesRep[]) => {
    return reps.reduce((mostImproved, current) => {
      const currentImprovement = calculateTrend(current);
      const previousBestImprovement = calculateTrend(mostImproved);
      return currentImprovement > previousBestImprovement ? current : mostImproved;
    }).name;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Powered Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={analyzeSalesData} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              'Generate AI Insights'
            )}
          </Button>
          
          {insights && (
            <div className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
              {insights}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}