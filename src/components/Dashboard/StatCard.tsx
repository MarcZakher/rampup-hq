import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="border-rampup-light/20 hover:border-rampup-light/40 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-rampup-tertiary">{title}</CardTitle>
        <div className="text-rampup-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-rampup-primary">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}