import HeaderV2 from "@/layouts/headers/HeaderV2";
import HeroSection from "@/components/hero";
import FooterFour from "@/layouts/footers/FooterFour";
import 'react-multi-carousel/lib/styles.css';
import AvailableRooms from "@/components/rooms/available-rooms";
import ReviewsSection from "@/components/reviews";
import HowToWorksSection from "@/components/howToWorks";
import QuestionsSection from "@/components/questions";

export default function LendingPageV2() {

    return (
        <>
            <HeaderV2 />
            <HeroSection />
            <AvailableRooms />
            <ReviewsSection />
            <HowToWorksSection />
            <QuestionsSection />
            <footer className="border-footer"></footer>
        </>
    );
};
