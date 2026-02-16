import React, { useMemo, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import NiceSelect from "@/ui/NiceSelect";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import SingleDatePicker from "@/components/ui/inputs/dates/SingleDatePicker";
import { useServer } from "@/hooks/useServer";
import { toast } from "react-toastify";
import MultiValueInput from "../inputs/MultiValueInput";
import ImageWithBadge from "../borders/ImageBadgeBorder";
import {
  AMENITIES_LIST,
  EDIT_PROPERTY_MODAL,
  FURNISHED_TYPES,
  getAmenityLabel,
  getAmenityLabelKey,
  getFurnishedTypeLabelKey,
  getPropertyTypeLabelKey,
  getSharedSpaceLabel,
  getSharedSpaceLabelKey,
  getTranslatedEnum,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  SHARED_SPACE_LIST,
} from "@/utils/defines";
import { showGeneralError, transformToFormData } from "@/utils/helpers";
import { MdClose } from "react-icons/md";
import MultiFilePreviewInput from "../inputs/files/MultiFilePreviewInput";
import signalIcon from "@/assets/images/icon/signal.avif";
import SignalStatusConfirmationModal from "./SignalStatusConfirmationModal";
import useStickyFooter from "@/hooks/useStickyFooter";

const EditPropertyModal = ({ callback = () => { } }: any) => {
  const {
    propertyStore: {
      updateEditListingData,
      editPropertyData,
      editErrorFields,
      updateMainImage,
      removeImage,
      addEditErrorFields,
      setProperties,
    },
    modalStore,
  } = useStore();

  const { sendRequest, loading } = useServer();

  const [showHideFromPublic, setShowHideFromPublic] = useState(
    editPropertyData.releaseTimestamp
  );
  const [isSignalClicked, setIsSignalClicked] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Use the sticky footer hook to detect if footer is visible
  const isFooterVisible = useStickyFooter(footerRef, {
    isActive: modalStore.modals[EDIT_PROPERTY_MODAL],
    threshold: 20, // Higher threshold to ensure footer is truly out of view
    initialDelay: 50,
  });

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

  const selectedAmenities: number[] = Array.isArray(editPropertyData.propertyData?.amenities)
    ? editPropertyData.propertyData.amenities
    : [];
  const selectedSharedSpaces: number[] = Array.isArray(editPropertyData.propertyData?.sharedSpace)
    ? editPropertyData.propertyData.sharedSpace
    : [];
  const toggleAmenity = (id: number) => {
    const next = selectedAmenities.includes(id)
      ? selectedAmenities.filter((x) => x !== id)
      : [...selectedAmenities, id].sort((a, b) => a - b);
    updateEditListingData("propertyData", "amenities", next);
  };
  const toggleSharedSpace = (id: number) => {
    const next = selectedSharedSpaces.includes(id)
      ? selectedSharedSpaces.filter((x) => x !== id)
      : [...selectedSharedSpaces, id].sort((a, b) => a - b);
    updateEditListingData("propertyData", "sharedSpace", next);
  };

  const reloadProperties = async () => {
    try {
      const response = await sendRequest(
        "/property/listing"
      );

      if (response?.status) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error loading listing:", error);
    }
  };

  const handleToggleSignal = () => {
    setIsSignalClicked(true);
    const isCurrentlyInSignal = editPropertyData.is_signal || false;
    updateEditListingData("is_signal", "", !isCurrentlyInSignal);
  };

  const performSubmit = async () => {
    addEditErrorFields([]);

    sendRequest(
      "/property/edit",
      "POST",
      transformToFormData(editPropertyData)
    ).then((res) => {
      if (res?.status) {
        reloadProperties();
        modalStore.closeAll();
        callback();

        toast.success("The property was successfully updated", {
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
        addEditErrorFields(res.invalid_fields);
      } else {
        showGeneralError("Failed to update property");
      }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Check if signal was clicked and status is not Active (2)
    if (isSignalClicked && editPropertyData.is_signal && editPropertyData.status != 2) {
      setShowConfirmationModal(true);
      return;
    }

    performSubmit();
  };

  const handleConfirmSubmit = () => {
    setShowConfirmationModal(false);
    performSubmit();
  };

  const closeModal = () => {
    setIsSignalClicked(false);
    modalStore.closeAll();
  };

  return (
    <Modal
      show={modalStore.modals[EDIT_PROPERTY_MODAL]}
      fullscreen
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <h5>Edit Property Details</h5>
      </Modal.Header>
      <Modal.Body>
        <form className="form-style-one wow fadeInUp">
          <div className="container m-a controls">
            <div className="row mt-20 mb-20">
              <div className="col-12 mb-4 d-flex flex-column gap-2 align-items-center">
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <button
                    disabled={loading}
                    type="button"
                    onClick={handleToggleSignal}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: editPropertyData.is_signal
                        ? "#28a745"
                        : "#dc3545",
                      color: "white",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <Image
                      src={signalIcon}
                      alt="Signal"
                      width={16}
                      height={16}
                      style={{ objectFit: "contain" }}
                    />
                    <span>
                      {editPropertyData.is_signal
                        ? "Added to Signal"
                        : "Removed from Signal"}
                    </span>
                  </button>
                </div>
                {isSignalClicked && (
                  <small>
                    *Signal listing will be modified after you submit the edit
                  </small>
                )}
              </div>
              {showHideFromPublic && (
                <div className="col-12 d-flex justify-content-start align-items-center gap-2 py-3">
                  <p className="mb-0">Hide property from the public</p>
                  <button
                    disabled={loading}
                    type="submit"
                    onClick={(e) => {
                      updateEditListingData("status", "", 1);
                      updateEditListingData("releaseTimestamp", "", null);
                      handleSubmit(e);
                    }}
                    className="btn-danger text-uppercase rounded-3 fw-normal"
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Hide from public"
                    )}
                  </button>
                </div>
              )}
              <div className="col-md-6">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">Status</label>
                  <NiceSelect
                    className="nice-select border-one d-flex align-items-center"
                    options={PROPERTY_STATUSES}
                    defaultCurrent={PROPERTY_STATUSES.findIndex((item) => {
                      return item.value == editPropertyData.status;
                    })}
                    onChange={(e) => {
                      if (
                        !editPropertyData.releaseTimestamp &&
                        e.target.value == "2"
                      ) {
                        updateEditListingData(
                          "releaseTimestamp",
                          "",
                          new Date()
                        );
                      }

                      updateEditListingData("status", "", e.target.value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.status")}
                    name=""
                    placeholder=""
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">Release Date</label>
                  <SingleDatePicker
                    placeholder=""
                    value={editPropertyData.releaseTimestamp}
                    onChange={(value: string) => {
                      updateEditListingData("releaseTimestamp", "", value);
                    }}
                    isInvalid={editErrorFields.includes("release_timestamp")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("emergency_housing.city")}</label>
                  <Form.Control
                    type="text"
                    value={editPropertyData.propertyData.city}
                    onChange={(e) => {
                      updateEditListingData(
                        "propertyData",
                        "city",
                        e.target.value
                      );
                    }}
                    isInvalid={editErrorFields.includes("propertyData.city")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("emergency_housing.address")}</label>
                  <Form.Control
                    type="text"
                    value={editPropertyData.propertyData.address}
                    onChange={(e) => {
                      updateEditListingData(
                        "propertyData",
                        "address",
                        e.target.value
                      );
                    }}
                    isInvalid={editErrorFields.includes("propertyData.address")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("emergency_housing.postcode")}</label>
                  <Form.Control
                    type="text"
                    value={editPropertyData.propertyData.postcode ?? ""}
                    onChange={(e) => {
                      updateEditListingData(
                        "propertyData",
                        "postcode",
                        e.target.value
                      );
                    }}
                    isInvalid={editErrorFields.includes("propertyData.postcode")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("emergency_housing.size")}</label>
                  <Form.Control
                    type="text"
                    value={editPropertyData.propertyData.size}
                    onChange={(e) => {
                      updateEditListingData(
                        "propertyData",
                        "size",
                        e.target.value
                      );
                    }}
                    isInvalid={editErrorFields.includes("propertyData.size")}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("property.type") || "Property type"}</label>
                  <NiceSelect
                    className="nice-select border-one d-flex align-items-center"
                    options={propertyTypeOptions}
                    defaultCurrent={Math.max(0, propertyTypeOptions.findIndex(
                      (item) => String(item.value) === String(editPropertyData.propertyData?.type ?? editPropertyData.propertyData?.property_type)
                    ))}
                    onChange={(e) => {
                      updateEditListingData("propertyData", "type", e.target.value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.type")}
                    name=""
                    placeholder=""
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("property.bathrooms") || "Bathrooms"}</label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={editPropertyData.propertyData.bathrooms ?? 1}
                    onChange={(e) => {
                      const value = Math.max(1, Math.floor(Number(e.target.value)) || 1);
                      updateEditListingData("propertyData", "bathrooms", value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.bathrooms")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("property.toilets") || "Toilets"}</label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={editPropertyData.propertyData.toilets ?? 1}
                    onChange={(e) => {
                      const value = Math.max(1, Math.floor(Number(e.target.value)) || 1);
                      updateEditListingData("propertyData", "toilets", value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.toilets")}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">
                    {t("emergency_housing.registration")}
                  </label>
                  <NiceSelect
                    className="nice-select border-one d-flex align-items-center"
                    options={[
                      { value: "yes", text: t("common.yes") },
                      { value: "no", text: t("common.no") },
                    ]}
                    defaultCurrent={editPropertyData.propertyData?.registration === false || String(editPropertyData.propertyData?.registration).toLowerCase() === "no" ? 1 : 0}
                    onChange={(e) => {
                      updateEditListingData(
                        "propertyData",
                        "registration",
                        e.target.value
                      );
                    }}
                    isInvalid={editErrorFields.includes(
                      "propertyData.registration"
                    )}
                    name=""
                    placeholder=""
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("emergency_housing.rent")}</label>
                  <Form.Control
                    type="number"
                    value={editPropertyData.propertyData.rent}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === ".") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        Math.floor(Number(e.target.value))
                      );

                      updateEditListingData("propertyData", "rent", value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.rent")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">Referral Code</label>
                  <Form.Control
                    type="text"
                    value={editPropertyData.referralCode || ""}
                    onChange={(e) => {
                      updateEditListingData("referralCode", "", e.target.value);
                    }}
                    isInvalid={editErrorFields.includes("referralCode")}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">{t("property.furnished_type") || "Furnished"}</label>
                  <NiceSelect
                    className="nice-select border-one d-flex align-items-center"
                    options={furnishedTypeOptions}
                    defaultCurrent={Math.max(0, furnishedTypeOptions.findIndex(
                      (item) => String(item.value) === String(editPropertyData.propertyData?.furnishedType ?? editPropertyData.propertyData?.furnished_type ?? 1)
                    ))}
                    onChange={(e) => {
                      updateEditListingData("propertyData", "furnishedType", e.target.value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.furnishedType")}
                    name=""
                    placeholder=""
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">Available from</label>
                  <SingleDatePicker
                    placeholder=""
                    value={editPropertyData.propertyData?.availableFrom ?? editPropertyData.propertyData?.available_from ?? ""}
                    onChange={(value: string) => {
                      updateEditListingData("propertyData", "availableFrom", value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.availableFrom")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30">
                  <label htmlFor="">Available to</label>
                  <SingleDatePicker
                    placeholder=""
                    value={editPropertyData.propertyData?.availableTo ?? editPropertyData.propertyData?.available_to ?? ""}
                    onChange={(value: string) => {
                      updateEditListingData("propertyData", "availableTo", value);
                    }}
                    isInvalid={editErrorFields.includes("propertyData.availableTo")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30 d-flex align-items-center gap-2">
                  <Form.Check
                    type="switch"
                    id="edit-pets-allowed"
                    label="Pets allowed"
                    checked={editPropertyData.propertyData?.petsAllowed === true || editPropertyData.propertyData?.pets_allowed === true}
                    onChange={(e) => {
                      updateEditListingData("propertyData", "petsAllowed", e.target.checked);
                    }}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div className="input-group-meta form-group mb-30 d-flex align-items-center gap-2">
                  <Form.Check
                    type="switch"
                    id="edit-smoking-allowed"
                    label="Smoking allowed"
                    checked={editPropertyData.propertyData?.smokingAllowed === true || editPropertyData.propertyData?.smoking_allowed === true}
                    onChange={(e) => {
                      updateEditListingData("propertyData", "smokingAllowed", e.target.checked);
                    }}
                  />
                </div>
              </div>

              <div className={`col-12 form-group mb-30 ${editErrorFields.includes("propertyData.amenities") ? "border border-danger rounded-3 p-3" : ""}`}>
                <label className="d-block mb-2">{t("property.amenities") || "Amenities"}</label>
                <small className="d-block text-muted mb-2">Select all that apply</small>
                <div className="row g-2 mt-2">
                  {amenitiesOptions.map(({ id, label }) => (
                    <div key={id} className="checkbox-card-type col-6 col-md-4 col-lg-3">
                      <input
                        type="checkbox"
                        className="btn-check"
                        name="amenities[]"
                        id={`edit-amenity-${id}`}
                        autoComplete="off"
                        checked={selectedAmenities.includes(id)}
                        onChange={() => toggleAmenity(id)}
                      />
                      <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor={`edit-amenity-${id}`}>
                        <span>{label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`col-12 form-group mb-30 ${editErrorFields.includes("propertyData.sharedSpace") ? "border border-danger rounded-3 p-3" : ""}`}>
                <label className="d-block mb-2">{t("property.shared_space") || "Shared space"}</label>
                <small className="d-block text-muted mb-2">Select all that apply</small>
                <div className="row g-2 mt-2">
                  {sharedSpaceOptions.map(({ id, label }) => (
                    <div key={id} className="checkbox-card-type col-6 col-md-4 col-lg-3">
                      <input
                        type="checkbox"
                        className="btn-check"
                        name="sharedSpace[]"
                        id={`edit-shared-space-${id}`}
                        autoComplete="off"
                        checked={selectedSharedSpaces.includes(id)}
                        onChange={() => toggleSharedSpace(id)}
                      />
                      <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor={`edit-shared-space-${id}`}>
                        <span>{label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-6">
                <MultiValueInput
                  label="Bills"
                  data={editPropertyData.propertyData.bills}
                  onChange={(updatedData) =>
                    updateEditListingData("propertyData", "bills", updatedData)
                  }
                  isInvalid={editErrorFields.includes("propertyData.bills")}
                />
              </div>

              <div className="col-6">
                <MultiValueInput
                  label="Title"
                  data={editPropertyData.propertyData.title}
                  onChange={(updatedData) =>
                    updateEditListingData("propertyData", "title", updatedData)
                  }
                  isInvalid={editErrorFields.includes("propertyData.title")}
                />
              </div>

              <div className="col-6">
                <MultiValueInput
                  label="Flatmates number"
                  data={editPropertyData.propertyData.flatmates}
                  onChange={(updatedData) =>
                    updateEditListingData(
                      "propertyData",
                      "flatmates",
                      updatedData
                    )
                  }
                  isInvalid={editErrorFields.includes("propertyData.flatmates")}
                />
              </div>

              <div className="col-6">
                <MultiValueInput
                  label="Period of availability"
                  data={editPropertyData.propertyData.period}
                  onChange={(updatedData) =>
                    updateEditListingData("propertyData", "period", updatedData)
                  }
                  isInvalid={editErrorFields.includes("propertyData.period")}
                />
              </div>

              <div className="col-12">
                <MultiValueInput
                  textarea
                  label="Description"
                  data={editPropertyData.propertyData.description}
                  onChange={(updatedData) =>
                    updateEditListingData(
                      "propertyData",
                      "description",
                      updatedData
                    )
                  }
                  isInvalid={editErrorFields.includes(
                    "propertyData.description"
                  )}
                />
              </div>

              <div className="col-12">
                <p>Click on an image to make it the main one</p>
                <div className="row">
                  {editPropertyData.propertyData?.images?.length > 0 &&
                    editPropertyData.propertyData.images.map(
                      (image: string, index: number) => (
                        <div
                          key={index}
                          className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4 position-relative"
                        >
                          {index === 0 ? (
                            <div className="position-relative">
                              <ImageWithBadge
                                src={image}
                                alt={`Property Image ${index + 1}`}
                                label="Main"
                                width={200}
                                height={200}
                              />
                              {editPropertyData.propertyData.images.length >
                                1 && (
                                  <button
                                    type="button"
                                    className="position-absolute top-0 end-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeImage(index);
                                    }}
                                    style={{
                                      zIndex: 100,
                                      borderRadius: "50%",
                                      width: "30px",
                                      height: "30px",
                                      background: "rgba(255, 0, 0, 0.8)",
                                      border: "2px solid white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "white",
                                      padding: "0",
                                      margin: "5px",
                                      boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                                    }}
                                  >
                                    <MdClose size={18} />
                                  </button>
                                )}
                            </div>
                          ) : (
                            <div className="position-relative">
                              <Image
                                src={image}
                                alt={`Property Image ${index + 1}`}
                                width={200}
                                height={200}
                                onClick={() => {
                                  updateMainImage(index);
                                }}
                                className="img-fluid rounded border"
                              />
                              <button
                                type="button"
                                className="position-absolute top-0 end-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                style={{
                                  zIndex: 100,
                                  borderRadius: "50%",
                                  width: "30px",
                                  height: "30px",
                                  background: "rgba(255, 0, 0, 0.8)",
                                  border: "2px solid white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  padding: "0",
                                  margin: "5px",
                                  boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                                }}
                              >
                                <MdClose size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    )}
                </div>

                <div className="mt-4">
                  <h5>Add New Images</h5>
                  <MultiFilePreviewInput
                    onChange={(files: any) =>
                      updateEditListingData("newImages", "", files)
                    }
                    value={editPropertyData.newImages}
                    maxSizeNote="Max file size: 5MB"
                    allowedFormatsNotes="Allowed formats: JPG, PNG, WEBP, SVG, HEIC"
                    onReject={(rejectedFiles: any[]) => {
                      showGeneralError(
                        "File upload rejected. Please check file size and format."
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      
      <Modal.Footer className="m-auto" ref={footerRef}>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button
            disabled={loading}
            type="submit"
            onClick={handleSubmit}
            className="btn-nine text-uppercase rounded-3 fw-normal w-100"
          >
            {loading ? <Spinner size="sm" animation="border" /> : "Update"}
          </button>
          <button
            disabled={loading}
            onClick={modalStore.closeAll}
            className="btn-seven text-uppercase rounded-3 fw-normal w-100"
          >
            back
          </button>
        </div>
      </Modal.Footer>

      {/* Sticky footer buttons when original footer is not visible */}
      {!isFooterVisible && (
        <div
          className="sticky-modal-footer"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            padding: "15px 20px",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
            zIndex: 1055,
            borderTop: "1px solid #e0e0e0",
            animation: "fadeInUp 0.3s ease-in-out",
          }}
        >
          <div className="container">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <button
                disabled={loading}
                type="button"
                onClick={handleSubmit}
                className="btn-nine text-uppercase rounded-3 fw-normal"
                style={{
                  flex: "1",
                  maxWidth: "300px",
                }}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Update"}
              </button>
              <button
                disabled={loading}
                type="button"
                onClick={closeModal}
                className="btn-seven text-uppercase rounded-3 fw-normal"
                style={{
                  flex: "1",
                  maxWidth: "300px",
                }}
              >
                back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Non-Active Status with Signal Changes */}
      <SignalStatusConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmSubmit}
      />
    </Modal>
  );
};

export default observer(EditPropertyModal);
