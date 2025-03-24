import { supabase } from "@/utils/supabaseClient";
import DashboardPage from "@/components/DashboardPage";

export default async function Dashboard() {
  const { data: devices, error } = await supabase.from("user").select("id");

  if (error) {
    console.error("Error fetching devices:", error.message);
    return <div>Error fetching devices</div>;
  }

  return <DashboardPage devices={devices} />;
}
