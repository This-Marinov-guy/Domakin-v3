import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import CareersArea from "@/components/inner-pages/careers/CareersArea";
import BreadcrumbTwo from "@/components/common/breadcrumb/BreadcrumbTwo";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

const Careers = () => {
  const { t } = useTranslation("translations");

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: "Home", url: "https://www.domakin.nl" },
    { name: t("careers.title"), url: "https://www.domakin.nl/careers" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Head>
        <title>{`${t("careers.title")} | Domakin`}</title>
        <meta name="description" content={t("careers.meta_description")} />
        <meta
          name="keywords"
          content="careers, jobs, viewing agents, property seekers, Netherlands, flexible work, commission based"
        />
        <link rel="canonical" href="https://www.domakin.nl/careers" />

        {/* Open Graph meta tags */}
        <meta property="og:title" content={`${t("careers.title")} | Domakin`} />
        <meta
          property="og:description"
          content={t("careers.meta_description")}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.domakin.nl/careers" />
        <meta property="og:site_name" content="Domakin" />
      </Head>
      <HeaderOne style={true} />
      <BreadcrumbTwo
        title={t("careers.title")}
        sub_title={t("careers.title")}
        bg={28}
      />
      <CareersArea />
      <FancyBanner />
      <FooterFour />
    </>
  );
};

export default Careers;

