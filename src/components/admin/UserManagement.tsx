import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  role: "sales_rep" | "manager" | "director";
};

export function UserManagement() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // First, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Then, get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        throw rolesError;
      }

      // Combine the data
      return profiles.map((profile: any) => {
        const userRole = userRoles.find((role: any) => role.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: userRole?.role || "sales_rep",
        };
      }) as User[];
    },
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (deleteError) throw deleteError;

      toast({
        title: "User deleted successfully",
        description: "The user has been removed from the system.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Error deleting user",
        description: "There was a problem deleting the user. Please try again.",
      });
    }
  };

  const filterUsersByRole = (users: User[] | undefined, role: User["role"]) => {
    return users?.filter((user) => user.role === role) || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderUserTable = (users: User[], role: string) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Sales Representatives</h2>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
        {renderUserTable(filterUsersByRole(users, "sales_rep"), "Sales Representatives")}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Managers</h2>
        {renderUserTable(filterUsersByRole(users, "manager"), "Managers")}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Directors</h2>
        {renderUserTable(filterUsersByRole(users, "director"), "Directors")}
      </div>
    </div>
  );
}