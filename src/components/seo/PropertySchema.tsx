import Head from 'next/head';

interface PropertySchemaProps {
  property: any;
}

const PropertySchema = ({ property }: PropertySchemaProps) => {
  const propertyTitle = property.title || `${property.city} Student Housing`;
  const propertyDescription = property.description?.property || 
    `Quality student accommodation in ${property.city}, Netherlands. ${property.description?.period || ''} ${property.description?.bills || ''}`.trim();
  
  const propertyImage = property.main_image?.startsWith('http') 
    ? property.main_image 
    : `https://www.domakin.nl/assets/img/properties/${property.folder ?? "property_" + property.id}/${property.main_image}`;

  // FAQ Schema for common property questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What utilities are included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: property.description?.bills || "Please contact us for details about included utilities."
        }
      },
      {
        "@type": "Question", 
        name: "How many flatmates are there?",
        acceptedAnswer: {
          "@type": "Answer",
          text: property.description?.flatmates || "Please contact us for details about flatmates."
        }
      },
      {
        "@type": "Question",
        name: "What is the rental period?",
        acceptedAnswer: {
          "@type": "Answer",
          text: property.description?.period || "Please contact us for details about the rental period."
        }
      }
    ]
  };

  // Local Business Schema for the property location
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Domakin",
    description: "Student housing platform in the Netherlands",
    url: "https://www.domakin.nl",
    logo: "https://www.domakin.nl/assets/img/logo.png",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL"
    },
    areaServed: {
      "@type": "Country",
      name: "Netherlands"
    },
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Student Housing Rental",
        description: "Quality student accommodation rental services"
      }
    }
  };

  return (
    <Head>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </Head>
  );
};

export default PropertySchema;
