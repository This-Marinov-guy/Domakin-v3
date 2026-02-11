"use client";

import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { prefillNestedUserInfo } from "@/utils/helpers";
import PrefixPhoneInput from "@/components/ui/inputs/phone/PrefixPhoneInput";

interface SecondStepProps {
    steps: (string | number)[];
    currentStep: number;
}

function SecondStep({ steps, currentStep }: SecondStepProps) {
    const { t } = useTranslation("translations");
    const {
        propertyStore,
        propertyStore: {
            addListingData: { personalData, terms, referralCode },
            updateListingData,
            loadListingData,
            errorFields,
        },
        userStore: { user },
    } = useStore();

    useEffect(() => {
        loadListingData();
    }, [loadListingData]);

    useEffect(() => {
        prefillNestedUserInfo("personalData", updateListingData, user);
    }, [user, updateListingData]);

    return (
        <div className="list-room-modal__seventh-step list-room-modal__first-step">
            <div className="list-room-modal__first-step__body d-flex flex-column">
                <div className="row gx-3">
                    <div className="col-12 col-md-6">
                        <div className="input-group-meta form-group mb-30">
                            <label htmlFor="list-room-name">{t("emergency_housing.name")}</label>
                            <Form.Control
                                id="list-room-name"
                                type="text"
                                value={personalData.name}
                                onChange={(e) =>
                                    updateListingData("personalData", "name", e.target.value)
                                }
                                isInvalid={errorFields.includes("name")}
                                className="py-2"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="input-group-meta form-group mb-30">
                            <label htmlFor="list-room-surname">
                                {t("emergency_housing.surname")}
                            </label>
                            <Form.Control
                                id="list-room-surname"
                                type="text"
                                value={personalData.surname}
                                onChange={(e) =>
                                    updateListingData("personalData", "surname", e.target.value)
                                }
                                isInvalid={errorFields.includes("surname")}
                                className="py-2"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="input-group-meta form-group mb-30">
                            <label htmlFor="list-room-phone">{t("viewing.phone")}</label>
                            <PrefixPhoneInput
                                value={personalData.phone}
                                onChange={(value: string) =>
                                    updateListingData("personalData", "phone", value)
                                }
                                isInvalid={errorFields.includes("phone")}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="input-group-meta form-group mb-30">
                            <label htmlFor="list-room-email">
                                {t("emergency_housing.email")}
                            </label>
                            <Form.Control
                                id="list-room-email"
                                type="email"
                                value={personalData.email}
                                onChange={(e) =>
                                    updateListingData("personalData", "email", e.target.value)
                                }
                                isInvalid={errorFields.includes("email")}
                                className="py-2"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="input-group-meta form-group mb-30">
                            <label htmlFor="list-room-referral">
                                {t("emergency_housing.referral_code")}
                            </label>
                            <Form.Control
                                id="list-room-referral"
                                type="text"
                                value={referralCode}
                                onChange={(e) =>
                                    updateListingData("referralCode", "", e.target.value)
                                }
                                isInvalid={errorFields.includes("referralCode")}
                                className="py-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group form-radio-group d-flex gap-2 flex-row align-items-center mb-20">
                    <Form.Check
                        type="checkbox"
                        name="terms-contact"
                        id="list-room-terms-contact"
                        checked={terms.contact}
                        onChange={(e) =>
                            updateListingData("terms", "contact", e.target.checked)
                        }
                        isInvalid={errorFields.includes("terms.contact")}
                    />
                    <label htmlFor="list-room-terms-contact">
                        {t("legals.permission_contact")}
                    </label>
                </div>

                <div className="form-group form-radio-group d-flex gap-2 flex-row align-items-center mb-20">
                    <Form.Check
                        type="checkbox"
                        name="terms-legals"
                        id="list-room-terms-legals"
                        checked={terms.legals}
                        onChange={(e) =>
                            updateListingData("terms", "legals", e.target.checked)
                        }
                        isInvalid={errorFields.includes("terms.legals")}
                    />
                    <label htmlFor="list-room-terms-legals">
                        <Trans
                            i18nKey="translations:legals.permission_terms"
                            components={{
                                link: (
                                    <a href="/terms&policy" target="_blank" rel="noreferrer"></a>
                                ),
                            }}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

export default observer(SecondStep);
