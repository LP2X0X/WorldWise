import styles from "./AppLayout.module.css";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";

// Layout of the main app
function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
    </div>
  );
}

export default AppLayout;
