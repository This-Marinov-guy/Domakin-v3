
import logoTransparentWhite from "@/assets/img/logo-transparent-white.png";
import StarsIcon from "@/assets/images/icon/stars.svg";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import Link from "next/link";

export default function DraftRequestModal() {
    const [isSave, setIsSave] = useState(false);
    return (
        <div class="modal fade list-room-modal" id="draft-request-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-body p-0 m-0 border-bottom-0">

                        <div className="list-room-modal__first-step pt-25">
                            <div className="list-room-modal__first-step__body d-flex flex-column justify-content-center p-0">

                                {!isSave ? (
                                    <>
                                        <h2 className="text-center pb-25 text-white">
                                            Save and finish later?
                                        </h2>

                                        <div className="d-flex flex-column eleven-gap px-15">
                                            <label className="text-white">
                                                Enter your email and we’ll send you a resume link.
                                            </label>
                                            <div className="form-group">
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Email"
                                                    className="py-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center align-items-center mt-20 gap-2">
                                            <button onClick={() => setIsSave(true)} type="button" class="btn btn-primary border-0">
                                                Save & exist
                                            </button>
                                            <button type="button" class="btn btn-primary border-0" data-bs-toggle="modal" data-bs-target="#list-room-modal">
                                                Keep editing
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                                            <Image src={StarsIcon} alt="stars icon" />
                                            <p className="text-center text-white">
                                                Trusted by <strong className="text-white"> 385+ </strong> students
                                            </p>
                                        </div>

                                        <div className="d-flex flex-row justify-content-center align-items-center position-absolute bottom-0 top-0 left-0 right-0 m-auto px-15">
                                            <h2 className="text-center text-white">
                                                Draft saved! We sent a resume link to (email).
                                            </h2>
                                        </div>
                                    </>
                                )}


                                <button type="button" data-bs-dismiss="modal" className="d-flex justify-content-center align-items-center position-absolute bottom-0 left-0 right-0 mx-auto mb-3">
                                    <Image src={logoTransparentWhite} alt="Logo Icon" className="w-50" />
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}