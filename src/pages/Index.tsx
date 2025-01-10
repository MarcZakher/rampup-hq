import { Users, Target, Award, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
            <p className="text-muted-foreground">Here's an overview of your sales team's progress.</p>
          </div>
          <div className="space-x-4">
            <Link 
              to="/director/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View Director Dashboard
            </Link>
            <Link 
              to="/manager/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View Manager Dashboard
            </Link>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sales Reps"
            value="24"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="8 in training"
          />
          <StatCard
            title="Average Ramp Time"
            value="4.2 months"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Target: 6 months"
          />
          <StatCard
            title="Success Rate"
            value="87%"
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            description="Last 30 days"
          />
          <StatCard
            title="Top Performers"
            value="5"
            icon={<Award className="h-4 w-4 text-muted-foreground" />}
            description="Exceeded targets"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Team Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;