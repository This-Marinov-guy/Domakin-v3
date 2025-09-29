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
  
  // Extract property ID from slug (format: id-location-title)
  const extractPropertyId = (slug: string): string | null => {
    // Split by dash and take the first part as ID
    const parts = slug.split('-');
    const id = parts[0];
    
    // Validate that the first part is a number (property ID)
    if (/^\d+$/.test(id)) {
      return id;
    }
    
    return null;
  };

  const propertyId = extractPropertyId(slug as string);
  
  // Debug logging
  console.log('Property Details Debug:', {
    slug,
    propertyId,
    serverPropertiesCount: serverProperties.length,
    forRentListCount: forRentList.length,
    allPropertiesCount: allProperties.length,
    availableIds: allProperties.map(p => p.id).slice(0, 10) // Show first 10 IDs
  });
  
  // Find the property by ID
  const property = propertyId ? allProperties.find((p: any) => p?.id?.toString() === propertyId) : null;

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
  // Generate SEO-friendly slug: id-location-title
  const generatePropertySlug = (property: any): string => {
    const propertyId = property.id.toString();
    const location = property.city || property.location || '';
    const title = property.title || '';
    
    // Create URL parts, omitting missing parts
    const urlParts = [propertyId];
    if (location) urlParts.push(location.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim());
    if (title) urlParts.push(title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim());
    
    return urlParts.join('-').replace(/--+/g, '-');
  };

  const seoSlug = generatePropertySlug(property);

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

    // Fetch properties from API
    const apiProperties = await fetchProperties(lang);
    
    // Load static properties from translations
    const fs = require('fs');
    const path = require('path');
    const translationsPath = path.join(process.cwd(), 'locales', lang, 'translations.json');
    let staticProperties: any[] = [];
    
    try {
      const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
      staticProperties = translations.FOR_RENT || [];
    } catch (error) {
      console.warn('Could not load static properties from translations:', error);
    }
    
    // Combine all properties
    const allProperties = [...apiProperties, ...staticProperties];
    
    // Extract property ID from slug (format: id-location-title)
    const extractPropertyId = (slug: string): string | null => {
      const parts = slug.split('-');
      const id = parts[0];
      
      if (/^\d+$/.test(id)) {
        return id;
      }
      
      return null;
    };

    const propertyId = extractPropertyId(slug as string);
    
    if (!propertyId) {
      return { notFound: true };
    }

    // Find property by ID in all properties
    const property = allProperties.find((p: any) => p?.id?.toString() === propertyId);
    
    if (!property) {
      console.log(`Property with ID ${propertyId} not found in ${allProperties.length} properties`);
      return { notFound: true };
    }

    // Generate the correct SEO slug
    const generatePropertySlug = (property: any): string => {
      const propertyId = property.id.toString();
      const location = property.city || property.location || '';
      const title = property.title || '';
      
      const urlParts = [propertyId];
      if (location) urlParts.push(location.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim());
      if (title) urlParts.push(title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim());
      
      return urlParts.join('-').replace(/--+/g, '-');
    };

    const correctSlug = generatePropertySlug(property);
    
    // If accessed with old format or incorrect slug, redirect to correct SEO-friendly URL
    if (slug !== correctSlug) {
      return {
        redirect: {
          destination: `/services/renting/property/${correctSlug}`,
          permanent: true, // 301 redirect for SEO
        },
      };
    }

    return {
      props: {
        serverProperties: allProperties,
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
