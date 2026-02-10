"use client";

import Image from "next/image";
import MallIcon from "@/assets/images/icon/mall.svg";
import StudioIcon from "@/assets/images/icon/studio.svg";
import HouseIcon from "@/assets/images/icon/house.svg";
import StudentHouseIcon from "@/assets/images/icon/student-house.svg";
import SearchableCitySelect from "@/components/ui/SearchableCitySelect";
import { DUTCH_CITIES } from "@/utils/countries";
import React from "react";
import Form from "react-bootstrap/Form";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import useTranslation from "next-translate/useTranslation";
import SingleDatePicker from "@/components/ui/inputs/dates/SingleDatePicker";

function ThirdStep({ steps, currentStep }: { steps: (string | number)[]; currentStep: number }) {
    const { t } = useTranslation("translations");
    const {
        propertyStore: {
            addListingData: { propertyData },
            updateListingData,
            errorFields,
        },
    } = useStore();

    return (
        <div className="list-room-modal__second-step">
            <div className="list-room-modal__second-step__body d-flex flex-column">

                <div className="house-room-box row gx-0">
                    <div className="form-group checkbox-card-type col m-2">
                        <input
                            type="radio"
                            className="btn-check"
                            name="apartment"
                            id="apartment"
                            autoComplete="off"
                            checked={propertyData.type === "room"}
                            onChange={() => updateListingData("propertyData", "type", "room")}
                        />
                        <label className="btn d-flex flex-column h-100" htmlFor="apartment">
                            <Image src={MallIcon} alt="property icon" />
                            <span>Room in a shared apartment</span>
                        </label>
                    </div>
                    <div className="form-group checkbox-card-type col m-2">
                        <input
                            type="radio"
                            className="btn-check"
                            name="apartment"
                            id="studio-house"
                            autoComplete="off"
                            checked={propertyData.type === "studio"}
                            onChange={() => updateListingData("propertyData", "type", "studio")}
                        />
                        <label className="btn d-flex flex-column h-100" htmlFor="studio-house">
                            <Image src={StudioIcon} alt="property icon" />
                            <span>Studio</span>
                        </label>
                    </div>
                </div>
                <div className="house-room-box row gx-0">
                    <div className="form-group checkbox-card-type col m-2">
                        <input
                            type="radio"
                            className="btn-check"
                            name="apartment"
                            id="single-house"
                            autoComplete="off"
                            checked={propertyData.type === "entire_place"}
                            onChange={() => updateListingData("propertyData", "type", "entire_place")}
                        />
                        <label className="btn d-flex flex-column h-100" htmlFor="single-house">
                            <Image src={HouseIcon} alt="property icon" />
                            <span>Entire place</span>
                        </label>
                    </div>
                    <div className="form-group checkbox-card-type col m-2">
                        <input
                            type="radio"
                            className="btn-check"
                            name="apartment"
                            id="student-house"
                            autoComplete="off"
                            checked={propertyData.type === "student_house"}
                            onChange={() => updateListingData("propertyData", "type", "student_house")}
                        />
                        <label className="btn d-flex flex-column h-100" htmlFor="student-house">
                            <Image src={StudentHouseIcon} alt="property icon" />
                            <span>Student house</span>
                        </label>
                    </div>
                </div>

                <div className="row gx-3 bg-pink-three p-3 mt-3 rounded-3">
                    <div className="form-group col-12 col-md-6">
                        <label htmlFor="list-room-city">{t("emergency_housing.city")}</label>
                        <SearchableCitySelect
                            cities={DUTCH_CITIES}
                            placeholder={t("emergency_housing.city")}
                            value={propertyData.city}
                            onChange={(value: string) => updateListingData("propertyData", "city", value)}
                            isInvalid={errorFields.includes("propertyData.city")}
                        />
                    </div>

                    <div className="input-group-meta form-group col-12 col-md-6">
                        <label htmlFor="list-room-address">{t("emergency_housing.address")}</label>
                        <Form.Control
                            id="list-room-address"
                            type="text"
                            value={propertyData.address ?? ""}
                            onChange={(e) => updateListingData("propertyData", "address", e.target.value)}
                            isInvalid={errorFields.includes("propertyData.address")}
                        />
                        <small className="d-block mt-1">* {t("emergency_housing.postcode_disclaimer")}</small>

                    </div>

                    <div className="input-group-meta form-group col-12 col-md-6">
                        <label htmlFor="list-room-postcode">{t("emergency_housing.postcode")}</label>
                        <Form.Control
                            id="list-room-postcode"
                            type="text"
                            value={propertyData.postcode ?? ""}
                            onChange={(e) => updateListingData("propertyData", "postcode", e.target.value)}
                            isInvalid={errorFields.includes("propertyData.postcode")}
                        />
                        <small className="d-block mt-1">* {t("emergency_housing.postcode_disclaimer")}</small>
                    </div>

                    <div className="p-3 d-flex flex-row align-items-center col-md-6">
                        <div className="switch-item d-flex items-center justify-center gap-4">
                            <label htmlFor="registration-switch" className="switch-label">
                                {t("emergency_housing.registration")}
                            </label>
                            <div className="d-flex gap-3 align-items-center switch-control">
                                <Form.Check
                                    type="switch"
                                    id="registration-switch"
                                    checked={propertyData.registration === true || propertyData.registration === "yes"}
                                    onChange={(e) => {
                                        updateListingData("propertyData", "registration", e.target.checked);
                                    }}
                                    isInvalid={errorFields.includes("propertyData.registration")}
                                    className="custom-switch"
                                />
                                <span className="switch-status">
                                    {propertyData.registration === true || propertyData.registration === "yes"
                                        ? t("common.yes")
                                        : t("common.no")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="input-group-meta form-group col-12 col-md-6">
                        <label htmlFor="list-room-available-from">Available from</label>
                        <SingleDatePicker
                            id="list-room-available-from"
                            placeholder="Select date"
                            value={propertyData.availableFrom ?? ""}
                            onChange={(value: string | Date | null) => {
                                const next =
                                    value == null
                                        ? null
                                        : value instanceof Date
                                          ? value.toISOString().slice(0, 10)
                                          : String(value);
                                updateListingData("propertyData", "availableFrom", next);
                            }}
                            isInvalid={errorFields.includes("propertyData.availableFrom")}
                        />
                    </div>

                    <div className="input-group-meta form-group col-12 col-md-6">
                        <label htmlFor="list-room-available-to">
                            Available to <span className="text-muted small">(optional)</span>
                        </label>
                        <SingleDatePicker
                            id="list-room-available-to"
                            placeholder="Select date"
                            value={propertyData.availableTo ?? ""}
                            onChange={(value: string | Date | null) => {
                                const next =
                                    value == null
                                        ? null
                                        : value instanceof Date
                                          ? value.toISOString().slice(0, 10)
                                          : String(value);
                                updateListingData("propertyData", "availableTo", next);
                            }}
                            isInvalid={errorFields.includes("propertyData.availableTo")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(ThirdStep);