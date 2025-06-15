"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";
import { COOKIE_MODAL, LONG_LOADING_MODAL } from "@/utils/defines";
import { LOCAL_STORAGE_COOKIE_AGREED } from "@/utils/localstorage";
import React, { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import useTranslation from "next-translate/useTranslation";

const LongLoadingModal = () => {
  const { modalStore } = useStore();

  const { t } = useTranslation("translations");

  const [percentage, setPercentage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const closingRef = useRef(false);
  const wasOpenRef = useRef(false);

  // Start and increment percentage when modal opens
  useEffect(() => {
    if (modalStore.modals[LONG_LOADING_MODAL]) {
      wasOpenRef.current = true;
      closingRef.current = false;
      setPercentage(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setPercentage((prev) => {
          if (prev < 99) {
            return prev + 1;
          } else {
            return prev;
          }
        });
      }, 80); // Even slower speed
    } else if (wasOpenRef.current && !modalStore.modals[LONG_LOADING_MODAL]) {
      // Modal is closing
      closingRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPercentage(100);
      setTimeout(() => {
        modalStore.closeModal();
        closingRef.current = false;
        wasOpenRef.current = false;
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalStore.modals[LONG_LOADING_MODAL]]);

  // Prevent percentage from going above 100
  useEffect(() => {
    if (percentage >= 100 && !closingRef.current) {
      closingRef.current = true;
      setTimeout(() => {
        modalStore.closeModal();
        closingRef.current = false;
        wasOpenRef.current = false;
      }, 1000);
    }
  }, [percentage, modalStore]);

  return (
    <Modal
      show={modalStore.modals[LONG_LOADING_MODAL]}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title
          className="d-flex justify-content-center align-items-center w-100"
          id="contained-modal-title-vcenter"
        >
          {t("modal.long_loading.title")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container text-center">
          {t("modal.long_loading.description")}
          <div className="mb-2" style={{ fontWeight: "bold" }}>
            {percentage}%
          </div>
          <div
            className="progress my-2"
            style={{ height: 4, background: "#e9ecef" }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${percentage}%`,
                backgroundColor: "#007bff",
                transition: "width 0.08s linear",
              }}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default observer(LongLoadingModal);
