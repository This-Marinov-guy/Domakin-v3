import DashboardFrame from "@/layouts/frames/DashboardFrame";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import NotificationSettings from "./NotificationSettings";
import DownloadApp from "./DownloadApp";
import AppVersion from "./AppVersion";

const SettingsBody = () => {
  const { userStore: { isAdmin } } = useStore();

  return (
    <DashboardFrame title="Settings">
      {isAdmin && <NotificationSettings />}
      <DownloadApp />
      <AppVersion />
    </DashboardFrame>
  );
};

export default observer(SettingsBody);
