import ViewingPage from "@/components/inner-pages/services/detail-page/ViewingPage";
import Wrapper from "@/layouts/Wrapper";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const index = () => {
  const router = useRouter();
  const { t, lang } = useTranslation("translations");
  
  const baseUrl = "https://www.domakin.nl";
  const currentUrl = `${baseUrl}${router.asPath}`;
  
  // Get localized content
  const title = lang === "en" 
    ? "Viewing Service | Domakin - Property Viewing Assistance in Netherlands"
    : lang === "bg"
    ? "Услуга за огледи | Domakin - Помощ при огледи на имоти в Нидерландия"
    : "Υπηρεσία Προβολής | Domakin - Βοήθεια στην Προβολή Ακινήτων στην Ολλανδία";
  
  const description = lang === "en"
    ? "Let our agents attend property viewings on your behalf. We provide photos, videos, and detailed feedback to help you make informed decisions about accommodation in the Netherlands."
    : lang === "bg"
    ? "Нека нашите агенти присъстват на огледите вместо вас. Предоставяме снимки, видеоклипове и подробна обратна връзка, за да ви помогнем да вземете информирано решение за настаняване в Нидерландия."
    : "Αφήστε τους πράκτορές μας να παρακολουθήσουν τις προβολές ακινήτων εκ μέρους σας. Παρέχουμε φωτογραφίες, βίντεο και λεπτομερή ανατροφοδότηση για να σας βοηθήσουμε να πάρετε ενημερωμένες αποφάσεις για τη διαμονή στην Ολλανδία.";
  
  const ogImage = `${baseUrl}/assets/img/icons/10.png`;

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
          ? "property viewing, viewing service, Netherlands, student housing, accommodation viewing, property inspection"
          : lang === "bg"
          ? "оглед на имот, услуга за огледи, Нидерландия, студентско жилище, оглед на настаняване"
          : "προβολή ακινήτου, υπηρεσία προβολής, Ολλανδία, φοιτητική στέγαση"} />
      </Head>
      <Wrapper>
        <ViewingPage />
      </Wrapper>
    </>
  );
};

export default index;
