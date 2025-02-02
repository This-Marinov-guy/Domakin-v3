import RoomSearching from "@/components/inner-pages/services/detail-page/RoomSearching";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Room Searching",
};

const index = () => {
  return (
    <Wrapper>
      <RoomSearching />
    </Wrapper>
  );
};

export default index;
