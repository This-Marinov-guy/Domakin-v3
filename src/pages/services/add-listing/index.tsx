import Wrapper from "@/layouts/Wrapper";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { fetchFeedbacks, fetchProperties } from "@/services/api";
import useTranslation from "next-translate/useTranslation";
import LendingPageV3 from "@/components/inner-pages/services/detail-page/LendingPageV3";

interface HomeProps {
  serverFeedbacks: any[];
  serverProperties: any[];
}

const index = ({ serverFeedbacks, serverProperties }: HomeProps) => {
  const router = useRouter();
  const { t, lang } = useTranslation("translations");
  
  const baseUrl = "https://www.domakin.nl";
  const currentUrl = `${baseUrl}${router.asPath}`;
  
  // Get localized content
  const title = lang === "en" 
    ? "List a Room | Domakin - Transfer Your Contract or Find a Flatmate"
    : lang === "bg"
    ? "Отдай стая | Domakin - Прехвърли договора си или намери съквартирант"
    : "Καταχωρίστε Δωμάτιο | Domakin - Μεταβιβάστε τη Συνδρομή σας ή Βρείτε Συγκάτοικο";
  
  const description = lang === "en"
    ? "Transfer your rental contract or find a new flatmate. List your room on Domakin and connect with verified students looking for accommodation in the Netherlands."
    : lang === "bg"
    ? "Прехвърлете договора си за наем или намерете нов съквартирант. Публикувайте стаята си в Domakin и се свържете с проверени студенти, търсещи настаняване в Нидерландия."
    : "Μεταβιβάστε το συμβόλαιο ενοικίασής σας ή βρείτε νέο συγκάτοικο. Καταχωρίστε το δωμάτιό σας στο Domakin και συνδεθείτε με επαληθευμένους φοιτητές που αναζητούν διαμονή στην Ολλανδία.";
  
  const ogImage = `${baseUrl}/assets/img/icons/11.png`;

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
          ? "list a room, transfer contract, find flatmate, room listing, Netherlands, student accommodation, contract transfer"
          : lang === "bg"
          ? "отдай стая, прехвърли договор, намери съквартирант, обява за стая, Нидерландия"
          : "καταχώρηση δωματίου, μεταβίβαση συμβολαίου, εύρεση συγκατοίκου, Ολλανδία"} />
      </Head>
      <Wrapper>
        <LendingPageV3 serverFeedbacks={serverFeedbacks} serverProperties={serverProperties}/>
      </Wrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const feedbacks = await fetchFeedbacks(lang);
  const properties = await fetchProperties(lang);

  return {
    props: {
      serverFeedbacks: feedbacks,
      serverProperties: properties,
    },
  };
};


export default index;
