import useTranslation from "next-translate/useTranslation";
import { TRUSTPILOT_REVIEW_URL } from "@/utils/config";

const TrustpilotStars = () => (
  <span className="trustpilot-badge__stars" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 24 24" width="20" height="20">
        <rect width="24" height="24" fill="#00b67a" rx="2" />
        <path
          fill="#fff"
          d="M12 4.5l2.06 4.6 5.02.44-3.79 3.32 1.13 4.9L12 15.7l-4.42 2.56 1.13-4.9-3.79-3.32 5.02-.44z"
        />
      </svg>
    ))}
  </span>
);

type TrustpilotBadgeProps = {
  className?: string;
  align?: "start" | "center" | "end";
  buttonClassName?: string;
  withButton?: boolean;
};

/**
 * Self-hosted Trustpilot badge: a clickable Trustpilot icon that represents our
 * reviews plus a button, both opening the Domakin Trustpilot review page.
 * Used instead of the official TrustBox (display widgets aren't on the current plan).
 */
const TrustpilotBadge = ({
  className,
  align = "start",
  buttonClassName = "btn-eleven",
  withButton = true, 
}: TrustpilotBadgeProps) => {
  const { t } = useTranslation("translations");

  return (
    <div
      className={`trustpilot-badge trustpilot-badge--${align} ${className ?? ""}`}
    >
      <a
        href={TRUSTPILOT_REVIEW_URL}
        target="_blank"
        rel="noreferrer"
        className="trustpilot-badge__icon"
        aria-label="Domakin reviews on Trustpilot"
      >
        <TrustpilotStars />
        <span className="trustpilot-badge__word">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="#00b67a"
              d="M12 2l2.75 6.13 6.7.59-5.06 4.43 1.51 6.55L12 16.9 6.1 19.7l1.51-6.55L2.55 8.72l6.7-.59z"
            />
          </svg>
          Trustpilot
        </span>
      </a>
      {withButton && (
        <a
          href={TRUSTPILOT_REVIEW_URL}
          target="_blank"
          rel="noreferrer"
          className={buttonClassName}
        >
          {t("footer.review_us_on_trustpilot")}
        </a>
      )}
    </div>
  );
};

export default TrustpilotBadge;
