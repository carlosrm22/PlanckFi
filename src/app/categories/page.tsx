import { AppShell } from "@/components/layout/app-shell";
import { CategoryManagement } from "@/components/dashboard/category-management";

export default function CategoriesPage() {
  return (
    <AppShell>
      <CategoryManagement />
    </AppShell>
  );
}
