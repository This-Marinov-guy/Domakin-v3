import Link from "next/link";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";

const serviceGroups = [
  {
    label: "Viewings",
    title: "Domakin remote property viewing service",
    text: "Book a remote viewing when you have been invited to a rental viewing in the Netherlands but cannot attend yourself. A local agent can visit, ask your questions, and send back photos, video, and practical notes.",
    links: [
      {
        label: "Book remote viewing",
        href: "/services/viewing",
      },
    ],
    icon: "fa-solid fa-video",
  },
  {
    label: "Renting",
    title: "Find and compare rental options",
    text: "Use the property catalogue or room searching service to move from broad housing search to specific viewings, applications, and tenancy checks.",
    links: [
      {
        label: "Property catalogue",
        href: "/services/renting",
      },
      {
        label: "Search for a room",
        href: "/services/room-searching",
      },
    ],
    icon: "fa-solid fa-key",
  },
  {
    label: "Lending",
    title: "Domakin list a room service",
    text: "List a room when you need to find a new tenant or flatmate. Prepare the room details, rent, service costs, availability, and photos before sharing the listing.",
    links: [
      {
        label: "List a room",
        href: "/services/add-listing",
      },
    ],
    icon: "fa-solid fa-house-user",
  },
];

const priorityChecks = [
  "Remote viewing: address, timing, questions, rent, deposit, registration, and application deadline.",
  "Room search: city, budget, move-in date, registration needs, and shortlist fit.",
  "List a room: landlord permission, contract rules, rent, service costs, availability, and handover records.",
];

export default function ServicesHub() {
  return (
    <>
      <HeaderOne style={true} />
      <main className="services-hub">
        <section
          className="services-hub-hero"
          style={{ backgroundImage: "url(/assets/img/bg/9.webp)" }}
          data-geo-services-hub-hero-image="/assets/img/bg/9.webp"
        >
          <div className="container">
            <div className="row align-items-center gy-4">
              <div className="col-lg-8">
                <p className="services-hub-eyebrow">Domakin services</p>
                <h1>Housing services for students in the Netherlands</h1>
                <p className="services-hub-lead">
                  Choose the right Domakin service for remote viewings,
                  property search, room searching, or listing a room for a new
                  tenant or flatmate.
                </p>
              </div>
              <div className="col-lg-4">
                <div
                  className="services-hub-answer-card"
                  data-geo-services-hub-answer-block
                >
                  <p className="fw-semibold text-uppercase small mb-2">
                    Quick answer
                  </p>
                  <h2>
                    Which Domakin services help with housing in the
                    Netherlands?
                  </h2>
                  <p>
                    Domakin helps with remote rental viewings, rental property
                    discovery, room searching, and room listings. Start with
                    Book remote viewing if you cannot attend a viewing, or List
                    a room if you need to find a new tenant or flatmate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-hub-section">
          <div className="container">
            <div className="row gx-xxl-5 gy-4">
              {serviceGroups.map((group) => (
                <div className="col-lg-4 d-flex" key={group.label}>
                  <article className="services-hub-card">
                    <div className="services-hub-card-icon">
                      <i className={group.icon} aria-hidden="true"></i>
                    </div>
                    <p className="services-hub-card-label">{group.label}</p>
                    <h2>{group.title}</h2>
                    <p>{group.text}</p>
                    <div className="services-hub-card-links">
                      {group.links.map((link) => (
                        <Link href={link.href} key={link.href}>
                          {link.label}
                          <i
                            className="fa-thin fa-arrow-up-right"
                            aria-hidden="true"
                          ></i>
                        </Link>
                      ))}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="services-hub-section pt-0">
          <div className="container">
            <div className="services-hub-proof">
              <div>
                <p className="services-hub-eyebrow">Answer-ready checks</p>
                <h2>What to prepare before choosing a service</h2>
              </div>
              <ul>
                {priorityChecks.map((item) => (
                  <li key={item}>
                    <i className="fa-solid fa-check" aria-hidden="true"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <FooterFour />
    </>
  );
}
