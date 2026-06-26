import RoomSearching from "@/components/inner-pages/services/detail-page/RoomSearching";
import ServiceSeoHead from "@/components/seo/ServiceSeoHead";
import Wrapper from "@/layouts/Wrapper";

const index = () => {
  return (
    <Wrapper>
      <ServiceSeoHead
        path="/services/room-searching"
        title="Room Searching Service Netherlands | Domakin"
        description="Tell Domakin your budget, move-in date, registration needs, and room preferences. Our agents search for suitable student accommodation in the Netherlands."
        serviceName="Room searching service in the Netherlands"
        serviceDescription="Domakin searches for student accommodation based on your budget, preferred city, registration needs, move-in date, and room type."
        keywords={[
          "room searching Netherlands",
          "student room search",
          "student accommodation search",
          "housing agent Netherlands",
        ]}
        faqs={[
          {
            question: "What details do I need to provide for room searching?",
            answer:
              "You provide your budget, move-in date, preferred period of stay, city, registration needs, number of people, and accommodation type.",
          },
          {
            question: "What happens after I submit a room searching request?",
            answer:
              "A Domakin agent reviews your requirements, contacts you, and starts looking for accommodation options that match your situation.",
          },
        ]}
      />
      <RoomSearching />
    </Wrapper>
  );
};

export default index;
