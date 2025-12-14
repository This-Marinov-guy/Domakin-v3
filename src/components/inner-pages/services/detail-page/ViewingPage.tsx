import BreadcrumbThree from "@/components/common/breadcrumb/BreadcrumbThree";
import Brand from "@/components/homes/home-five/Brand";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import BlockFeatureThree from "../service-one/ServicesList";
import FancyBanner from "@/components/common/FancyBanner";
import CardStyleOne from "@/components/common/CardStyleOne";
import StepDescriptionOne from "@/components/common/StepDescriptionOne";
import useTranslation from "next-translate/useTranslation";
import ViewingForm from "@/components/forms/ViewingForm";
import Link from "next/link";

const ViewingPage = () => {
  const {t} = useTranslation('translations');

  const details = {
    title: t("viewing.let_us_make_the_viewing_for_you"),
    description: [t("viewing.description"), t("viewing.service_offer")],
    steps: [
      {
        icon: "fa-solid fa-user",
        text: t("viewing.step_1"),
      },
      {
        icon: "fa-solid fa-clock",
        text: t("viewing.step_2"),
      },
      {
        icon: "fa-solid fa-handshake",
        text: t("viewing.step_3"),
      },
    ],
  };

  return (
    <>
      <HeaderOne />
      <BreadcrumbThree
        title={t("viewing.viewing_service")}
        link_title={t("features.viewings")}
        style={false}
      />
      <StepDescriptionOne details={details} />
      <div className="container mt-50 mb-50 text-center">
        <div 
          className="pricing-policy-banner p-4 rounded-3" 
          style={{ 
            backgroundColor: '#004AAD',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0px 10px 30px rgba(0, 74, 173, 0.3), 0px 4px 10px rgba(0, 74, 173, 0.2)'
          }}
        >
          <h5 className="mb-3 text-white">
            {(() => {
              const title = t("viewing.pricing_policy_banner_title");
              const pricingText = t("viewing.pricing_link");
              const policyText = t("viewing.policy_link");
              
              // Escape special regex characters
              const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              
              // Create a regex to find pricing and policy words (case-insensitive)
              const parts = [];
              let lastIndex = 0;
              const regex = new RegExp(`(${escapeRegex(pricingText)}|${escapeRegex(policyText)})`, 'gi');
              let match;
              
              while ((match = regex.exec(title)) !== null) {
                // Add text before the match
                if (match.index > lastIndex) {
                  parts.push(<span key={`text-${lastIndex}`}>{title.substring(lastIndex, match.index)}</span>);
                }
                
                // Add the link
                const matchedText = match[0];
                const isPricing = matchedText.toLowerCase() === pricingText.toLowerCase();
                parts.push(
                  <Link
                    key={`link-${match.index}`}
                    href={isPricing ? "/pricing" : "/terms&policy"}
                    className="text-white text-decoration-underline"
                  >
                    {matchedText}
                  </Link>
                );
                
                lastIndex = regex.lastIndex;
              }
              
              // Add remaining text
              if (lastIndex < title.length) {
                parts.push(<span key={`text-${lastIndex}`}>{title.substring(lastIndex)}</span>);
              }
              
              return parts.length > 0 ? parts : <span>{title}</span>;
            })()}
          </h5>
          <p className="mb-0 text-white">
            {t("viewing.pricing_policy_banner_description")}{" "}
          </p>
        </div>
      </div>
      <ViewingForm />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default ViewingPage;
