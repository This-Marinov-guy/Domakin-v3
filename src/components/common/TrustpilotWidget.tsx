import { useEffect, useRef } from "react";
import Script from "next/script";
import {
  TRUSTPILOT_BOOTSTRAP_SRC,
  TRUSTPILOT_BUSINESS_UNIT_ID,
  TRUSTPILOT_EVALUATE_URL,
} from "@/utils/config";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement?: (el: HTMLElement | null, forceReload?: boolean) => void;
    };
  }
}

type TrustpilotWidgetProps = {
  templateId: string;
  /** Required for the Review Collector template. */
  token?: string;
  height?: string;
  width?: string;
  theme?: "light" | "dark";
  locale?: string;
  /** Extra data-* attributes for specific templates (e.g. stars, reviewLanguages). */
  extraProps?: Record<string, string>;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Renders an official Trustpilot TrustBox. Requires NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID.
 * When the business unit id is missing the widget renders nothing (no broken box).
 */
const TrustpilotWidget = ({
  templateId,
  token,
  height = "52px",
  width = "100%",
  theme = "light",
  locale = "en-US",
  extraProps,
  className,
  style,
}: TrustpilotWidgetProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TRUSTPILOT_BUSINESS_UNIT_ID) return;

    let attempts = 0;
    const render = () => {
      if (window.Trustpilot?.loadFromElement && ref.current) {
        window.Trustpilot.loadFromElement(ref.current, true);
        return true;
      }
      return false;
    };

    if (render()) return;

    // The bootstrap script may not be ready on first mount — retry briefly.
    const interval = setInterval(() => {
      attempts += 1;
      if (render() || attempts > 40) {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [templateId]);

  if (!TRUSTPILOT_BUSINESS_UNIT_ID) {
    return null;
  }

  return (
    <>
      <Script src={TRUSTPILOT_BOOTSTRAP_SRC} strategy="afterInteractive" />
      <div
        ref={ref}
        className={`trustpilot-widget ${className ?? ""}`}
        style={style}
        data-locale={locale}
        data-template-id={templateId}
        data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
        data-style-height={height}
        data-style-width={width}
        data-theme={theme}
        {...(token ? { "data-token": token } : {})}
        {...extraProps}
      >
        <a href={TRUSTPILOT_EVALUATE_URL} target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
    </>
  );
};

export default TrustpilotWidget;
