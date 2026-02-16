"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/storeContext";
import { COOKIE_MODAL } from "@/utils/defines";
import { LOCAL_STORAGE_COOKIE_AGREED } from "@/utils/localstorage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";

const CookiesModal = () => {
  const { modalStore } = useStore();
  const { t } = useTranslation("translations");
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const finishClose = useCallback(() => {
    setIsVisible(false);
    setIsExiting(false);
    setIsEntered(false);
    modalStore.closeModal();
  }, [modalStore]);

  const handleAcceptAll = () => {
    localStorage.setItem(LOCAL_STORAGE_COOKIE_AGREED, "all");
    setIsExiting(true);
  };

  const handleMandatoryOnly = () => {
    localStorage.setItem(LOCAL_STORAGE_COOKIE_AGREED, "mandatory");
    setIsExiting(true);
  };

  // Trigger enter animation: add --visible on next frame after mount
  useEffect(() => {
    if (!isVisible || isExiting) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [isVisible, isExiting]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookieAgreed = localStorage.getItem(LOCAL_STORAGE_COOKIE_AGREED);
    if (!cookieAgreed || cookieAgreed === "1") {
      if (cookieAgreed === "1") {
        localStorage.setItem(LOCAL_STORAGE_COOKIE_AGREED, "all");
      }
      setIsVisible(true);
      modalStore.setActiveModal(COOKIE_MODAL);
    }
  }, [modalStore]);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target !== bannerRef.current || e.propertyName !== "transform") return;
      if (isExiting) finishClose();
    },
    [isExiting, finishClose]
  );

  if (!isVisible) {
    return null;
  }

  const showVisibleClass = isEntered && !isExiting;

  return (
    <div
      ref={bannerRef}
      className={`cookie-banner ${showVisibleClass ? "cookie-banner--visible" : ""}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="container">
        <div className="cookie-banner__content">
          <div className="cookie-banner__text">
            <div className="cookie-banner__icon">
              <i className="fa-solid fa-cookie-bite" style={{ color: "#C88F57" }}></i>
            </div>
            <div className="cookie-banner__message">
              <h4 className="cookie-banner__title">{t("cookies.title")}</h4>
              <p className="cookie-banner__description">{t("cookies.content")}</p>
            </div>
          </div>
          <div className="cookie-banner__actions">
            <button
              onClick={handleMandatoryOnly}
              className="btn btn-outline-secondary cookie-banner__btn cookie-banner__btn--mandatory"
            >
              {t("cookies.mandatory_only") || `${t("common.mandatory")} Only`}
            </button>
            <button
              onClick={handleAcceptAll}
              className="btn btn-primary cookie-banner__btn cookie-banner__btn--accept"
            >
              {t("cookies.accept_all") || "Accept All"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(CookiesModal);
