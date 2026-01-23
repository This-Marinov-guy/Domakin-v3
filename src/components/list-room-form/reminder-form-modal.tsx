import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Image from "next/image";
import StarsIcon from "@/assets/images/icon/stars.svg";
import ReminderImage from "@/assets/images/media/reminder.png";
import { KVK } from "@/utils/defines";
import useTranslation from "next-translate/useTranslation";

interface ReminderFormModalProps {
    show: boolean;
    onHide: () => void;
}

export default function ReminderFormModal({ show, onHide }: ReminderFormModalProps) {
    const { t } = useTranslation('translations');
    const [isSave, setIsSave] = useState(false);

    return (
        <Modal
            show={show}
            onHide={onHide}
            fullscreen
            className="list-room-modal reminder-modal"
        >
            <Modal.Body>

                        <div className="list-room-modal__first-step">
                            <div className="list-room-modal__first-step__body d-flex flex-column mt-20">

                                {!isSave ? (
                                    <>
                                        <div className="form-group">
                                            <Form.Control
                                                type="text"
                                                placeholder="Name"
                                                className="py-2"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <Form.Control
                                                type="text"
                                                placeholder="City"
                                                className="py-2"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <Form.Control
                                                type="email"
                                                placeholder="Email"
                                                className="py-2"
                                            />
                                        </div>

                                        <div className="d-flex flex-column gap-3">
                                            <div className="d-flex flex-row gap-0 justify-content-between align-items-center">
                                                <p className="text-white">
                                                    When will your room
                                                    become free?
                                                </p>
                                                <div className="d-flex flex-row justify-content-center align-items-center gap-2 w-75">
                                                    <div className="form-group">
                                                        <Form.Control
                                                            type="text"
                                                            name="month"
                                                            id="month"
                                                            className="py-2 px-2"
                                                            placeholder="Month"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <Form.Control
                                                            type="text"
                                                            name="year"
                                                            id="year"
                                                            className="py-2 px-2"
                                                            placeholder="Year"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="d-flex flex-row justify-content-center align-items-center mt-20 gap-2">
                                            <button onClick={() => setIsSave(true)} type="button" className="btn btn-primary border-0">
                                                Remind me later
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                                            <Image src={StarsIcon} alt="stars icon" />
                                            <p className="text-center text-white fs-6">
                                                Trusted by <strong className="text-white"> 385+ </strong> students
                                            </p>
                                        </div>

                                        <div className="d-flex flex-column justify-content-center align-items-center success-msg gap-2">
                                            <h3 className="text-white text-center">
                                                Thank you for you submission!
                                            </h3>
                                            <p className="text-white text-center">
                                                We’ll remind you 60, 30 & 7 days
                                                before.
                                            </p>

                                            <div className="d-flex flex-row justify-content-center align-items-center">
                                                <Image src={ReminderImage} alt="stars icon" />
                                            </div>

                                            <p className="text-white text-center">
                                                If you have any questions do not
                                                hesitate to contacts us at
                                            </p>
                                            <p className="text-white text-center">
                                                <strong> list-my-room@domakin.nl </strong>
                                            </p>
                                            <p className="text-white text-center">
                                                or at <strong> (+31) 085 083 5000 </strong>
                                            </p>
                                        </div>


                                        <div className="d-flex flex-column justify-content-start position-absolute bottom-0 left-0 right-0 mx-auto mb-3 px-15">
                                            <p className="text-white mb-0">
                                                KVK: {KVK}
                                            </p>
                                            <p className="text-white">
                                                {t("footer.all_rights_reserved")} {new Date().getFullYear()}
                                            </p>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>

            </Modal.Body>
        </Modal>
    );
}