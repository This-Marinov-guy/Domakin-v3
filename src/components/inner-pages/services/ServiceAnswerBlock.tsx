import Link from "next/link";
import { VIEWING_SERVICE_LOCATIONS } from "@/data/viewingLocations";

type ServiceAnswerSource = {
  label: string;
  url: string;
};

type ServiceAnswerPricing = {
  label: string;
  options: {
    name: string;
    price: number;
    description: string;
  }[];
  readMoreHref: string;
  readMoreLabel: string;
};

export type ServiceAnswerId = "room-searching" | "viewing" | "add-listing";

export type ServiceAnswerData = {
  id: ServiceAnswerId;
  serviceName: string;
  serviceType: string;
  audience: string;
  question: string;
  answer: string;
  nextSteps: string[];
  serviceAreas?: readonly string[];
  sources?: ServiceAnswerSource[];
  pricing?: ServiceAnswerPricing;
};

const tenantStepPlanSource = {
  label: "Government.nl tenant step-by-step plan",
  url: "https://www.government.nl/themes/building-and-housing/housing/rented-housing/step-by-step-plan-for-tenants",
};

const rentedHousingSource = {
  label: "Government.nl rented housing",
  url: "https://www.government.nl/themes/building-and-housing/housing/rented-housing",
};

const SERVICE_ANSWER_BY_ID: Record<ServiceAnswerId, ServiceAnswerData> = {
  "room-searching": {
    id: "room-searching",
    serviceName: "Domakin room searching service",
    serviceType: "Student accommodation search support",
    audience: "Students looking for rooms in the Netherlands",
    question: "What does Domakin's room searching service do?",
    answer:
      "Domakin turns your room criteria into a managed search: we shortlist options, check basic fit and help you move toward viewings or applications. You still verify the tenancy terms, registration possibility, deposit and service costs before committing.",
    nextSteps: [
      "Share your city, budget, move-in date and registration needs.",
      "Review the shortlist and choose which homes should move to viewing or application.",
      "Compare any offer with the written tenancy agreement and official tenant guidance before signing.",
    ],
    sources: [tenantStepPlanSource, rentedHousingSource],
  },
  viewing: {
    id: "viewing",
    serviceName: "Domakin remote property viewing service",
    serviceType: "Remote rental property viewing assistance",
    audience: "Students who need a remote rental viewing in the Netherlands",
    question: "Can Domakin do a remote rental viewing for you?",
    answer:
      "Yes. Domakin can attend a rental viewing on your behalf and report back with photos, video and practical notes so you can decide faster from abroad or another city. Students may call this a viewing, remote viewing or online viewing service. The legal decision remains yours; compare the remote viewing notes with the written tenancy agreement and landlord information.",
    nextSteps: [
      "Send the viewing address, scheduled time and questions you want answered.",
      "Use the photos, video and notes to decide whether to proceed.",
      "Check rent, deposit, service costs and house rules against the written documents before paying.",
    ],
    serviceAreas: VIEWING_SERVICE_LOCATIONS,
    pricing: {
      label: "Remote viewing pricing",
      options: [
        {
          name: "Standard remote viewing",
          price: 50,
          description: "For viewings scheduled in advance.",
        },
        {
          name: "Express remote viewing",
          price: 100,
          description: "For urgent viewings within 24 hours when an agent is available.",
        },
      ],
      readMoreHref: "/pricing",
      readMoreLabel: "Read more",
    },
  },
  "add-listing": {
    id: "add-listing",
    serviceName: "Domakin list a room service",
    serviceType: "Room listing and tenant handover support",
    audience: "Tenants, landlords and students listing a room in the Netherlands",
    question: "Can Domakin help you list a room and find a new tenant or flatmate?",
    answer:
      "Yes. Domakin helps you list a room, present it to interested students and support a smoother tenant or flatmate handover. Before transferring a contract, subletting or changing occupants, check your rental agreement, landlord permission and written information requirements.",
    nextSteps: [
      "Prepare room details, availability, rent, service costs and photos.",
      "Confirm whether contract transfer, subletting or a new tenancy is allowed.",
      "Use written agreements and keep clear records before handing over keys or deposits.",
    ],
    sources: [tenantStepPlanSource, rentedHousingSource],
  },
};

export const getServiceAnswerData = (id: ServiceAnswerId) =>
  SERVICE_ANSWER_BY_ID[id];

export const createServiceJsonLd = (
  data: ServiceAnswerData,
  currentUrl: string,
) => {
  const sources = data.sources ?? [];
  const serviceJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${currentUrl}#service`,
    name: data.serviceName,
    serviceType: data.serviceType,
    description: data.answer,
    url: currentUrl,
    provider: {
      "@type": "Organization",
      name: "Domakin",
      url: "https://www.domakin.nl",
    },
    areaServed: data.serviceAreas?.length
      ? data.serviceAreas.map((area) => ({
          "@type": "AdministrativeArea",
          name: area,
        }))
      : {
          "@type": "Country",
          name: "Netherlands",
        },
    audience: {
      "@type": "Audience",
      audienceType: data.audience,
    },
  };

  if (sources.length) {
    serviceJsonLd.citation = sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.label,
      url: source.url,
    }));
  }

  if (data.pricing) {
    serviceJsonLd.offers = data.pricing.options.map((option) => ({
      "@type": "Offer",
      name: option.name,
      price: option.price,
      priceCurrency: "EUR",
      description: option.description,
      url: new URL(data.pricing?.readMoreHref ?? currentUrl, currentUrl)
        .toString(),
    }));
  }

  return serviceJsonLd;
};

export const createServiceFaqJsonLd = (data: ServiceAnswerData) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: data.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${data.answer} ${data.nextSteps.join(" ")}`,
      },
    },
  ],
});

export default function ServiceAnswerBlock({
  data,
}: {
  data: ServiceAnswerData;
}) {
  const sources = data.sources ?? [];

  return (
    <section
      className="container mt-50 mb-50"
      data-geo-service-answer-block
      aria-label="Quick service answer"
    >
      <div className="border rounded p-4 bg-light">
        <p className="fw-semibold text-uppercase small mb-2">Quick answer</p>
        <h2 className="h4 mb-3">{data.question}</h2>
        <p className="mb-3">{data.answer}</p>
        <ol className="mb-3 ps-4">
          {data.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {data.serviceAreas && data.serviceAreas.length > 0 && (
          <div className="mb-3" data-geo-service-areas>
            <p className="fw-semibold mb-2">Supported viewing cities</p>
            <p className="mb-0">{data.serviceAreas.join(", ")}</p>
          </div>
        )}
        {data.pricing && (
          <div
            className="mt-4 p-3 rounded bg-white border"
            data-geo-service-pricing
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-semibold mb-2">{data.pricing.label}</p>
                <div className="d-flex flex-wrap gap-3">
                  {data.pricing.options.map((option) => (
                    <div key={option.name}>
                      <p className="mb-1 fw-semibold">
                        {option.name}: EUR {option.price}
                      </p>
                      <p className="mb-0 small">{option.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link href={data.pricing.readMoreHref} className="btn-eleven">
                {data.pricing.readMoreLabel}
              </Link>
            </div>
          </div>
        )}
        {sources.length > 0 && (
          <>
            <p className="fw-semibold mb-2">Official sources</p>
            <ul className="mb-0 ps-4">
              {sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
