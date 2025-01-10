import React from 'react';
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

// Sample data - replace with your actual data source
const performanceData = [
  { month: 'Jan', revenue: 4000, deals: 24, conversion: 65 },
  { month: 'Feb', revenue: 3000, deals: 18, conversion: 59 },
  { month: 'Mar', revenue: 2000, deals: 15, conversion: 48 },
  { month: 'Apr', revenue: 2780, deals: 20, conversion: 55 },
  { month: 'May', revenue: 1890, deals: 14, conversion: 40 },
  { month: 'Jun', revenue: 2390, deals: 17, conversion: 44 },
];

const teamPerformance = [
  { name: 'Team A', achieved: 85, target: 100 },
  { name: 'Team B', achieved: 92, target: 100 },
  { name: 'Team C', achieved: 78, target: 100 },
  { name: 'Team D', achieved: 95, target: 100 },
];

const AnalyticsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Deals Closed */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Deals Closed</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="deals" 
                fill="#82ca9d" 
                name="Deals Closed"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion Rate */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Conversion Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conversion" 
                stroke="#ff7300" 
                name="Conversion Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Performance */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Team Performance vs Target</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="achieved" fill="#8884d8" name="Achieved" />
              <Bar dataKey="target" fill="#82ca9d" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;