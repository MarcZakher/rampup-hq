import React from "react";
import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";

export default function ManagerDashboard() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
        {/* Add your dashboard components here */}
      </div>
    </CustomAppLayout>
  );
}
