import { getAllProjects, getStats } from "@/lib/projects";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardClient from "@/components/DashboardClient";

export default function HomePage() {
  const projects = getAllProjects();
  const rawStats = getStats();

  const stats = {
    totalProjects: rawStats.total ?? 0,
    activeWIP: rawStats.dev ?? 0,
    ecosystemTools: (rawStats.ready ?? 0) + (rawStats.dev ?? 0),
    releasedCount: rawStats.ready ?? 0,
  };

  return (
    <DashboardLayout stats={stats}>
      <DashboardClient projects={projects} stats={rawStats} />
    </DashboardLayout>
  );
}
