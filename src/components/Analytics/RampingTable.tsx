import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RampingTableProps {
  data: {
    name: string;
    dmProgress: number;
    nbmProgress: number;
    scopePlusProgress: number;
    newLogoProgress: number;
    status: 'at-risk' | 'on-track' | 'exceeding';
  }[];
}

export function RampingTable({ data }: RampingTableProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      'at-risk': 'bg-red-100 text-red-800',
      'on-track': 'bg-green-100 text-green-800',
      'exceeding': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ramping Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rep Name</TableHead>
              <TableHead>DMs</TableHead>
              <TableHead>NBMs</TableHead>
              <TableHead>Scope+</TableHead>
              <TableHead>New Logos</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.dmProgress}%</TableCell>
                <TableCell>{row.nbmProgress}%</TableCell>
                <TableCell>{row.scopePlusProgress}%</TableCell>
                <TableCell>{row.newLogoProgress}%</TableCell>
                <TableCell>{getStatusBadge(row.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}