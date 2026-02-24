import React, { useState } from "react";
import DashboardFrame from "@/layouts/frames/DashboardFrame";
import { Modal } from "react-bootstrap";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "—";

const SettingsBody = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { isInstalled, isIOS, triggerInstall } = usePWAInstall();

  const handleInstall = async () => {
    const result = await triggerInstall();
    if (result === "guide") {
      setShowGuide(true);
    }
  };

  const handleForceUpdate = async () => {
    setUpdating(true);
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }
    window.location.reload();
  };

  return (
    <DashboardFrame title="Settings">
      <ul className="bg-white card-box border-20 p-4 mt-20">
        <li>
          <div className="d-flex align-items-center gap-3 mb-3">
            <h5 className="m-0">Download App</h5>
          </div>
          <p className="text-muted mb-4">
            Install Domakin on your device for a faster, app-like experience —
            works offline and launches straight from your home screen.
          </p>

          {isInstalled ? (
            <div className="d-flex align-items-center gap-2 text-success">
              <i className="fa-regular fa-circle-check fs-5"></i>
              <span>App is already installed on this device.</span>
            </div>
          ) : isIOS ? (
            <ol className="mb-0 d-flex flex-column gap-2">
              <li>
                Open this page in <strong>Safari</strong> if you haven&apos;t
                already
              </li>
              <li>
                Tap the <strong>Share</strong> button{" "}
                <i className="fa-regular fa-arrow-up-from-bracket"></i> at the
                bottom of the screen
              </li>
              <li>
                Scroll down and tap <strong>Add to Home Screen</strong>
              </li>
              <li>
                Tap <strong>Add</strong> to confirm
              </li>
            </ol>
          ) : (
            <button className="btn-ten" onClick={handleInstall}>
              <i className="fa-regular fa-download me-2"></i>
              Install App
            </button>
          )}
        </li>
      </ul>

      <ul className="bg-white card-box border-20 p-4 mt-20">
        <li>
          <div className="d-flex flex-column align-items-start justify-content-start gap-3">
            <div className="d-flex align-items-center gap-2">
              <h5 className="m-0 mb-1">App Version</h5>
              <p className="text-muted m-0">v{APP_VERSION}</p>
            </div>
            <button
              className="btn-ten"
              onClick={handleForceUpdate}
              disabled={updating}
            >
              <i className={`fa-regular fa-rotate-right me-2 ${updating ? "fa-spin" : ""}`}></i>
              {updating ? "Updating..." : "Force Update"}
            </button>
          </div>
        </li>
      </ul>

      <Modal show={showGuide} onHide={() => setShowGuide(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Install Domakin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-500 mb-3">To install on your device:</p>
          <ul>
            <li className="mb-2">
              <strong>Chrome / Edge:</strong> click the install icon{" "}
              <i className="fa-regular fa-circle-plus"></i> in the address bar
            </li>
            <li className="mb-2">
              <strong>Android Chrome:</strong> tap the menu{" "}
              <i className="fa-regular fa-ellipsis-vertical"></i> and select{" "}
              <strong>Add to Home Screen</strong>
            </li>
            <li>
              <strong>Samsung Browser:</strong> tap the menu and choose{" "}
              <strong>Add page to</strong> → <strong>Apps screen</strong>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </DashboardFrame>
  );
};

export default SettingsBody;
