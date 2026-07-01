import RoomSearching from "@/components/inner-pages/services/detail-page/RoomSearching";
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
  const serviceAnswerData = getServiceAnswerData("room-searching");
  
  // Get localized content
  const title = lang === "en" 
    ? "Room Searching Service | Domakin - Find Your Perfect Student Room"
    : lang === "bg"
    ? "Услуга за търсене на стая | Domakin - Намерете перфектната студентска стая"
    : lang === "nl"
    ? "Kamerzoekservice | Domakin - Vind jouw perfecte studentenkamer"
    : "Υπηρεσία Αναζήτησης Δωματίου | Domakin - Βρείτε το Ιδανικό Φοιτητικό Δωμάτιο";

  const description = lang === "en"
    ? "Tell us your requirements and we'll search for the perfect room for you. Our agents will find accommodation that matches your specifications in the Netherlands."
    : lang === "bg"
    ? "Кажете ни вашите изисквания и ние ще намерим перфектната стая за вас. Нашите агенти ще намерят настаняване, което отговаря на вашите спецификации в Нидерландия."
    : lang === "nl"
    ? "Vertel ons uw wensen en wij zoeken de perfecte kamer voor u. Onze agenten vinden accommodatie die aansluit bij uw specificaties in Nederland."
    : "Πείτε μας τις απαιτήσεις σας και θα βρούμε το ιδανικό δωμάτιο για εσάς. Οι πράκτορές μας θα βρουν διαμονή που ταιριάζει με τις προδιαγραφές σας στην Ολλανδία.";
  
  const ogImage = SHARE_BANNERS.searching;

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
        <meta property="og:locale" content={lang === "en" ? "en_US" : lang === "bg" ? "bg_BG" : lang === "nl" ? "nl_NL" : "el_GR"} />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={title} />
        
        {/* Additional meta tags */}
        <meta name="keywords" content={lang === "en" 
          ? "room searching, find a room, student room search, accommodation search, Netherlands, room finder service"
          : lang === "bg"
          ? "търсене на стая, намери стая, търсене на студентска стая, търсене на настаняване, Нидерландия"
          : lang === "nl"
          ? "kamer zoeken, kamer vinden, studentenkamer zoeken, accommodatie zoeken, Nederland, kamerzoekservice"
          : "αναζήτηση δωματίου, εύρεση δωματίου, αναζήτηση φοιτητικού δωματίου, Ολλανδία"} />
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
        <RoomSearching />
      </Wrapper>
    </>
  );
};

export default index;
