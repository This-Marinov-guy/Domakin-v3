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
import { showGeneralSuccess, showStandardNotification } from "@/utils/helpers";
import { LISTING_REFERENCE_ID } from "@/utils/defines";
import HeaderOne from "@/layouts/headers/HeaderOne";
import PropertyCardGrid from "@/components/ui/cards/properties/PropertyCardGrid";
import { MOCK_PROPERTY } from "@/utils/mocks";
import FloatingCenterButton from "@/components/ui/buttons/FloatingCenterButton";

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
            referenceId
        },
    } = useStore();

    const { sendRequest } = useServer();
    const hasFetchedRef = useRef(false);

    const removeRefIdFromQuery = () => {
        const { reference_id, referenceId, ...rest } = router.query;
        router.replace(
            { pathname: router.pathname, query: rest },
            undefined,
            { shallow: true }
        );
    };

    useEffect(() => {
        if (showListRoomModal) return;

        const refId = router.query.referenceId ?? router.query.reference_id;

        if (typeof window !== "undefined" && window.localStorage) {
            const storedRefId = localStorage.getItem(LISTING_REFERENCE_ID);

            if (storedRefId && !refId) {
                const continueUrl = `${router.pathname}?reference_id=${encodeURIComponent(storedRefId)}`;
                showStandardNotification(
                    "info",
                    <>
                        You have a listing in progress.{" "}
                        <a
                            href={continueUrl}
                            className="text-white text-decoration-underline fw-semibold"
                            onClick={(e) => {
                                e.preventDefault();
                                router.replace(
                                    { pathname: router.pathname, query: { ...router.query, reference_id: storedRefId } },
                                    undefined,
                                    { shallow: true }
                                );
                            }}
                        >
                            Continue from here
                        </a>
                    </>,
                    {
                        autoClose: false,
                        onClose: () => localStorage.removeItem(LISTING_REFERENCE_ID),
                    }
                );
            }
        }

        if (!refId || typeof refId !== "string" || refId === referenceId) return;

        hasFetchedRef.current = true;
        sendRequest(`/listing-application/${refId}`, "GET", {}, {}, { withError: false })
            .then((res: any) => {
                if (res?.status && res?.data) {
                    setReferenceId(refId);
                    setAddListingDataFromApplication(res.data);
                    setShowListRoomModal(true);
                } else {
                    removeRefIdFromQuery();
                }
            })
            .catch(() => {
                removeRefIdFromQuery();
            });
    }, [router.query.referenceId, router.query.reference_id]);

    return (
        <div className="lending-page-v2">
            <HeaderOne />
            <HeroSectionV2 openModal={() => setShowListRoomModal(true)} />
            <HowToWorksSectionHorizontal />


            <div className='row'>
                <div className="col-12">
                    <ReminderSection
                        title="Most rooms get filled in 4 days"
                        isShowListingButton={true}
                        secClasses="reminder-sec-two"
                        openListingModal={() => setShowListRoomModal(true)}
                        openReminderModal={() => setShowReminderModal(true)}
                    />
                </div>

                <div className="col-12">
                    <p className="never-text">\
                        Your listing preview —  exact <br />
                        address is <span>never public</span>.
                    </p>

                    <div className="container my-40">
                        <div className="row justify-content-center">
                            <PropertyCardGrid property={MOCK_PROPERTY} disableLinks />
                        </div>
                    </div>
                </div>
            </div>

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

            {/* Floating bottom-center \"List\" button, reusing the same component as careers page */}
            {(!showListRoomModal && !showReminderModal) && <FloatingCenterButton
                label="List my room"
                onClick={() => setShowListRoomModal(true)}
            />}
        </div>
    );
}

export default observer(LendingPageV3);
