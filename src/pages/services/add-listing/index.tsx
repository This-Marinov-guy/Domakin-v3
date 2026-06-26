import LendingPage from "@/components/inner-pages/services/detail-page/LendingPage";
import ServiceSeoHead from "@/components/seo/ServiceSeoHead";
import Wrapper from "@/layouts/Wrapper";

const index = () => {
  return (
    <Wrapper>
      <ServiceSeoHead
        path="/services/add-listing"
        title="List a Student Room in the Netherlands | Domakin"
        description="List your room with Domakin, find a suitable new tenant, and receive commission when the tenant signs the contract."
        serviceName="Student room listing service in the Netherlands"
        serviceDescription="Domakin helps students and tenants list a room, review candidates, and transfer the room to a suitable new tenant."
        keywords={[
          "list a room Netherlands",
          "find a new tenant",
          "student room listing",
          "transfer rental contract",
        ]}
        faqs={[
          {
            question: "Can I list my room on Domakin?",
            answer:
              "Yes. You can upload property details and photos, receive candidate interest, choose a suitable tenant, and continue the transfer process.",
          },
          {
            question: "When do I receive commission for listing a room?",
            answer:
              "The commission applies once the new tenant signs the contract through the Domakin process.",
          },
        ]}
      />
      <LendingPage />
    </Wrapper>
  );
};

export default index;
