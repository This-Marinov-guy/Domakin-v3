import React, { useState } from "react";
import HeaderV2 from "@/layouts/headers/HeaderV2";
import HeroSection from "@/components/hero/index";
import 'react-multi-carousel/lib/styles.css';
import AvailableRooms from "@/components/rooms/available-rooms";
import ReviewsSection from "@/components/reviews";
import HowToWorksSection from "@/components/howToWorks";
import QuestionsSection from "@/components/questions";
import ListRoomModal from "@/components/list-room-modal";
import ReminderFormModal from "@/components/list-room-form/reminder-form-modal";

export default function LendingPageV2() {
    const [showListRoomModal, setShowListRoomModal] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);

    const questions = [
        {
            question: 'Do I choose who gets my room when I move out?',
            answer: `<strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'Can I sublet my room through Domakin?',
            answer: `<strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'Can I list my room if I originally rented it through an agency?',
            answer: `<strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'How do I receive the €200 payout?',
            answer: `<strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'Do I get to decide who becomes my new rommate?',
            answer: `<strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        }
    ];

    return (
        <>
            <HeaderV2 headerClasses="header-v2" />
            <HeroSection openModal={() => setShowListRoomModal(true)} openReminderModal={() => setShowReminderModal(true)} />
            <AvailableRooms />
            <ReviewsSection />
            <HowToWorksSection />
            <QuestionsSection questions={questions} />
            <footer className="border-footer"></footer>
            <ListRoomModal show={showListRoomModal} onHide={() => setShowListRoomModal(false)} />
            <ReminderFormModal show={showReminderModal} onHide={() => setShowReminderModal(false)} />
        </>
    );
};
