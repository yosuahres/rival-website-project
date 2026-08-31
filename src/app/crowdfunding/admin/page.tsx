import DonationsTable from "@/components/crowdfunding/DonationsTable";
import ProgressSettingsForm from "@/components/crowdfunding/ProgressSettingsForm";
import { getSiteSettings } from "@/lib/crowdfunding/settings";
import { createClient } from "@/lib/supabase/server";

export default async function DonationsPage() {
  const supabase = await createClient();
  const [{ data: donations }, settings] = await Promise.all([
    supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false }),
    getSiteSettings(),
  ]);

  return (
    <>
      <ProgressSettingsForm settings={settings} />
      <DonationsTable donations={donations ?? []} />
    </>
  );
}
