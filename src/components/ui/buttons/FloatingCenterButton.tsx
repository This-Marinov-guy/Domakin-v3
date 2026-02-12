import React from "react";

interface FloatingCenterButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

/**
 * Reusable floating bottom-center CTA button.
 * Used on careers page ("Apply now") and lending page ("List").
 */
const FloatingCenterButton: React.FC<FloatingCenterButtonProps> = ({
  label,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className ?? "btn-nine"} floating-apply-btn`}
      style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        padding: "7px 20px",
        fontSize: "18px",
        fontWeight: 500,
        borderRadius: "50px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        animation: "fadeInUp 0.3s ease-in-out",
        transition: "all 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
        e.currentTarget.style.boxShadow = "0 6px 25px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(-50%) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
      }}
    >
      {label}
    </button>
  );
};

export default FloatingCenterButton;

