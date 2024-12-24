"use client";

import { useStore } from "@/stores/storeContext";
import { COOKIE_MODAL } from "@/utils/defines";
import { LOCAL_STORAGE_COOKIE_AGREED } from "@/utils/localstorage";
import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";

const CookiesModal = () => {
  const { modalStore } = useStore();
  
  const showCookieModal =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(LOCAL_STORAGE_COOKIE_AGREED);
  
  useEffect(() => {
    if (showCookieModal !== "1") {
      modalStore.setActiveModal(COOKIE_MODAL);
    }
  }, [showCookieModal]);

  return (
    <Modal
      show={modalStore.modals[COOKIE_MODAL]}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <i className="fa-solid fa-cookie-bite"></i> Cookie Policy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <p>
            To gurantee a smooth experience we from our clients to accept the
            mandatory cookies before using the website
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CookiesModal;
