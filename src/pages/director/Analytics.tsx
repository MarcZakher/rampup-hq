import React from 'react';
import { Card } from "@/components/ui/card";
import { CustomAppLayout } from '@/components/Layout/CustomAppLayout';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  monthlyScores,
  assessmentData,
  repPerformance,
  scoreDistribution,
  teamProgress
} from '@/lib/mockAnalyticsData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsPage = () => {
  return (
    <CustomAppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Performance Analytics</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Team Average Score</h3>
            <p className="text-2xl font-bold">4.1/5.0</p>
            <span className="text-green-500 text-sm">+0.3 from last month</span>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Reps Meeting Target</h3>
            <p className="text-2xl font-bold">{teamProgress.meetingTarget}%</p>
            <span className="text-green-500 text-sm">+5% from last month</span>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
            <p className="text-2xl font-bold">{teamProgress.completionRate}%</p>
            <span className="text-green-500 text-sm">+2% from last month</span>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Avg Improvement</h3>
            <p className="text-2xl font-bold">+{teamProgress.averageImprovement}</p>
            <span className="text-green-500 text-sm">Trending up</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Score Trends */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Score Trends (3 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgScore" stroke="#8884d8" name="Average Score" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Score Distribution */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Score Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Assessment Performance */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Assessment Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#8884d8" name="Success Rate %" />
                <Bar dataKey="avgScore" fill="#82ca9d" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Performers */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Individual Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={repPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="overallScore" fill="#8884d8" name="Overall Score" />
                <Bar dataKey="improvement" fill="#82ca9d" name="Improvement" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Improvement Trends */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Monthly Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="improving" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Improving"
                />
                <Area 
                  type="monotone" 
                  dataKey="declining" 
                  stackId="1"
                  stroke="#ff8042" 
                  fill="#ff8042" 
                  name="Declining"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Team Progress */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Assessment Completion Rates</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assessmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#8884d8" name="Completion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </CustomAppLayout>
  );
};

export default AnalyticsPage;