"use client";

import React, { useMemo } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import useTranslation from "next-translate/useTranslation";
import { FiChevronDown, FiChevronUp, FiInfo } from "react-icons/fi";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { AMENITIES_LIST, SHARED_SPACE_LIST } from "@/utils/defines";
import { turnDecimalToInteger } from "@/utils/helpers";

const toInputValue = (val: any): number | string =>
    val !== null && val !== undefined && !isNaN(Number(val)) ? val : "";

function FourthStep({
    steps,
    currentStep,
}: {
    steps: (string | number)[];
    currentStep: number;
}) {
    const { t } = useTranslation("translations");
    const {
        propertyStore: {
            addListingData: { propertyData },
            updateListingData,
            errorFields,
        },
    } = useStore();

    const pd = propertyData as Record<string, unknown>;
    const selectedAmenities: number[] = Array.isArray(pd?.amenities)
        ? (pd.amenities as number[])
        : [];
    const selectedSharedSpaces: number[] = Array.isArray(pd?.sharedSpace)
        ? (pd.sharedSpace as number[])
        : [];
    const furnishedTypeValue = Number(pd?.furnishedType);

    const FURNITURE_OPTIONS = [
        { value: 1, label: "Fully furnished" },
        { value: 2, label: "Semi-furnished" },
        { value: 3, label: "None" },
    ] as const;

    const amenitiesSorted = useMemo(
        () =>
            [...AMENITIES_LIST].map((label, id) => ({ id, label })).sort((a, b) =>
                a.label.localeCompare(b.label)
            ),
        []
    );

    const flatmatesMaleCount = Math.max(0, parseInt(String(pd?.flatmatesMale ?? "0"), 10) || 0);
    const flatmatesFemaleCount = Math.max(0, parseInt(String(pd?.flatmatesFemale ?? "0"), 10) || 0);
    const bathroomsCount = Math.max(1, parseInt(String(pd?.bathrooms ?? "1"), 10) || 1);
    const toiletsCount = Math.max(1, parseInt(String(pd?.toilets ?? "1"), 10) || 1);

    const setFlatmatesMale = (n: number) =>
        updateListingData("propertyData", "flatmatesMale", String(Math.max(0, n)));
    const setFlatmatesFemale = (n: number) =>
        updateListingData("propertyData", "flatmatesFemale", String(Math.max(0, n)));
    const setBathrooms = (n: number) =>
        updateListingData("propertyData", "bathrooms", String(Math.max(1, n)));
    const setToilets = (n: number) =>
        updateListingData("propertyData", "toilets", String(Math.max(1, n)));

    const toggleAmenity = (id: number) => {
        const next = selectedAmenities.includes(id)
            ? selectedAmenities.filter((x) => x !== id)
            : [...selectedAmenities, id].sort((a, b) => a - b);
        updateListingData("propertyData", "amenities", next);
    };

    const toggleSharedSpace = (id: number) => {
        const next = selectedSharedSpaces.includes(id)
            ? selectedSharedSpaces.filter((x) => x !== id)
            : [...selectedSharedSpaces, id].sort((a, b) => a - b);
        updateListingData("propertyData", "sharedSpace", next);
    };

    const InfoTip = ({ id, text }: { id: string; text: string }) => (
        <OverlayTrigger placement="top" overlay={<Tooltip id={id}>{text}</Tooltip>}>
            <span
                className="ms-2 text-muted"
                role="button"
                tabIndex={0}
                aria-label="Info"
                style={{ display: "inline-flex", alignItems: "center" }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") e.preventDefault();
                }}
            >
                <FiInfo />
            </span>
        </OverlayTrigger>
    );

    return (
        <div className="list-room-modal__fourth-step list-room-modal__first-step">
            <div className="list-room-modal__first-step__body d-flex flex-column">
                {/* Row: Rent | Bills – 2 cols on lg+, 1 on medium and below */}
                <div className="row gx-3 mb-30">
                    <div className="col-12 col-lg-6">
                        <div className="input-group-meta form-group mb-30 mb-lg-30">
                            <label className="d-flex align-items-center">
                                {t("emergency_housing.rent")}
                                <InfoTip
                                    id="tt-base-rent"
                                    text={t("list_room_steps.fourth.tooltips.base_rent")}
                                />
                            </label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={toInputValue(propertyData.rent)}
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        updateListingData("propertyData", "rent", turnDecimalToInteger(e.target.value));
                                    }}
                                    isInvalid={errorFields.includes("rent")}
                                />
                                <InputGroup.Text id="rent-unit">€</InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="input-group-meta form-group mb-30 mb-lg-30">
                            <label className="d-flex align-items-center">
                                <span>
                                    {t("emergency_housing.bills")}{" "}
                                </span>
                                <InfoTip
                                    id="tt-bills"
                                    text={t("list_room_steps.fourth.tooltips.bills")}
                                />
                            </label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={toInputValue(propertyData.bills)}
                                    onChange={(e) => {
                                        updateListingData("propertyData", "bills", turnDecimalToInteger(e.target.value));
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                                    }}
                                    isInvalid={errorFields.includes("bills")}
                                />
                                <InputGroup.Text id="bills-unit">€</InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                </div>

                {/* Row: Deposit in euro | Size */}
                <div className="row gx-3 mb-30">
                    <div className="col-12 col-lg-6">
                        <div className="input-group-meta form-group mb-30 mb-lg-30">
                            <label className="d-flex align-items-center">
                                <span>
                                    {t("list_room_steps.fourth.deposit_label")}{" "}
                                </span>
                                <InfoTip
                                    id="tt-deposit"
                                    text={t("list_room_steps.fourth.tooltips.deposit")}
                                />
                            </label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={toInputValue(propertyData.deposit)}
                                    onChange={(e) => {
                                        updateListingData("propertyData", "deposit", turnDecimalToInteger(e.target.value));
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                                    }}
                                    isInvalid={errorFields.includes("deposit")}
                                />
                                <InputGroup.Text id="deposit-unit">€</InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="input-group-meta form-group mb-30 mb-lg-30">
                            <label className="d-flex align-items-center">
                                {t("emergency_housing.size")}
                                <InfoTip
                                    id="tt-size"
                                    text={t("list_room_steps.fourth.tooltips.size")}
                                />
                            </label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={toInputValue(propertyData.size)}
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        updateListingData("propertyData", "size", turnDecimalToInteger(e.target.value));
                                    }}
                                    isInvalid={errorFields.includes("size")}
                                />
                                <InputGroup.Text id="size-unit">m²</InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                </div>

                <div className="bg-pink-three p-3 rounded-3">

                    {/* Row: Flatmates (Male / Female) | House rules – same counter style as toilets */}
                    <div className="row gx-3 mb-30">
                        <div className="col-12 col-lg-6">
                            <div className={`form-group mb-30 mb-lg-30 ${(errorFields.includes("propertyData.flatmatesMale") || errorFields.includes("propertyData.flatmatesFemale")) ? "border border-danger rounded-3 p-3" : ""}`}>
                                <label>{t("emergency_housing.flatmates")}</label>
                                <div className="row gx-2 mt-2">
                                    <div className="col-6">
                                        <span className="d-block small text-muted mb-1">Male</span>
                                        <div className="d-flex align-items-center gap-2 bg-pink rounded-3" style={{ width: "7em" }}>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => setFlatmatesMale(flatmatesMaleCount - 1)}
                                                aria-label="Decrease male flatmates"
                                            >
                                                <FiChevronDown />
                                            </button>
                                            <span className="fw-bold text-center" style={{ minWidth: "1rem" }}>{flatmatesMaleCount}</span>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => setFlatmatesMale(flatmatesMaleCount + 1)}
                                                aria-label="Increase male flatmates"
                                            >
                                                <FiChevronUp />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <span className="d-block small text-muted mb-1">Female</span>
                                        <div className="d-flex align-items-center gap-2 bg-pink rounded-3" style={{ width: "7em" }}>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => setFlatmatesFemale(flatmatesFemaleCount - 1)}
                                                aria-label="Decrease female flatmates"
                                            >
                                                <FiChevronDown />
                                            </button>
                                            <span className="fw-bold text-center" style={{ minWidth: "1rem" }}>{flatmatesFemaleCount}</span>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => setFlatmatesFemale(flatmatesFemaleCount + 1)}
                                                aria-label="Increase female flatmates"
                                            >
                                                <FiChevronUp />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <small className="d-block mt-1 text-muted">
                                    Total: {flatmatesMaleCount + flatmatesFemaleCount}
                                </small>
                            </div>
                        </div>

                        {/* Bathrooms & Toilets – start at 1, up/down each side; 2 cols on lg+, 1 on medium and below */}
                        <div className="col-12 col-lg-6">
                            <div className={`form-group mb-30 mb-lg-30 ${(errorFields.includes("propertyData.bathrooms") || errorFields.includes("propertyData.toilets")) ? "border border-danger rounded-3 p-3" : ""}`}>
                                <label>Number of Bathrooms & Toilets</label>
                                <div className="row gx-2 mt-2">
                                    <div className="col-6">
                                        <span className="d-block small text-muted mb-1">Bathrooms</span>
                                        <div className="d-flex align-items-center gap-2 bg-pink  rounded-3" style={{ width: "7em" }}>
                                            <button
                                                type="button"
                                                className="btn "
                                                onClick={() => setBathrooms(bathroomsCount - 1)}
                                                aria-label="Decrease bathrooms"
                                            >
                                                <FiChevronDown />
                                            </button>
                                            <span className="fw-bold text-center" style={{ minWidth: "1rem" }}>{bathroomsCount}</span>
                                            <button
                                                type="button"
                                                className="btn "
                                                onClick={() => setBathrooms(bathroomsCount + 1)}
                                                aria-label="Increase bathrooms"
                                            >
                                                <FiChevronUp />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <span className="d-block small text-muted mb-1">Toilets</span>
                                        <div className="d-flex align-items-center gap-2 bg-pink  rounded-3" style={{ width: "7em" }}>
                                            <button
                                                type="button"
                                                className="btn "
                                                onClick={() => setToilets(toiletsCount - 1)}
                                                aria-label="Decrease toilets"
                                            >
                                                <FiChevronDown />
                                            </button>
                                            <span className="fw-bold text-center" style={{ minWidth: "1rem" }}>{toiletsCount}</span>
                                            <button
                                                type="button"
                                                className="btn "
                                                onClick={() => setToilets(toiletsCount + 1)}
                                                aria-label="Increase toilets"
                                            >
                                                <FiChevronUp />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className={`col-12 col-md-6 ${(errorFields.includes("propertyData.smokingAllowed") || errorFields.includes("propertyData.petsAllowed")) ? "border border-danger rounded-3 p-3" : ""}`}>
                        <div className="form-group mb-30 mb-lg-30">
                            <label className="d-block mb-2">House rules</label>
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                <div className="d-flex align-items-center gap-2 bg-pink p-3 rounded-3">
                                    <Form.Check
                                        type="switch"
                                        id="fourth-no-smoking"
                                        checked={propertyData.smokingAllowed === true}
                                        onChange={(e) => {
                                            updateListingData(
                                                "propertyData",
                                                "smokingAllowed",
                                                !propertyData.smokingAllowed
                                            )
                                        }
                                        }
                                        className="custom-switch"
                                    />
                                    <label htmlFor="fourth-no-smoking" className="mb-0">
                                        No smoking
                                    </label>
                                </div>
                                <div className="d-flex align-items-center gap-2 bg-pink p-3 rounded-3">
                                    <Form.Check
                                        type="switch"
                                        id="fourth-no-pets"
                                        checked={propertyData.petsAllowed === true}
                                        onChange={(e) =>
                                            updateListingData(
                                                "propertyData",
                                                "petsAllowed",
                                                !propertyData.petsAllowed
                                            )
                                        }
                                        className="custom-switch"
                                    />
                                    <label htmlFor="fourth-no-pets" className="mb-0">
                                        No pets
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                {/* 8. Amenities – sorted; checkbox-card-type; each adds enum int to array */}
                <div className={`form-group mb-30 ${errorFields.includes("propertyData.amenities") ? "border border-danger rounded-3 p-3" : ""}`}>
                    <label className="d-block mb-2">Amenities</label>
                    <small className="d-block">* You can select more than one</small>

                    <div className="row g-2 mt-3">
                        {amenitiesSorted.map(({ id, label }) => {
                            const inputId = `amenity-${id}`;
                            const checked = selectedAmenities.includes(id);
                            return (
                                <div key={id} className="checkbox-card-type col-6 col-md-4">
                                    <input
                                        type="checkbox"
                                        className="btn-check"
                                        name="amenities[]"
                                        id={inputId}
                                        autoComplete="off"
                                        checked={checked}
                                        onChange={() => toggleAmenity(id)}
                                    />
                                    <label
                                        className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12"
                                        htmlFor={inputId}
                                    >
                                        <span>{label}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shared spaces – behaves like amenities (multi-select) */}
                <div className={`form-group mb-30`}>
                    <label className="d-block mb-2">Shared spaces</label>
                    <small className="d-block">* You can select more than one</small>

                    <div className="row g-2 mt-3">
                        {SHARED_SPACE_LIST.map((label, id) => {
                            const inputId = `shared-space-${id}`;
                            const checked = selectedSharedSpaces.includes(id);
                            return (
                                <div key={id} className="checkbox-card-type col-6 col-md-4">
                                    <input
                                        type="checkbox"
                                        className="btn-check"
                                        name="sharedSpace[]"
                                        id={inputId}
                                        autoComplete="off"
                                        checked={checked}
                                        onChange={() => toggleSharedSpace(id)}
                                    />
                                    <label
                                        className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12"
                                        htmlFor={inputId}
                                    >
                                        <span>{label}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Furniture – single choice, furnishedType as integer */}
                <div className={`form-group mb-30`}>
                    <label className="d-block mb-2">Furniture</label>
                    <div className="row g-2">
                        {FURNITURE_OPTIONS.map(({ value, label }) => (
                            <div
                                key={value}
                                className={`checkbox-card-type col-6 col-md-4 ${errorFields.includes("furnishedType")
                                    ? "border border-danger rounded-5"
                                    : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="furniture"
                                    id={`furniture-${value}`}
                                    value={value}
                                    autoComplete="off"
                                    checked={furnishedTypeValue === value}
                                    onChange={() => updateListingData("propertyData", "furnishedType", value)}
                                />
                                <label
                                    className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12"
                                    htmlFor={`furniture-${value}`}
                                >
                                    <span>{label}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 9. Description */}
                <div className="input-group-meta form-group mb-30">
                    <label>{t("emergency_housing.description")}</label>
                    <Form.Control
                        as="textarea"
                        value={propertyData.description}
                        onChange={(e) =>
                            updateListingData("propertyData", "description", e.target.value)
                        }
                        isInvalid={errorFields.includes("description")}
                    />
                    <small className="text-muted">* {t("emergency_housing.description_disclaimer")}</small>
                </div>

                {/* 10. Note to agent */}
                <div className="input-group-meta form-group mb-30">
                    <label>{t("emergency_housing.note")}</label>
                    <Form.Control
                        as="textarea"
                        value={(pd?.note as string) ?? ""}
                        onChange={(e) =>
                            updateListingData("propertyData", "note", e.target.value)
                        }
                        isInvalid={errorFields.includes("note")}
                    />
                </div>
            </div>
        </div>
    );
}

export default observer(FourthStep);
