import Head from "next/head";

const SITE_URL = "https://www.domakin.nl";

const LOCALE_PREFIXES = [
  { hreflang: "en", prefix: "" },
  { hreflang: "bg", prefix: "/bg" },
  { hreflang: "el", prefix: "/gr" },
];

type Faq = {
  question: string;
  answer: string;
};

type ServiceSeoHeadProps = {
  path: string;
  title: string;
  description: string;
  serviceName: string;
  serviceDescription: string;
  keywords: string[];
  faqs: Faq[];
};

const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

const ServiceSeoHead = ({
  path,
  title,
  description,
  serviceName,
  serviceDescription,
  keywords,
  faqs,
}: ServiceSeoHeadProps) => {
  const canonical = absoluteUrl(path);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      isPartOf: {
        "@type": "WebSite",
        name: "Domakin",
        url: SITE_URL,
      },
      about: {
        "@id": `${canonical}#service`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: serviceName,
      description: serviceDescription,
      provider: {
        "@type": "Organization",
        name: "Domakin",
        url: SITE_URL,
      },
      areaServed: {
        "@type": "Country",
        name: "Netherlands",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Students and expats looking for housing in the Netherlands",
      },
      serviceType: keywords.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: serviceName,
          item: canonical,
        },
      ],
    },
  ];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonical} />
      {LOCALE_PREFIXES.map(({ hreflang, prefix }) => (
        <link
          key={hreflang}
          rel="alternate"
          hrefLang={hreflang}
          href={absoluteUrl(`${prefix}${path}`)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default ServiceSeoHead;
