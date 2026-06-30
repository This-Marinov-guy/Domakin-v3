type AnswerSource = {
  label: string;
  url: string;
};

export type AnswerFirstData = {
  question: string;
  answer: string;
  nextSteps: string[];
  sources: AnswerSource[];
};

type AnswerFirstFallbackPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  category: string;
  tags: string[];
  author: {
    name: string;
  };
};

const ANSWER_FIRST_BY_SLUG: Record<string, AnswerFirstData> = {
  "student-finance-netherlands-2026": {
    question: "Can international students get student finance in the Netherlands?",
    answer:
      "International students can get Dutch student finance only when they meet DUO's rules for age, education and nationality or residence rights. EU, EEA, Swiss and UK students may qualify in specific work or residence situations, and most applicants need a BSN and DigiD or eIDAS access before applying.",
    nextSteps: [
      "Check DUO eligibility for your nationality or residence status.",
      "Register for a BSN before starting the application flow.",
      "Apply through Mijn DUO once your study, identity and residence details are ready.",
    ],
    sources: [
      {
        label: "DUO student finance eligibility",
        url: "https://duo.nl/particulier/student-finance/eligibility.jsp",
      },
      {
        label: "DUO student finance application",
        url: "https://duo.nl/particulier/student-finance/apply.jsp",
      },
      {
        label: "DUO EU, EEA, Swiss and UK student finance rules",
        url: "https://duo.nl/particulier/student-finance-citizens-eu-eer-switzerland-or-uk/eligibility.jsp",
      },
    ],
  },
  "bsn-nummer-id-nederland": {
    question: "How do you get a BSN in the Netherlands?",
    answer:
      "You receive a BSN when you register in the Personal Records Database with a Dutch municipality. People moving to the Netherlands should arrange municipal registration soon after arrival; people staying less than 4 months can use non-resident registration when applicable.",
    nextSteps: [
      "Book registration with the municipality where you will live.",
      "Bring your ID and the documents your municipality asks for.",
      "Use the BSN for government, healthcare, tax and many banking or housing steps.",
    ],
    sources: [
      {
        label: "Government.nl citizen service number",
        url: "https://www.government.nl/themes/government-and-democracy/personal-data/citizen-service-number-bsn",
      },
      {
        label: "Government.nl moving to the Netherlands checklist",
        url: "https://www.government.nl/faq/what-do-i-need-to-arrange-if-im-moving-to-the-netherlands",
      },
      {
        label: "Government.nl BRP registration timing",
        url: "https://www.government.nl/faq/when-should-i-register-with-the-personal-records-database-as-a-resident",
      },
    ],
  },
  "rent-allowance-netherlands-2026": {
    question: "Can students get rent allowance in the Netherlands in 2026?",
    answer:
      "Students can apply for Dutch rent benefit when their home, household, income, assets and residence situation meet the Tax Administration rules. From 2026, rent can no longer be too high on its own, but rent level still affects how much benefit you may receive.",
    nextSteps: [
      "Check whether your rented home qualifies for rent benefit.",
      "Check your income, household and asset position for the benefit year.",
      "Use the official Tax Administration benefit flow or test calculation before relying on an estimate.",
    ],
    sources: [
      {
        label: "Belastingdienst rent thresholds for rent benefit",
        url: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/benefits/moving_to_the_netherlands/i_live_in_a_rented_house/rent-and-service-costs/rent-and-service-costs",
      },
      {
        label: "Government.nl applying for housing benefit",
        url: "https://www.government.nl/themes/building-and-housing/housing/rented-housing/applying-for-housing-benefit",
      },
      {
        label: "Belastingdienst rent benefit assets",
        url: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/benefits/moving_to_the_netherlands/i_live_in_a_rented_house/assets-rent-benefit",
      },
    ],
  },
};

const FALLBACK_TITLES_BY_SLUG: Record<string, string> = {
  "student-finance-netherlands-2026": "Student Finance in the Netherlands 2026",
  "bsn-nummer-id-nederland": "BSN Number in the Netherlands",
  "rent-allowance-netherlands-2026": "Rent Allowance in the Netherlands 2026",
};

export const getAnswerFirstData = (slug?: string) =>
  slug ? ANSWER_FIRST_BY_SLUG[slug] : undefined;

export const getAnswerFirstFallbackPost = (
  slug?: string,
): AnswerFirstFallbackPost | null => {
  const data = getAnswerFirstData(slug);
  if (!slug || !data) return null;

  return {
    id: `answer-first-${slug}`,
    slug,
    title: FALLBACK_TITLES_BY_SLUG[slug] || data.question,
    excerpt: data.answer,
    content: [
      `<p>${escapeHtml(data.answer)}</p>`,
      "<h2>Next steps</h2>",
      `<ol>${data.nextSteps
        .map((step) => `<li>${escapeHtml(step)}</li>`)
        .join("")}</ol>`,
      "<h2>Official sources</h2>",
      `<ul>${data.sources
        .map(
          (source) =>
            `<li><a href="${escapeHtml(source.url)}">${escapeHtml(
              source.label,
            )}</a></li>`,
        )
        .join("")}</ul>`,
    ].join(""),
    date: "2026-06-29",
    modified: "2026-06-29",
    category: "Student Housing",
    tags: ["student housing", "netherlands", "official guidance"],
    author: {
      name: "Domakin Team",
    },
  };
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const createAnswerFirstFaqJsonLd = (data: AnswerFirstData) => ({
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

export default function AnswerFirstBlock({ data }: { data?: AnswerFirstData }) {
  if (!data) return null;

  return (
    <section
      className="border rounded p-4 my-4 bg-light"
      data-geo-answer-block
      aria-label="Quick answer"
    >
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
    </section>
  );
}
