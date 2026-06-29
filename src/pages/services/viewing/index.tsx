import ViewingPage from "@/components/inner-pages/services/detail-page/ViewingPage";
import Wrapper from "@/layouts/Wrapper";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import {
  createServiceFaqJsonLd,
  createServiceJsonLd,
  getServiceAnswerData,
} from "@/components/inner-pages/services/ServiceAnswerBlock";
import { SHARE_BANNERS } from "@/utils/shareBanners";

const index = () => {
  const router = useRouter();
  const { t, lang } = useTranslation("translations");
  
  const baseUrl = "https://www.domakin.nl";
  const currentUrl = `${baseUrl}${router.asPath}`;
  const serviceAnswerData = getServiceAnswerData("viewing");
  
  // Get localized content
  const title = lang === "en" 
    ? "Remote Property Viewing Service Netherlands | Domakin"
    : lang === "bg"
    ? "Услуга за огледи | Domakin - Помощ при огледи на имоти в Нидерландия"
    : "Υπηρεσία Προβολής | Domakin - Βοήθεια στην Προβολή Ακινήτων στην Ολλανδία";
  
  const description = lang === "en"
    ? "Book a remote property viewing in the Netherlands. Domakin agents attend rental viewings for students abroad or in another city and send photos, video, and practical feedback."
    : lang === "bg"
    ? "Нека нашите агенти присъстват на огледите вместо вас. Предоставяме снимки, видеоклипове и подробна обратна връзка, за да ви помогнем да вземете информирано решение за настаняване в Нидерландия."
    : "Αφήστε τους πράκτορές μας να παρακολουθήσουν τις προβολές ακινήτων εκ μέρους σας. Παρέχουμε φωτογραφίες, βίντεο και λεπτομερή ανατροφοδότηση για να σας βοηθήσουμε να πάρετε ενημερωμένες αποφάσεις για τη διαμονή στην Ολλανδία.";
  
  const ogImage = SHARE_BANNERS.viewing;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Domakin" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:locale" content={lang === "en" ? "en_US" : lang === "bg" ? "bg_BG" : "el_GR"} />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={title} />
        
        {/* Additional meta tags */}
        <meta name="keywords" content={lang === "en" 
          ? "remote property viewing, remote viewing service, property viewing service Netherlands, rental viewing Netherlands, student housing viewing, accommodation viewing"
          : lang === "bg"
          ? "оглед на имот, услуга за огледи, Нидерландия, студентско жилище, оглед на настаняване"
          : "προβολή ακινήτου, υπηρεσία προβολής, Ολλανδία, φοιτητική στέγαση"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createServiceJsonLd(serviceAnswerData, currentUrl)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createServiceFaqJsonLd(serviceAnswerData)),
          }}
        />
      </Head>
      <Wrapper>
        <ViewingPage />
      </Wrapper>
    </>
  );
};

export default index;
