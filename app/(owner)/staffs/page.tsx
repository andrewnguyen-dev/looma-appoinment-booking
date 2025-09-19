import { requireOwnerAuth } from "@/lib/auth-utils";
import { getUserSalon } from "@/lib/user-utils";
import { getSalonStaffWithOwnership } from "@/lib/staff-utils";
import { StaffManager } from "@/components/staff/staff-manager";

export default async function StaffsPage() {
  const session = await requireOwnerAuth();
  
  // Get the user's salon (owners are limited to one salon)
  const salon = await getUserSalon(session.user.id, "OWNER");

  if (!salon) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="text-muted-foreground">No salon found. Please contact support.</p>
      </div>
    );
  }

  // Get all staff for this salon with ownership information
  const staff = await getSalonStaffWithOwnership(salon.id);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage your salon staff and their settings.
        </p>
      </div>
      
      <StaffManager salonId={salon.id} staff={staff} />
    </div>
  );
}
