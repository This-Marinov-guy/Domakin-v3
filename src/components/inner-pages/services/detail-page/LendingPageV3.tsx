import HeaderV2 from "@/layouts/headers/HeaderV2";
import HeroSectionV2 from "@/components/hero/hero-section-v2";
import 'react-multi-carousel/lib/styles.css';
import AvailableRoomsV2 from "@/components/rooms/available-rooms-v2";
import ReviewsSectionV2 from "@/components/reviews/reviews-v2";
import HowToWorksSectionHorizontal from "@/components/howToWorks/how-to-works-horizontal";
import QuestionsSection from "@/components/questions";
import ReminderSection from "@/components/reminder";
import OffersSection from "@/components/offers";
import {KVK} from "@/utils/defines";
import useTranslation from "next-translate/useTranslation"
import ListRoomModal from "@/components/list-room-modal";
import ReminderFormModal from "@/components/list-room-form/reminder-form-modal";

export default function LendingPageV2() {
    const {t} = useTranslation('translations');

    const questions = [
        {
            question: 'Do I choose who gets my room when I move out?',
            answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
        },
        {
            question: 'Can I sublet my room through Domakin?',
            answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
        },
        {
            question: 'Can I list my room if I originally rented it through an agency?',
            answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
        },
        {
            question: 'How do I receive the €200 payout?',
            answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
        },
        {
            question: 'Do I get to decide who becomes my new rommate?',
            answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
        }
    ];

    return (
        <div className="lending-page-v2">
            <HeaderV2 headerClasses="header-v3" />
            <HeroSectionV2 />
            <ReminderSection title="Not moving soon?" isShowListingButton={false} />
            <OffersSection />
            <AvailableRoomsV2 />
            <p className="never-text">
                Your listing preview —  exact <br />
                address is <span>never public</span>.
            </p>
            <ReviewsSectionV2 />
            <ReminderSection title="List your room in 2–3 minutes." isShowListingButton={true} secClasses="reminder-sec-two" />
            <HowToWorksSectionHorizontal />
            <ReminderSection title="Most rooms get filled in 4 days" isShowListingButton={true} secClasses="reminder-sec-two" />
            <QuestionsSection questions={questions} secClasses="custom-accordion-sec-v2" />
            <footer className="border-footer border-footer-v2">
                <p>
                    KVK: {KVK}
                </p>
                <p>
                    {t("footer.all_rights_reserved")} {new Date().getFullYear()}
                </p>
            </footer>
            <ListRoomModal />
            <ReminderFormModal />
        </div>
    );
};
