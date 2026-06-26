import ViewingPage from "@/components/inner-pages/services/detail-page/ViewingPage";
import ServiceSeoHead from "@/components/seo/ServiceSeoHead";
import Wrapper from "@/layouts/Wrapper";

const index = () => {
  return (
    <Wrapper>
      <ServiceSeoHead
        path="/services/viewing"
        title="Remote Viewing Service Netherlands | Domakin"
        description="Book a Domakin agent to attend a property viewing for you, ask questions, and send photos, videos, and feedback when you cannot be there in person."
        serviceName="Remote property viewing service in the Netherlands"
        serviceDescription="Domakin agents attend property viewings on behalf of students and expats who cannot visit in person, then share photos, videos, answers, and practical feedback."
        keywords={[
          "remote viewing Netherlands",
          "property viewing service",
          "student housing viewing",
          "rental viewing agent Netherlands",
        ]}
        faqs={[
          {
            question: "Can Domakin attend a property viewing for me?",
            answer:
              "Yes. A Domakin agent can attend the viewing, ask your questions, take photos or videos, and report back so you can make an informed decision.",
          },
          {
            question: "Who should use the remote viewing service?",
            answer:
              "The service is useful for students and expats who are abroad, busy, or unable to attend a rental viewing in the Netherlands in person.",
          },
        ]}
      />
      <ViewingPage />
    </Wrapper>
  );
};

export default index;
