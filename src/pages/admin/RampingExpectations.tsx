import { CustomAppLayout } from "@/components/Layout/CustomAppLayout";
import { RampingPeriodTable } from "@/components/RampingPeriodTable";

export default function RampingExpectations() {
  return (
    <CustomAppLayout>
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <RampingPeriodTable />
        </div>
      </div>
    </CustomAppLayout>
  );
}