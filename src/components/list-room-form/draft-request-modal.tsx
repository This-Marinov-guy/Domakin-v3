import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "next/image";
import logoTransparentWhite from "@/assets/img/logo-transparent-white.png";
import StarsIcon from "@/assets/images/icon/stars.svg";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import HeaderV2 from "@/layouts/headers/HeaderV2";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import { toast, ToastContent } from "react-toastify";

interface DraftRequestModalProps {
    show: boolean;
    onHide: () => void;
    onKeepEditing: () => void;
}

function DraftRequestModal({ show, onHide, onKeepEditing }: DraftRequestModalProps) {
    const [isSave, setIsSave] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();
    const { sendRequest, loading } = useServer();
    const { t } = useTranslation("translations");
    const {
        propertyStore: { addListingData, setReferenceId, getListingApplicationPayload, resetListRoomModal },
        userStore: { user },
    } = useStore();

    const prefilledEmail =
        addListingData?.personalData?.email || user?.email || "";

    useEffect(() => {
        if (show) {
            setEmail(prefilledEmail);
        }
    }, [show, prefilledEmail]);

    const handleSaveDraft = async () => {
        const formData = getListingApplicationPayload({ email: email.trim() });
        const res = await sendRequest("/listing-application/save", "POST", formData);

        if (res?.status) {
            toast.success(
                ("Draft saved successfully.") as unknown as ToastContent<unknown>
            );
            const { reference_id, referenceId, ...rest } = router.query;
            router.replace(
                { pathname: router.pathname, query: rest },
                undefined,
                { shallow: true }
            );
            resetListRoomModal();
            onHide();
        }
    };

    return (
        <Modal
            show={show}
            centered
            fullscreen
            className="draft-request-modal"
        >
            <Modal.Body>

                <div className="list-room-modal__first-step pt-25">
                    <div className="list-room-modal__first-step__body d-flex flex-column justify-content-center p-0">

                        {!isSave ? (
                            <>
                                <h2 className="text-center pb-25 text-white">
                                    {t("list_room_steps.draft.title")}
                                </h2>

                                <div className="d-flex flex-column eleven-gap px-15">
                                    <label className="text-white">
                                        {t("list_room_steps.draft.subtitle")}
                                    </label>
                                    <div className="form-group">
                                        <Form.Control
                                            type="email"
                                            placeholder={t("emergency_housing.email")}
                                            className="py-2"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center gap-5 m-auto" style={{ maxWidth: "20em", marginTop: "60px" }}>
                                    <button type="button" className="btn-danger-solid" onClick={() => onHide()}>
                                        {t("common.back")}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-two"
                                        onClick={handleSaveDraft}
                                        disabled={loading || !email.trim()}
                                    >
                                        {loading ? (
                                            <Spinner size="sm" animation="border" />
                                        ) : (
                                            t("common.submit")
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                                    <Image src={StarsIcon} alt="stars icon" />
                                    <p className="text-center text-white">
                                        <span>{t("list_room_steps.draft.trusted_by_prefix")}</span>{" "}
                                        <strong className="text-white">385+</strong>{" "}
                                        <span>{t("list_room_steps.draft.trusted_by_suffix")}</span>
                                    </p>
                                </div>

                                <div className="d-flex flex-row justify-content-center align-items-center position-absolute bottom-0 top-0 left-0 right-0 m-auto px-15">
                                    <h2 className="text-center text-white">
                                        {t("list_room_steps.draft.saved_message", { email: email || "(email)" })}
                                    </h2>
                                </div>
                            </>
                        )}

                        <div style={{ marginTop: '100px' }}>
                            <Image src={logoTransparentWhite} alt="Logo Icon" className="m-auto" style={{ height: '100px', objectFit: 'contain' }} />

                            <div className="d-flex flex-row justify-content-center align-items-center gap-3" >
                                <Image src={StarsIcon} alt="stars icon" />
                                <p className="text-center text-white fs-6">
                                    <span>{t("list_room_steps.draft.trusted_by_prefix")}</span>{" "}
                                    <strong className="text-white">385+</strong>{" "}
                                    <span>{t("list_room_steps.draft.trusted_by_suffix")}</span>
                                </p>
                            </div>
                        </div>

                        {/* <Image width={1000} height={1000} src={'/assets/img/bg/6.webp'} alt="Logo Icon" className="w-100" /> */}


                        {/* <button 
                                    type="button" 
                                    onClick={onHide} 
                                    className="d-flex justify-content-center align-items-center position-absolute bottom-0 left-0 right-0 mx-auto mb-3"
                                >
                                    <Image src={logoTransparentWhite} alt="Logo Icon" className="w-50" />
                                </button> */}

                    </div>
                </div>

            </Modal.Body>
        </Modal>
    );
}

export default observer(DraftRequestModal);