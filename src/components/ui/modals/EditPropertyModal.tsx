import React, { useEffect, useState } from "react";
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
import { EDIT_PROPERTY_MODAL } from "@/utils/defines";
import { showGeneralError, transformToFormData } from "@/utils/helpers";
import { MdClose } from "react-icons/md";
import MultiFilePreviewInput from "../inputs/files/MultiFilePreviewInput";

const EditPropertyModal = ({ callback = () => {} }: any) => {
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

  const { t } = useTranslation("translations");

  const reloadProperties = async () => {
    try {
      const response = await sendRequest(
        "/property/listing",
        "GET",
        {},
        {},
        {
          withError: false,
          withLoading: true,
        }
      );

      if (response?.status) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error loading listing:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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

  const statusOptions = [
    { value: 1, text: "Pending" },
    { value: 2, text: "Active" },
    { value: 3, text: "Taken" },
  ];

  return (
    <Modal
      show={modalStore.modals[EDIT_PROPERTY_MODAL]}
      fullscreen
      onHide={modalStore.closeAll}
    >
      <Modal.Header closeButton>
        <h5>Edit Property Details</h5>
      </Modal.Header>
      <Modal.Body>
        <form className="form-style-one wow fadeInUp">
          <div className="container m-a controls">
            <div className="row mt-20 mb-20">
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
                    options={statusOptions}
                    defaultCurrent={statusOptions.findIndex((item) => {
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
                  <label htmlFor="">
                    {t("emergency_housing.registration")}
                  </label>
                  <NiceSelect
                    className="nice-select border-one d-flex align-items-center"
                    options={[
                      { value: "yes", text: t("common.yes") },
                      { value: "no", text: t("common.no") },
                    ]}
                    defaultCurrent={0}
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
      <Modal.Footer className="m-auto">
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
            type="submit"
            onClick={modalStore.closeAll}
            className="btn-seven text-uppercase rounded-3 fw-normal w-100"
          >
            back
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(EditPropertyModal);
