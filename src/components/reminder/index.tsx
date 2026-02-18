import React from "react";
import useTranslation from "next-translate/useTranslation";

interface ReminderSectionProps {
    title?: string;
    isShowListingButton: boolean;
    secClasses?: string;
    openListingModal?: () => void;
    openReminderModal?: () => void;
}

export default function ReminderSection({
    title,
    isShowListingButton,
    secClasses,
    openListingModal,
    openReminderModal
}: ReminderSectionProps) {
    const { t } = useTranslation("translations");
    return (
        <section className={`reminder-sec ${secClasses}`}>
            <div className="container">
                <div className="reminder-con">
                    <h2>
                        {title && title}
                    </h2>

                    <div className="d-flex flex-row justify-content-center align-items-center gap-1">
                        {isShowListingButton && isShowListingButton === true && (
                            <button
                                type="button"
                                className="btn btn-lg btn-warning"
                                onClick={openListingModal}
                            >
                                {t("reminder_section.list_my_room")}
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-lg btn-secondary"
                            onClick={openReminderModal}
                        >
                            {t("reminder_section.remind_me_later")}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}