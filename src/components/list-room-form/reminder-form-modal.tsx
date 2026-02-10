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
            centered
            className='blue-modal'
        >
            <Modal.Header closeButton>
                <h5 className="text-white">Reminder for uploading</h5>
            </Modal.Header>
            <Modal.Body>

                <div className="list-room-modal__first-step">
                    <div className="list-room-modal__first-step__body d-flex flex-column mt-20">

                        <>
                            <div className="form-group mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    className="py-2"
                                />
                            </div>

                            <div className="form-group mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="City"
                                    className="py-2"
                                />
                            </div>

                            <div className="form-group mb-2">
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
                                <button type="button" className="btn-two" onClick={() => setIsSave(true)}>
                                    Submit
                                </button>
                            </div>
                        </>

                    </div>
                </div>

            </Modal.Body>
        </Modal>
    );
}