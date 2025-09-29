import PropertyDetailsOne from "@/components/inner-pages/services/detail-page/PropertyDetailsOne";
import Wrapper from "@/layouts/Wrapper";
import { GetServerSideProps } from "next";
import { fetchProperties } from "@/services/api";
import { useStore } from "@/stores/storeContext";
import { useEffect } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import PropertySchema from "@/components/seo/PropertySchema";
import { useParams } from "next/navigation";

interface PropertyDetailsProps {
  serverProperties: any[];
}

const index = ({ serverProperties }: PropertyDetailsProps) => {
  const { propertyStore } = useStore();
  const { t } = useTranslation("translations");
  const { slug } = useParams();

  // Initialize store with server-side data
  useEffect(() => {
    if (serverProperties && serverProperties.length > 0) {
      propertyStore.setSSRProperties(serverProperties);
    }
  }, [serverProperties, propertyStore]);

  // Find the current property
  const forRentList: any[] = t("FOR_RENT", {}, { returnObjects: true }) ?? [];
  const allProperties = [...serverProperties, ...forRentList];
  
  const property = allProperties.find((p: any) => {
    if (!p?.id) return false;
    
    // Check direct ID match
    if (p.id.toString() === slug) return true;
    
    // Check if slug matches a generated SEO slug
    if (p.city && p.title) {
      const seoSlug = `${p.city.toLowerCase()}-${p.title.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-')?.trim()}`.replace(/--+/g, '-');
      if (seoSlug === slug) return true;
    }
    
    return false;
  });

  if (!property) {
    return (
      <Wrapper>
        <PropertyDetailsOne />
      </Wrapper>
    );
  }

  // Generate property-specific structured data
  const propertyTitle = property.title || `${property.city} Student Housing`;
  const propertyDescription = property.description?.property || 
    `Quality student accommodation in ${property.city}, Netherlands. ${property.description?.period || ''} ${property.description?.bills || ''}`.trim();
  
  const propertyImage = property.main_image?.startsWith('http') 
    ? property.main_image 
    : `https://www.domakin.nl/assets/img/properties/${property.folder ?? "property_" + property.id}/${property.main_image}`;

  // Generate SEO-friendly slug for URLs
  const seoSlug = property.city && property.title 
    ? `${property.city.toLowerCase()}-${property.title.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-')?.trim()}`.replace(/--+/g, '-')
    : property.id.toString();

  // Real Estate specific structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "@id": `https://www.domakin.nl/services/renting/property/${seoSlug}`,
    name: propertyTitle,
    description: propertyDescription,
    url: `https://www.domakin.nl/services/renting/property/${seoSlug}`,
    image: propertyImage,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.location || property.city,
      addressCountry: "NL",
    },
    ...(property.price && {
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "EUR",
        availability: property.status === "Available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      },
    }),
    amenityFeature: [
      ...(property.description?.flatmates ? [{
        "@type": "LocationFeatureSpecification",
        name: "Flatmates",
        value: property.description.flatmates,
      }] : []),
      ...(property.description?.bills ? [{
        "@type": "LocationFeatureSpecification", 
        name: "Bills",
        value: property.description.bills,
      }] : []),
    ],
    additionalType: "https://schema.org/House",
    category: "Student Housing",
    keywords: `student housing, ${property.city}, accommodation, room rental, Netherlands`,
  };

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: "Home", url: "https://www.domakin.nl" },
    { name: "Services", url: "https://www.domakin.nl/services" },
    { name: "Renting", url: "https://www.domakin.nl/services/renting" },
    { name: propertyTitle, url: `https://www.domakin.nl/services/renting/property/${seoSlug}` },
  ];

  return (
    <>
      <Head>
        <title>{`${propertyTitle} | Student Housing in ${property.city} | Domakin`}</title>
        <meta name="description" content={propertyDescription} />
        <meta name="keywords" content={`student housing ${property.city}, room rental, accommodation, ${property.city} student room, Netherlands housing`} />
        <link rel="canonical" href={`https://www.domakin.nl/services/renting/property/${seoSlug}`} />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={`${propertyTitle} | Domakin`} />
        <meta property="og:description" content={propertyDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.domakin.nl/services/renting/property/${seoSlug}`} />
        <meta property="og:site_name" content="Domakin" />
        <meta property="og:image" content={propertyImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Product specific Open Graph */}
        <meta property="product:price:amount" content={property.price?.toString()} />
        <meta property="product:price:currency" content="EUR" />
        <meta property="product:availability" content={property.status === "Available" ? "in stock" : "out of stock"} />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${propertyTitle} | Domakin`} />
        <meta name="twitter:description" content={propertyDescription} />
        <meta name="twitter:image" content={propertyImage} />
        
        {/* Location meta tags */}
        <meta name="geo.region" content="NL" />
        <meta name="geo.placename" content={property.city} />
        
        {/* Property specific meta tags */}
        <meta property="place:location:latitude" content="52.1326" />
        <meta property="place:location:longitude" content="5.2913" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <BreadcrumbSchema items={breadcrumbItems} />
      <PropertySchema property={property} />
      <Wrapper>
        <PropertyDetailsOne />
      </Wrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { slug } = context.params || {};
    const lang = context.locale || "en";
    
    if (!slug) {
      return { notFound: true };
    }

    const properties = await fetchProperties(lang);
    
    // Try to find property by various identifiers
    const property = properties.find((p: any) => {
      if (!p?.id) return false;
      
      // Check direct ID match
      if (p.id.toString() === slug) return true;
      
      // Check if slug matches a generated SEO slug
      if (p.city && p.title) {
        const seoSlug = `${p.city.toLowerCase()}-${p.title.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-')?.trim()}`.replace(/--+/g, '-');
        if (seoSlug === slug) return true;
      }
      
      // Check if there's a slug property that matches
      if (p.slug === slug) return true;
      
      return false;
    });

    // If property found but accessed via old ID, redirect to SEO-friendly URL
    if (property && property.city && property.title && slug === property.id.toString()) {
      const seoSlug = `${property.city.toLowerCase()}-${property.title.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-')?.trim()}`.replace(/--+/g, '-');
      
      // Only redirect if we can create a proper SEO slug
      if (seoSlug !== property.id.toString()) {
        return {
          redirect: {
            destination: `/services/renting/property/${seoSlug}`,
            permanent: true, // 301 redirect for SEO
          },
        };
      }
    }

    return {
      props: {
        serverProperties: properties,
      },
    };
  } catch (error) {
    console.error('Error in property getServerSideProps:', error);
    return {
      props: {
        serverProperties: [],
      },
    };
  }
};

export default index;
