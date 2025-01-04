"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";
import { COOKIE_MODAL } from "@/utils/defines";
import { LOCAL_STORAGE_COOKIE_AGREED } from "@/utils/localstorage";
import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import useTranslation from "next-translate/useTranslation";

const CookiesModal = () => {
  const { modalStore } = useStore();

  const { t } = useTranslation("translations");

  const handleClose = () => {
    modalStore.closeModal();
    localStorage.setItem(LOCAL_STORAGE_COOKIE_AGREED, "1");
  };

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_COOKIE_AGREED) !== "1") {
      modalStore.setActiveModal(COOKIE_MODAL);
    }
  }, []);

  return (
    <Modal
      show={modalStore.modals[COOKIE_MODAL]}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title
          className="d-flex justify-content-center align-items-center w-100"
          id="contained-modal-title-vcenter"
        >
          <i
            className="fa-solid fa-cookie-bite mr-10"
            style={{ color: "#C88F57" }}
          ></i>{" "}
          {t("cookies.title")}
          <i
            className="fa-solid fa-cookie-bite ml-10"
            style={{ color: "#C88F57" }}
          ></i>{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <p>{t("cookies.content")}</p>
          <button
            onClick={handleClose}
            className="mt-20 m-a btn-nine text-uppercase rounded-3 fw-normal"
          >
            {t("common.agree")}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default observer(CookiesModal);
