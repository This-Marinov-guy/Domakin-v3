import { useState } from "react";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "—";

const AppVersion = () => {
  const [updating, setUpdating] = useState(false);

  const handleForceUpdate = async () => {
    setUpdating(true);
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }
    window.location.reload();
  };

  return (
    <ul className="bg-white card-box border-20 p-4 mt-20">
      <li>
        <div className="d-flex flex-column align-items-start justify-content-start gap-3">
          <div className="d-flex align-items-center gap-2">
            <h5 className="m-0 mb-1">App Version</h5>
            <p className="text-muted m-0">v{APP_VERSION}</p>
          </div>
          <button
            className="btn-eleven"
            onClick={handleForceUpdate}
            disabled={updating}
          >
            <i className={`fa-regular fa-rotate-right me-2 ${updating ? "fa-spin" : ""}`}></i>
            {updating ? "Updating..." : "Force Update"}
          </button>
        </div>
      </li>
    </ul>
  );
};

export default AppVersion;
