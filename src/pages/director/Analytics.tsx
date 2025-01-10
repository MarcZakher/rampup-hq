import React from 'react';
import { Card } from "@/components/ui/card";
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const performanceData = [
  { month: 'Jan', revenue: 4000, deals: 24, conversion: 65, pipeline: 8000 },
  { month: 'Feb', revenue: 3000, deals: 18, conversion: 59, pipeline: 6500 },
  { month: 'Mar', revenue: 2000, deals: 15, conversion: 48, pipeline: 5000 },
  { month: 'Apr', revenue: 2780, deals: 20, conversion: 55, pipeline: 6000 },
  { month: 'May', revenue: 1890, deals: 14, conversion: 40, pipeline: 4500 },
  { month: 'Jun', revenue: 2390, deals: 17, conversion: 44, pipeline: 5500 },
];

const teamPerformance = [
  { name: 'Team A', achieved: 85, target: 100 },
  { name: 'Team B', achieved: 92, target: 100 },
  { name: 'Team C', achieved: 78, target: 100 },
  { name: 'Team D', achieved: 95, target: 100 },
];

const salesByProduct = [
  { name: 'Product A', value: 400 },
  { name: 'Product B', value: 300 },
  { name: 'Product C', value: 200 },
  { name: 'Product D', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const leadSourceData = [
  { source: 'Website', leads: 120, conversion: 25 },
  { source: 'Referral', leads: 80, conversion: 40 },
  { source: 'Social', leads: 60, conversion: 15 },
  { source: 'Direct', leads: 40, conversion: 30 },
];

const AnalyticsPage = () => {
  return (
    <CustomAppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold">$16,060</p>
            <span className="text-green-500 text-sm">+12% from last month</span>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Deals Closed</h3>
            <p className="text-2xl font-bold">108</p>
            <span className="text-red-500 text-sm">-3% from last month</span>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Avg Deal Size</h3>
            <p className="text-2xl font-bold">$148.70</p>
            <span className="text-green-500 text-sm">+5% from last month</span>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Pipeline Value</h3>
            <p className="text-2xl font-bold">$35,500</p>
            <span className="text-green-500 text-sm">+8% from last month</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue and Pipeline Trends */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Revenue & Pipeline Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Revenue ($)"
                />
                <Area 
                  type="monotone" 
                  dataKey="pipeline" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Pipeline ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Sales by Product */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Sales by Product</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByProduct}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Lead Source Analysis */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Lead Source Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadSourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="leads" fill="#8884d8" name="Total Leads" />
                <Bar yAxisId="right" dataKey="conversion" fill="#82ca9d" name="Conversion %" />
              </BarChart>
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
    </CustomAppLayout>
  );
};

export default AnalyticsPage;
