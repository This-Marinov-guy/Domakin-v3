import React, { useEffect, useMemo } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import NiceSelect from "@/ui/NiceSelect";
import Trans from "next-translate/Trans";
import Spinner from "react-bootstrap/Spinner";
import useTranslation from "next-translate/useTranslation";
import PrefixMultiFilePreviewInput from "../ui/inputs/files/MultiFilePreviewInput";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";
import SearchableCitySelect from "@/components/ui/SearchableCitySelect";
import SingleDatePicker from "@/components/ui/inputs/dates/SingleDatePicker";
import { DUTCH_CITIES } from "@/utils/countries";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useServer } from "@/hooks/useServer";
import {
  prefillUserInfo,
  transformToFormData,
  turnDecimalToInteger,
} from "@/utils/helpers";
import { toast } from "react-toastify";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FiInfo } from "react-icons/fi";
import {
  AMENITIES_LIST,
  FURNISHED_TYPES,
  getAmenityLabel,
  getAmenityLabelKey,
  getFurnishedTypeLabelKey,
  getPropertyTypeLabelKey,
  getSharedSpaceLabel,
  getSharedSpaceLabelKey,
  getTranslatedEnum,
  LONG_LOADING_MODAL,
  PROPERTY_TYPES,
  SHARED_SPACE_LIST,
} from "@/utils/defines";

const AddListingForm = () => {
  const { t } = useTranslation("translations");

  const propertyTypeOptions = useMemo(
    () =>
      PROPERTY_TYPES.map(({ value, text }) => ({
        value,
        text: getTranslatedEnum(t, getPropertyTypeLabelKey(value), text),
      })),
    [t]
  );
  const furnishedTypeOptions = useMemo(
    () =>
      FURNISHED_TYPES.map(({ value, text }) => ({
        value,
        text: getTranslatedEnum(t, getFurnishedTypeLabelKey(value), text),
      })),
    [t]
  );

  const { sendRequest, loading } = useServer();

  const {
    propertyStore,
    propertyStore: {
      addListingData: { personalData, propertyData, terms, referralCode },
      updateListingData,
      addErrorFields,
      errorFields,
    },
    userStore: { user, isUserFullySet },
    modalStore,
  } = useStore();

  const amenitiesOptions = useMemo(
    () =>
      [...AMENITIES_LIST].map((_, id) => ({
        id,
        label: getTranslatedEnum(t, getAmenityLabelKey(id), getAmenityLabel(id)),
      })).sort((a, b) => a.label.localeCompare(b.label)),
    [t]
  );
  const sharedSpaceOptions = useMemo(
    () =>
      SHARED_SPACE_LIST.map((_, id) => ({
        id,
        label: getTranslatedEnum(t, getSharedSpaceLabelKey(id), getSharedSpaceLabel(id)),
      })),
    [t]
  );

  const selectedAmenities: number[] = Array.isArray(propertyData?.amenities) ? propertyData.amenities : [];
  const selectedSharedSpaces: number[] = Array.isArray(propertyData?.sharedSpace) ? propertyData.sharedSpace : [];
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    addErrorFields([]);

    // Open the loading modal
    modalStore.setActiveModal(LONG_LOADING_MODAL);

    sendRequest(
      "/property/create",
      "POST",
      transformToFormData(propertyStore.addListingData, { toSnakeCase: true })
    ).then((res) => {
      // Close the loading modal
      modalStore.closeModal();

      if (res?.status) {
        propertyStore.resetListingData();

        toast.success("The property was uploaded successfully for approval", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (res?.invalid_fields) {
        addErrorFields(res.invalid_fields);
      }
    });
  };

  useEffect(() => {
    prefillUserInfo((field: string, _: string, value: any) => updateListingData("personalData", field, value), user, propertyStore.addListingData?.personalData);
  }, [user]);

  return (
    <form className="form-style-one wow fadeInUp pt-40 pb-40">
      <div className="container m-a controls">
        <div className="row mt-20 mb-20">
          {isUserFullySet && (
            <h4 className="mb-20">
              {t("emergency_housing.personal_information")}
            </h4>
          )}

          {
            <div className="col-6">
              <div className="input-group-meta form-group mb-30">
                <label htmlFor="">{t("emergency_housing.name")}</label>
                <Form.Control
                  type="text"
                  value={personalData.name}
                  onChange={(e) => {
                    updateListingData("personalData", "name", e.target.value);
                  }}
                  isInvalid={errorFields.includes("personalData.name")}
                />
              </div>
            </div>
          }

          {
            <div className="col-6">
              <div className="input-group-meta form-group mb-30">
                <label htmlFor="">{t("emergency_housing.surname")}</label>
                <Form.Control
                  type="text"
                  value={personalData.surname}
                  onChange={(e) => {
                    updateListingData(
                      "personalData",
                      "surname",
                      e.target.value
                    );
                  }}
                  isInvalid={errorFields.includes("personalData.surname")}
                />
              </div>
            </div>
          }

          {
            <div className="col-lg-6 col-md-6 col-12">
              <div className="input-group-meta form-group mb-30">
                <label htmlFor="">{t("viewing.phone")}</label>
                <PrefixPhoneInput
                  value={personalData.phone}
                  onChange={(value: string) => {
                    updateListingData("personalData", "phone", value);
                  }}
                  isInvalid={errorFields.includes("personalData.phone")}
                />
              </div>
            </div>
          }

          {
            <div className="col-lg-6 col-md-6 col-12">
              <div className="input-group-meta form-group mb-30">
                <label htmlFor="">{t("emergency_housing.email")}</label>
                <Form.Control
                  type="email"
                  value={personalData.email}
                  onChange={(e) => {
                    updateListingData("personalData", "email", e.target.value);
                  }}
                  isInvalid={errorFields.includes("personalData.email")}
                />
              </div>
            </div>
          }
        </div>

        <div className="row mt-20 mb-20">
          <h4 className="mb-20">
            {t("emergency_housing.property_information")}
          </h4>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.city")}</label>
              <SearchableCitySelect
                value={propertyData.city}
                onChange={(value: string) => {
                  updateListingData("propertyData", "city", value);
                }}
                isInvalid={errorFields.includes("propertyData.city")}
                cities={DUTCH_CITIES}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.period")}</label>
              <Form.Control
                type="text"
                value={propertyData.period}
                onChange={(e) => {
                  updateListingData("propertyData", "period", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.period")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("property.type") || "Property type"}</label>
              <NiceSelect
                className="nice-select border-one d-flex align-items-center"
                options={propertyTypeOptions}
                value={String(propertyData?.type ?? propertyData?.property_type ?? '')}
                onChange={(e) => {
                  updateListingData("propertyData", "type", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.type")}
                name=""
                placeholder=""
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("property.furnished_type") || "Furnished"}</label>
              <NiceSelect
                className="nice-select border-one d-flex align-items-center"
                options={furnishedTypeOptions}
                value={String(propertyData?.furnishedType ?? propertyData?.furnished_type ?? 1)}
                onChange={(e) => {
                  updateListingData("propertyData", "furnishedType", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.furnishedType")}
                name=""
                placeholder=""
              />
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.address")}</label>
              <Form.Control
                type="text"
                value={propertyData.address}
                onChange={(e) => {
                  updateListingData("propertyData", "address", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.address")}
              />
              <small>* {t("emergency_housing.precise_address")}</small>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.postcode")}</label>
              <Form.Control
                type="text"
                value={propertyData.postcode || ""}
                onChange={(e) => {
                  updateListingData("propertyData", "postcode", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.postcode")}
              />
              <small>* {t("emergency_housing.postcode_disclaimer")}</small>
            </div>
          </div>

          {/* Row: Rent | Bills – same as list-room fourth-step */}
          <div className="row gx-3 mb-30">
            <div className="col-12 col-lg-6">
              <div className="input-group-meta form-group mb-30 mb-lg-30">
                <label className="d-flex align-items-center">
                  {t("emergency_housing.rent")}
                  <InfoTip
                    id="add-listing-tt-rent"
                    text={t("list_room_steps.fourth.tooltips.base_rent")}
                  />
                </label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min={0}
                    step={1}
                    value={propertyData.rent ?? ""}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                    }}
                    onChange={(e) => {
                      updateListingData("propertyData", "rent", turnDecimalToInteger(e.target.value));
                    }}
                    isInvalid={errorFields.includes("propertyData.rent")}
                  />
                  <InputGroup.Text id="rent-unit">€</InputGroup.Text>
                </InputGroup>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="input-group-meta form-group mb-30 mb-lg-30">
                <label className="d-flex align-items-center">
                  <span>
                    Bills {' '}
                    <span className="text-muted small">({t("common.optional")})</span>
                  </span>
                  <InfoTip
                    id="add-listing-tt-bills"
                    text={t("list_room_steps.fourth.tooltips.bills")}
                  />
                </label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min={0}
                    step={1}
                    placeholder={t("common.optional")}
                    value={propertyData.bills ?? ""}
                    onChange={(e) => {
                      updateListingData("propertyData", "bills", turnDecimalToInteger(e.target.value));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                    }}
                    isInvalid={errorFields.includes("propertyData.bills")}
                  />
                  <InputGroup.Text id="bills-unit">€</InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>

          {/* Row: Deposit | Size – same as list-room fourth-step */}
          <div className="row gx-3 mb-30">
            <div className="col-12 col-lg-6">
              <div className="input-group-meta form-group mb-30 mb-lg-30">
                <label className="d-flex align-items-center">
                  <span>
                    {t("list_room_steps.fourth.deposit_label") || t("property.deposit_label") || "Deposit in euro"}{" "}
                    <span className="text-muted small">({t("common.optional")})</span>
                  </span>
                  <InfoTip
                    id="add-listing-tt-deposit"
                    text={t("list_room_steps.fourth.tooltips.deposit")}
                  />
                </label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min={0}
                    step={1}
                    placeholder={t("common.optional")}
                    value={propertyData.deposit ?? ""}
                    onChange={(e) => {
                      updateListingData("propertyData", "deposit", turnDecimalToInteger(e.target.value));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                    }}
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
                    id="add-listing-tt-size"
                    text={t("list_room_steps.fourth.tooltips.size")}
                  />
                </label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min={0}
                    step={1}
                    value={propertyData.size ?? ""}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === ".") e.preventDefault();
                    }}
                    onChange={(e) => {
                      updateListingData("propertyData", "size", turnDecimalToInteger(e.target.value));
                    }}
                    isInvalid={errorFields.includes("propertyData.size")}
                  />
                  <InputGroup.Text id="size-unit">m²</InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("property.bathrooms") || "Bathrooms"}</label>
              <Form.Control
                type="number"
                min={1}
                value={propertyData.bathrooms ?? 1}
                onChange={(e) => {
                  const value = Math.max(1, Math.floor(Number(e.target.value)) || 1);
                  updateListingData("propertyData", "bathrooms", value);
                }}
                isInvalid={errorFields.includes("propertyData.bathrooms")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("property.toilets") || "Toilets"}</label>
              <Form.Control
                type="number"
                min={1}
                value={propertyData.toilets ?? 1}
                onChange={(e) => {
                  const value = Math.max(1, Math.floor(Number(e.target.value)) || 1);
                  updateListingData("propertyData", "toilets", value);
                }}
                isInvalid={errorFields.includes("propertyData.toilets")}
              />
            </div>
          </div>


          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.flatmates")}</label>
              <Form.Control
                type="text"
                value={propertyData.flatmates}
                onChange={(e) => {
                  updateListingData(
                    "propertyData",
                    "flatmates",
                    e.target.value
                  );
                }}
                isInvalid={errorFields.includes("propertyData.flatmates")}
              />
            </div>
          </div>

          <div className={`col-12 form-group mb-30 ${errorFields.includes("propertyData.amenities") ? "border border-danger rounded-3 p-3" : ""}`}>
            <label className="d-block mb-2">{t("property.amenities") || "Amenities"}</label>
            <small className="d-block text-muted mb-2">Select all that apply</small>
            <div className="row g-2 mt-2">
              {amenitiesOptions.map(({ id, label }) => (
                <div key={id} className="checkbox-card-type col-6 col-md-4 col-lg-3">
                  <input
                    type="checkbox"
                    className="btn-check"
                    name="amenities[]"
                    id={`add-amenity-${id}`}
                    autoComplete="off"
                    checked={selectedAmenities.includes(id)}
                    onChange={() => toggleAmenity(id)}
                  />
                  <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor={`add-amenity-${id}`}>
                    <span>{label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={`col-12 form-group mb-30 ${errorFields.includes("propertyData.sharedSpace") ? "border border-danger rounded-3 p-3" : ""}`}>
            <label className="d-block mb-2">{t("property.shared_space") || "Shared space"}</label>
            <small className="d-block text-muted mb-2">Select all that apply</small>
            <div className="row g-2 mt-2">
              {sharedSpaceOptions.map(({ id, label }) => (
                <div key={id} className="checkbox-card-type col-6 col-md-4 col-lg-3">
                  <input
                    type="checkbox"
                    className="btn-check"
                    name="sharedSpace[]"
                    id={`add-shared-space-${id}`}
                    autoComplete="off"
                    checked={selectedSharedSpaces.includes(id)}
                    onChange={() => toggleSharedSpace(id)}
                  />
                  <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor={`add-shared-space-${id}`}>
                    <span>{label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12">
            <div className="switches-row mb-30">
              <div className="row gx-4">
                <div className="col-md-4 col-12 mb-20 md-mb-30">
                  <div className="switch-item">
                    <label htmlFor="registration-switch" className="switch-label">
                      {t("emergency_housing.registration")}
                    </label>
                    <div className="d-flex gap-3 align-items-center switch-control">
                      <Form.Check
                        type="switch"
                        id="registration-switch"
                        checked={propertyData.registration === true || propertyData.registration === "yes"}
                        onChange={(e) => {
                          updateListingData(
                            "propertyData",
                            "registration",
                            e.target.checked
                          );
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

                <div className="col-md-4 col-12 mb-20 md-mb-30">
                  <div className="switch-item">
                    <label htmlFor="pets-allowed-switch" className="switch-label">
                      {t("emergency_housing.pets_allowed")}
                    </label>
                    <div className="d-flex gap-3 align-items-center switch-control">
                      <Form.Check
                        type="switch"
                        id="pets-allowed-switch"
                        checked={propertyData.petsAllowed === true}
                        onChange={(e) => {
                          updateListingData(
                            "propertyData",
                            "petsAllowed",
                            e.target.checked
                          );
                        }}
                        isInvalid={errorFields.includes("propertyData.petsAllowed")}
                        className="custom-switch"
                      />
                      <span className="switch-status">
                        {propertyData.petsAllowed ? t("common.yes") : t("common.no")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 col-12 mb-20 md-mb-30">
                  <div className="switch-item">
                    <label htmlFor="smoking-allowed-switch" className="switch-label">
                      {t("emergency_housing.smoking_allowed")}
                    </label>
                    <div className="d-flex gap-3 align-items-center switch-control">
                      <Form.Check
                        type="switch"
                        id="smoking-allowed-switch"
                        checked={propertyData.smokingAllowed === true}
                        onChange={(e) => {
                          updateListingData(
                            "propertyData",
                            "smokingAllowed",
                            e.target.checked
                          );
                        }}
                        isInvalid={errorFields.includes("propertyData.smokingAllowed")}
                        className="custom-switch"
                      />
                      <span className="switch-status">
                        {propertyData.smokingAllowed ? t("common.yes") : t("common.no")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Available from</label>
              <SingleDatePicker
                placeholder=""
                value={propertyData?.availableFrom ?? propertyData?.available_from ?? ""}
                onChange={(value: string) => {
                  updateListingData("propertyData", "availableFrom", value);
                }}
                isInvalid={errorFields.includes("propertyData.availableFrom")}
              />
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Available to</label>
              <SingleDatePicker
                placeholder=""
                value={propertyData?.availableTo ?? propertyData?.available_to ?? ""}
                onChange={(value: string) => {
                  updateListingData("propertyData", "availableTo", value);
                }}
                isInvalid={errorFields.includes("propertyData.availableTo")}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group-meta form-group mb-40">
              <label htmlFor="">{t("emergency_housing.description")}</label>
              <Form.Control
                as="textarea"
                value={propertyData.description}
                onChange={(e) => {
                  updateListingData(
                    "propertyData",
                    "description",
                    e.target.value
                  );
                }}
                isInvalid={errorFields.includes("propertyData.description")}
              />
              <small>* {t("emergency_housing.description_disclaimer")}</small>
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.referral_code")}</label>
              <Form.Control
                type="text"
                value={referralCode}
                onChange={(e) => {
                  updateListingData("referralCode", "", e.target.value);
                }}
                isInvalid={errorFields.includes("referralCode")}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group-meta form-group mb-40">
              <label htmlFor="">{t("emergency_housing.note")}</label>
              <Form.Control
                as="textarea"
                value={propertyData.note}
                onChange={(e) => {
                  updateListingData("propertyData", "note", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.note")}
              />
            </div>
          </div>
        </div>

        <h4>{t("emergency_housing.property_images")}</h4>
        <small>* {t("emergency_housing.image_requirements")}</small>
        <br />
        <small className="mb-40">* {t("emergency_housing.extra_images")}</small>

        <div className="col-12 mt-10 mb-40">
          <PrefixMultiFilePreviewInput
            value={propertyStore.addListingData.images}
            onChange={(files: any) => {
              updateListingData("images", "", files);
            }}
            isInvalid={errorFields.includes("images")}
            // maxSizeNote={t("files.allowed_sizes_note", { allowed_size: "5MB" })}
            allowedFormatsNotes={t("files.allowed_types_note", {
              allowed_types: "jpg, png, jpeg, webp, svg, bmp, heic, mp4",
            })}
          />
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={terms.contact}
            checked={terms.contact}
            onChange={(e) => {
              updateListingData("terms", "contact", e.target.checked);
            }}
            isInvalid={errorFields.includes("terms.contact")}
          />
          <label>{t("legals.permission_contact")}</label>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={terms.legals}
            checked={terms.legals}
            onChange={(e) => {
              updateListingData("terms", "legals", e.target.checked);
            }}
            isInvalid={errorFields.includes("terms.legals")}
          />
          <label>
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

        <div className="col-12">
          <button
            disabled={loading}
            type="submit"
            onClick={handleSubmit}
            className="btn-nine text-uppercase rounded-3 fw-normal w-100"
          >
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              t("contact.send")
            )}
          </button>
        </div>
      </div>
      <style jsx>{`
        .switches-row {
          padding: 20px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .switch-item {
          padding: 15px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
        }

        .switch-item:hover {
          border-color: rgba(255, 145, 77, 0.3);
          box-shadow: 0 2px 8px rgba(255, 145, 77, 0.1);
        }

        .switch-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.7);
          margin-bottom: 12px;
          cursor: pointer;
        }

        .switch-control {
          margin-top: 8px;
        }

        .switch-status {
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.6);
          min-width: 40px;
        }

        :global(.custom-switch .form-check-input) {
          width: 3rem;
          height: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        :global(.custom-switch .form-check-input:checked) {
          background-color: #ff914d;
          border-color: #ff914d;
        }

        :global(.custom-switch .form-check-input:focus) {
          border-color: #ff914d;
          box-shadow: 0 0 0 0.25rem rgba(255, 145, 77, 0.25);
        }

        @media (max-width: 767px) {
          .switches-row {
            padding: 15px;
          }

          .switch-item {
            padding: 12px;
          }
        }
      `}</style>
    </form>
  );
};

export default observer(AddListingForm);
