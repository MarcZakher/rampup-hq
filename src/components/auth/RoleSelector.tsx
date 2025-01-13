import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

/**
 * RoleSelector component for user role selection during authentication
 * @param selectedRole - Currently selected role
 * @param onRoleChange - Callback function when role changes
 */
export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role" className="text-gray-700">Select Your Role</Label>
      <Select onValueChange={onRoleChange} value={selectedRole}>
        <SelectTrigger id="role" className="w-full bg-white border-purple-200 focus:ring-purple-200">
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sales_rep">Sales Representative</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="director">Director</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}