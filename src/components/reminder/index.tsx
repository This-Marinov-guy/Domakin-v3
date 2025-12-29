import ReminderIcon from "@/assets/images/icon/reminder.svg";
import Link from "next/link";
import Image from "next/image";

export default function ReminderSection({title, isShowListingButton, secClasses}: {title?: string, isShowListingButton: boolean, secClasses?: string}) {
    return (
        <section className={`reminder-sec ${secClasses}`}>
            <div className="container">
                <div className="reminder-con">
                    <h2>
                        {title && title}
                    </h2>

                    <div className="d-flex flex-row justify-content-center align-items-center gap-1">
                        {isShowListingButton && isShowListingButton === true && (
                            <Link href="#" className="btn btn-lg btn-warning" data-bs-toggle="modal" data-bs-target="#list-room-modal">
                                List my room
                            </Link>
                        )}
                        <Link href="#" className="btn btn-lg btn-secondary" data-bs-toggle="modal" data-bs-target="#reminder-modal">
                            Remind me later
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}