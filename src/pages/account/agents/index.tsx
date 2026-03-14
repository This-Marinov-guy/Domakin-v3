import AgentsListBody from "@/components/dashboard/agents/AgentsListBody";
import DashboardFrame from "@/layouts/frames/DashboardFrame";

export const metadata = {
  title: "Agents",
};

const AgentsPage = () => {
  return (
    <DashboardFrame title="Agents">
      <AgentsListBody />
    </DashboardFrame>
  );
};

export default AgentsPage;
