import PropertiesPage from "@/components/inner-pages/services/detail-page/PropertiesPage";
import Wrapper from "@/layouts/Wrapper";
import { GetServerSideProps } from "next";
import { fetchProperties } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { getPropertyUrl } from "@/utils/seoHelpers";
import { useRouter } from "next/router";

interface PropertiesIndexProps {
  serverProperties: any[];
}

const index = ({ serverProperties }: PropertiesIndexProps) => {
  const { propertyStore } = useStore();
  const { t, lang } = useTranslation("translations");
  const router = useRouter();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverProperties && serverProperties.length > 0) {
      propertyStore.setSSRProperties(serverProperties);
    }
  }, [serverProperties, propertyStore]);

  // Generate structured data for property listings
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Student Housing Rentals in Netherlands | Domakin`,
    description: "Find quality student accommodation and rental properties in the Netherlands. Browse verified listings for rooms and apartments.",
    url: "https://www.domakin.nl/services/renting",
    numberOfItems: serverProperties.length,
    itemListElement: serverProperties.slice(0, 10).map((property: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Accommodation",
        "@id": `https://www.domakin.nl${getPropertyUrl(property)}`,
        name: property.title || `${property.city} Property`,
        description: property.description?.property || property.description,
        url: `https://www.domakin.nl${getPropertyUrl(property)}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: property.city,
          addressCountry: "NL",
        },
        ...(property.price && {
          offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
        }),
        ...(property.main_image && {
          image: property.main_image.startsWith('http') 
            ? property.main_image 
            : `https://www.domakin.nl/assets/img/properties/${property.folder ?? "property_" + property.id}/${property.main_image}`,
        }),
      },
    })),
  };

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: "Home", url: "https://www.domakin.nl" },
    { name: "Services", url: "https://www.domakin.nl/services" },
    { name: "Renting", url: "https://www.domakin.nl/services/renting" },
  ];

  const baseUrl = "https://www.domakin.nl";
  const currentUrl = `${baseUrl}${router.asPath}`;
  
  // Get localized content
  const title = lang === "en" 
    ? "Student Housing Rentals Netherlands | Domakin - Find Your Perfect Room"
    : lang === "bg"
    ? "Студентски жилища в Нидерландия | Domakin - Намерете перфектната стая"
    : "Φοιτητική Στέγαση στην Ολλανδία | Domakin - Βρείτε το Ιδανικό Δωμάτιο";
  
  const description = lang === "en"
    ? "Find quality student accommodation and rental properties in the Netherlands. Browse verified listings for rooms and apartments with transparent pricing."
    : lang === "bg"
    ? "Намерете качествени студентски жилища и наемни имоти в Нидерландия. Разгледайте проверени обяви за стаи и апартаменти с прозрачни цени."
    : "Βρείτε ποιοτική φοιτητική διαμονή και ακίνητα προς ενοικίαση στην Ολλανδία. Περιηγηθείτε σε επαληθευμένες καταχωρήσεις για δωμάτια και διαμερίσματα με διαφανείς τιμές.";
  
  const ogImage = `${baseUrl}/assets/img/icons/12.png`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={lang === "en" 
          ? "student housing Netherlands, rental properties, student accommodation, rooms for rent, apartments, student housing Amsterdam, Rotterdam, Utrecht"
          : lang === "bg"
          ? "студентско жилище Нидерландия, наемни имоти, студентско настаняване, стаи под наем, апартаменти"
          : "φοιτητική στέγαση Ολλανδία, ακίνητα προς ενοικίαση, φοιτητική διαμονή, δωμάτια προς ενοικίαση"} />
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
        
        {/* Location meta tags */}
        <meta name="geo.region" content="NL" />
        <meta name="geo.placename" content="Netherlands" />
        <meta name="ICBM" content="52.1326, 5.2913" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Wrapper>
        <PropertiesPage />
      </Wrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lang = context.locale || "en";
  const properties = await fetchProperties(lang);

  return {
    props: {
      serverProperties: properties,
    },
  };
};

export default index;
