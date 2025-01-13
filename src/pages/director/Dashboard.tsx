import React from 'react';
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import { DirectorStats } from '@/components/Dashboard/DirectorStats';
import { TrainingProgress } from '@/components/Dashboard/TrainingProgress';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const DashboardPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  // Fetch user role only when user is available
  const { data: userRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
    enabled: !!user?.id
  });

  // Fetch sales reps data based on role when role is available
  const { data: salesRepsData, isLoading: isDataLoading } = useQuery({
    queryKey: ['salesReps', user?.id, userRole],
    queryFn: async () => {
      if (!user?.id || !userRole) throw new Error('User or role not available');

      let query = supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'sales_rep');

      // If manager, only fetch their sales reps
      if (userRole === 'manager') {
        query = query.eq('manager_id', user.id);
      }

      const { data: salesReps, error } = await query;
      if (error) throw error;

      if (!salesReps?.length) {
        return { salesReps: [], profiles: [], scores: [] };
      }

      // Fetch profiles and scores
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', salesReps.map(rep => rep.user_id));

      if (profilesError) throw profilesError;

      const { data: scores, error: scoresError } = await supabase
        .from('assessment_scores')
        .select('*')
        .in('sales_rep_id', salesReps.map(rep => rep.user_id));

      if (scoresError) throw scoresError;

      return {
        salesReps,
        profiles: profiles || [],
        scores: scores || []
      };
    },
    enabled: !!user?.id && !!userRole
  });

  const isLoading = isAuthLoading || isRoleLoading || isDataLoading;

  if (isLoading) {
    return (
      <CustomAppLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CustomAppLayout>
    );
  }

  if (!user || !userRole || !salesRepsData) {
    return (
      <CustomAppLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Unable to load dashboard data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </CustomAppLayout>
    );
  }

  const calculateMetrics = () => {
    const { profiles, scores } = salesRepsData;
    
    // Calculate average scores per rep
    const repScores = profiles.map(profile => {
      const repScores = scores.filter(score => score.sales_rep_id === profile.id);
      const avgScore = repScores.length > 0
        ? repScores.reduce((sum, score) => sum + Number(score.score), 0) / repScores.length
        : 0;
      
      return {
        name: profile.full_name,
        avgScore: Number(avgScore.toFixed(1))
      };
    });

    const totalReps = profiles.length;
    const avgScore = totalReps > 0 
      ? (repScores.reduce((sum, rep) => sum + rep.avgScore, 0) / totalReps).toFixed(1)
      : '0.0';
    const performingWellCount = repScores.filter(rep => rep.avgScore > 3).length;
    const topPerformer = repScores.reduce((top, rep) => 
      rep.avgScore > top.score ? { name: rep.name, score: rep.avgScore } : top,
      { name: "No reps", score: 0 }
    );

    return {
      totalReps,
      avgScore,
      performingWellCount,
      topPerformer
    };
  };

  const metrics = calculateMetrics();

  return (
    <CustomAppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Director Dashboard</h1>
        
        <DirectorStats
          totalReps={metrics.totalReps}
          averageScore={metrics.avgScore}
          performingWellCount={metrics.performingWellCount}
          topPerformer={metrics.topPerformer}
        />

        <div className="grid grid-cols-1 gap-6">
          <TrainingProgress />
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default DashboardPage;