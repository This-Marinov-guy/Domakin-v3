import useOnScreen from "@/hooks/useOnScreen";
import useTranslation from "next-translate/useTranslation";
import React, { useState, useEffect, useCallback, useRef } from "react";

const ScreenButton = ({
  refElement,
}: {
  refElement: React.RefObject<HTMLElement>;
}) => {
  const isVisible = useOnScreen(refElement);

  const { t } = useTranslation("translations");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const scrollToRef = () => {
    setTimeout(() => {
      if (refElement.current) {
        refElement.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <button
      ref={buttonRef} // Add ref to the button element
      onClick={scrollToRef}
      className={`btn-six centered-btn ${isVisible ? "fade-out" : "fade-in"}`}
      style={{ display: isVisible ? "none" : "block" }} // Hide the button when visible
    >
      {t("renting.apply_now")}
    </button>
  );
};

export default ScreenButton;
