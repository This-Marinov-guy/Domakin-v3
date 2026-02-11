import React, { useEffect, useRef } from "react";
import HeaderV2 from "@/layouts/headers/HeaderV2";
import HeroSectionV2 from "@/components/hero/hero-section-v2";
import "react-multi-carousel/lib/styles.css";
import HowToWorksSectionHorizontal from "@/components/howToWorks/how-to-works-horizontal";
import QuestionsSection from "@/components/questions";
import ReminderSection from "@/components/reminder";
import useTranslation from "next-translate/useTranslation";
import ListRoomModal from "@/components/list-room-modal";
import ReminderFormModal from "@/components/list-room-form/reminder-form-modal";
import FooterFour from "@/layouts/footers/FooterFour";
import Feedback from "@/components/homes/home-five/Feedback";
import { useRouter } from "next/router";
import { useStore } from "@/stores/storeContext";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";

interface HomeSixProps {
    serverFeedbacks?: any[];
    serverProperties?: any[];
}

function LendingPageV3({ serverFeedbacks = [], serverProperties = [] }: HomeSixProps) {
    const { t } = useTranslation("translations");
    const router = useRouter();
    const {
        propertyStore: {
            setReferenceId,
            setAddListingDataFromApplication,
            showListRoomModal,
            showReminderModal,
            setShowListRoomModal,
            setShowReminderModal,
        },
    } = useStore();
    const { sendRequest } = useServer();
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (showListRoomModal) return;

        const refId = router.query.referenceId ?? router.query.reference_id;

        if (!refId || typeof refId !== "string") return;

        hasFetchedRef.current = true;
        sendRequest(`/listing-application/${refId}`)
            .then((res: any) => {
                if (res?.status && res?.data) {
                    setReferenceId(refId);
                    setAddListingDataFromApplication(res.data);
                    setShowListRoomModal(true);
                }
            })
            .catch(() => { });
    }, [router.query.referenceId, router.query.reference_id]);

    return (
        <div className="lending-page-v2">
            <HeaderV2 headerClasses="header-v3" />
            <HeroSectionV2 openModal={() => setShowListRoomModal(true)} />
            <HowToWorksSectionHorizontal />
            <ReminderSection
                title="Most rooms get filled in 4 days"
                isShowListingButton={true}
                secClasses="reminder-sec-two"
                openListingModal={() => setShowListRoomModal(true)}
                openReminderModal={() => setShowReminderModal(true)}
            />
            <p className="never-text">\
                Your listing preview —  exact <br />
                address is <span>never public</span>.
            </p>

            <Feedback style={true} feedbacks={serverFeedbacks} bg='transparent' />

            <ReminderSection
                title="List your room in 2–3 minutes."
                isShowListingButton={true}
                secClasses="reminder-sec-two"
                openListingModal={() => setShowListRoomModal(true)}
                openReminderModal={() => setShowReminderModal(true)}
            />

            <QuestionsSection secClasses="custom-accordion-sec-v2" />

            <ListRoomModal show={showListRoomModal} onHide={() => setShowListRoomModal(false)} />
            <ReminderFormModal show={showReminderModal} onHide={() => setShowReminderModal(false)} />
            <FooterFour />
        </div>
    );
}

export default observer(LendingPageV3);
