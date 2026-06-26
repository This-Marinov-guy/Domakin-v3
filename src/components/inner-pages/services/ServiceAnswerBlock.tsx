type ServiceAnswerSource = {
  label: string;
  url: string;
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
  sources: ServiceAnswerSource[];
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
    serviceName: "Domakin property viewing service",
    serviceType: "Rental property viewing assistance",
    audience: "Students who need a rental viewing in the Netherlands",
    question: "Can Domakin view a rental property for you?",
    answer:
      "Yes. Domakin can attend a viewing on your behalf and report back with photos, video and practical notes so you can decide faster from abroad or another city. The legal decision remains yours; compare the viewing notes with the written tenancy agreement and landlord information.",
    nextSteps: [
      "Send the viewing address, scheduled time and questions you want answered.",
      "Use the photos, video and notes to decide whether to proceed.",
      "Check rent, deposit, service costs and house rules against the written documents before paying.",
    ],
    sources: [tenantStepPlanSource, rentedHousingSource],
  },
  "add-listing": {
    id: "add-listing",
    serviceName: "Domakin room listing service",
    serviceType: "Room listing and tenant handover support",
    audience: "Tenants, landlords and students listing a room in the Netherlands",
    question: "Can Domakin help find a new tenant or flatmate?",
    answer:
      "Yes. Domakin helps present your room, coordinate interested students and support a smoother handover. Before transferring a contract, subletting or changing occupants, check your rental agreement, landlord permission and written information requirements.",
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
) => ({
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
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  audience: {
    "@type": "Audience",
    audienceType: data.audience,
  },
  citation: data.sources.map((source) => ({
    "@type": "CreativeWork",
    name: source.label,
    url: source.url,
  })),
});

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
        <p className="fw-semibold mb-2">Official sources</p>
        <ul className="mb-0 ps-4">
          {data.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
