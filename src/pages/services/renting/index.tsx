import PropertiesPage from "@/components/inner-pages/services/detail-page/PropertiesPage";
import ServiceSeoHead from "@/components/seo/ServiceSeoHead";
import Wrapper from "@/layouts/Wrapper";

const index = () => {
  return (
    <Wrapper>
      <ServiceSeoHead
        path="/services/renting"
        title="Student Housing Rentals Netherlands | Domakin"
        description="Browse verified student rooms and rental properties in the Netherlands, apply directly, and get support from Domakin housing agents."
        serviceName="Student housing rentals in the Netherlands"
        serviceDescription="Domakin helps students and expats find verified rooms and apartments in the Netherlands through a curated property catalogue and agent support."
        keywords={[
          "student housing Netherlands",
          "student rooms Groningen",
          "verified rental listings",
          "student accommodation Netherlands",
        ]}
        faqs={[
          {
            question: "How does renting through Domakin work?",
            answer:
              "Choose a property from the catalogue, submit the application form, wait for an agent to contact you, and continue the rental process with Domakin support.",
          },
          {
            question: "Who is the Domakin rental catalogue for?",
            answer:
              "The catalogue is designed for students and expats looking for rooms or apartments in the Netherlands, especially when they need verified listings and practical support.",
          },
        ]}
      />
      <PropertiesPage />
    </Wrapper>
  );
};

export default index;
