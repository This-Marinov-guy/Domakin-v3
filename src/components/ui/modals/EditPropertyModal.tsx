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
import { showGeneralError } from "@/utils/helpers";

const EditPropertyModal = ({ callback = () => {} }: any) => {
  const {
    propertyStore: {
      updateEditListingData,
      editPropertyData,
      editErrorFields,
      updateMainImage,
      addEditErrorFields,
      setProperties,
    },
    modalStore,
  } = useStore();

  const { sendRequest, loading } = useServer();

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

    sendRequest("/property/edit", "PUT", editPropertyData).then((res) => {
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
                    type="text"
                    value={editPropertyData.propertyData.rent}
                    onChange={(e) => {
                      updateEditListingData(
                        "propertyData",
                        "rent",
                        e.target.value
                      );
                    }}
                    isInvalid={editErrorFields.includes("propertyData.rent")}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12" />

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
                          className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
                        >
                          {index === 0 ? (
                            <ImageWithBadge
                              src={image}
                              alt={`Property Image ${index + 1}`}
                              label="Main"
                              width={200}
                              height={200}
                            />
                          ) : (
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
                          )}
                        </div>
                      )
                    )}
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
