import ServicesHub from "@/components/inner-pages/services/ServicesHub";
import Wrapper from "@/layouts/Wrapper";
import { SHARE_BANNERS } from "@/utils/shareBanners";
import Head from "next/head";

const canonical = "https://www.domakin.nl/services";

const services = [
  {
    name: "Book remote viewing",
    url: "https://www.domakin.nl/services/viewing",
    description:
      "Domakin remote property viewing service for renters who cannot attend a rental viewing in person.",
  },
  {
    name: "Property catalogue",
    url: "https://www.domakin.nl/services/renting",
    description:
      "Rental property catalogue for students looking for accommodation in the Netherlands.",
  },
  {
    name: "Search for a room",
    url: "https://www.domakin.nl/services/room-searching",
    description:
      "Room searching service for students who want help finding suitable accommodation.",
  },
  {
    name: "List a room",
    url: "https://www.domakin.nl/services/add-listing",
    description:
      "Domakin list a room service for finding a new tenant or flatmate.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Domakin Services",
    description:
      "Domakin services for remote viewing, rental search, room searching, and listing a room in the Netherlands.",
    isPartOf: {
      "@type": "WebSite",
      name: "Domakin",
      url: "https://www.domakin.nl",
    },
    mainEntity: {
      "@id": `${canonical}#services`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonical}#services`,
    name: "Domakin housing services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: service.url,
        provider: {
          "@type": "Organization",
          name: "Domakin",
          url: "https://www.domakin.nl",
        },
        areaServed: {
          "@type": "Country",
          name: "Netherlands",
        },
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which Domakin services help with housing in the Netherlands?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Domakin helps with remote rental viewings, rental property discovery, room searching, and room listings. Start with Book remote viewing if you cannot attend a viewing, or List a room if you need to find a new tenant or flatmate.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.domakin.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: canonical,
      },
    ],
  },
];

const ServicesPage = () => {
  const title = "Domakin Services | Remote Viewing, Room Search & List a Room";
  const description =
    "Compare Domakin services for remote rental viewings, property search, room searching, and listing a room in the Netherlands.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="Domakin services, remote viewing Netherlands, list a room Netherlands, room searching service, rental property catalogue"
        />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="en" href={canonical} />
        <link
          rel="alternate"
          hrefLang="bg"
          href="https://www.domakin.nl/bg/services"
        />
        <link
          rel="alternate"
          hrefLang="el"
          href="https://www.domakin.nl/gr/services"
        />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="Domakin" />
        <meta property="og:image" content={SHARE_BANNERS.main} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={SHARE_BANNERS.main} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </Head>
      <Wrapper>
        <ServicesHub />
      </Wrapper>
    </>
  );
};

export default ServicesPage;

