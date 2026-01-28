import React from "react";

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
                                List my room
                            </button>
                        )}
                        <button 
                            type="button" 
                            className="btn btn-lg btn-secondary" 
                            onClick={openReminderModal}
                        >
                            Remind me later
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}