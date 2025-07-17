import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import NiceSelect from "@/ui/NiceSelect";
import Trans from "next-translate/Trans";
import Spinner from "react-bootstrap/Spinner";
import useTranslation from "next-translate/useTranslation";
import PrefixMultiFilePreviewInput from "../ui/inputs/files/MultiFilePreviewInput";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useServer } from "@/hooks/useServer";
import {
  prefillNestedUserInfo,
  prefillUserInfo,
  transformToFormData,
} from "@/utils/helpers";
import { toast } from "react-toastify";
import { LONG_LOADING_MODAL } from "@/utils/defines";

const AddListingForm = () => {
  const { t } = useTranslation("translations");

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    addErrorFields([]);

    // Open the loading modal
    modalStore.setActiveModal(LONG_LOADING_MODAL);

    sendRequest(
      "/property/create",
      "POST",
      transformToFormData(propertyStore.addListingData)
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
    propertyStore.loadListingData();
  }, []);

  useEffect(() => {
    prefillNestedUserInfo("personalData", updateListingData, user);
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

          {(!user?.name || !personalData.name) && (
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
          )}

          {(!user?.name || !personalData.surname) && (
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
          )}

          {(!user?.phone || !personalData.phone) && (
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
          )}

          {(!user?.email || !personalData.email) && (
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
          )}
        </div>

        <div className="row mt-20 mb-20">
          <h4 className="mb-20">
            {t("emergency_housing.property_information")}
          </h4>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.city")}</label>
              <Form.Control
                type="text"
                value={propertyData.city}
                onChange={(e) => {
                  updateListingData("propertyData", "city", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.city")}
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

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.size")}</label>
              <Form.Control
                type="text"
                value={propertyData.size}
                onChange={(e) => {
                  updateListingData("propertyData", "size", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.size")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.rent")}</label>
              <Form.Control
                type="number"
                min={0}
                step={1}
                value={propertyData.rent}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === ".") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = Math.max(0, Math.floor(Number(e.target.value)));
                  updateListingData("propertyData", "rent", value.toString());
                }}
                isInvalid={errorFields.includes("propertyData.rent")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.bills")}</label>
              <Form.Control
                type="text"
                value={propertyData.bills}
                onChange={(e) => {
                  updateListingData("propertyData", "bills", e.target.value);
                }}
                isInvalid={errorFields.includes("propertyData.bills")}
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

          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.registration")}</label>
              <NiceSelect
                className="nice-select border-one d-flex align-items-center"
                options={[
                  { value: "yes", text: t("common.yes") },
                  { value: "no", text: t("common.no") },
                ]}
                defaultCurrent={0}
                onChange={(e) => {
                  updateListingData(
                    "propertyData",
                    "registration",
                    e.target.value
                  );
                }}
                isInvalid={errorFields.includes("propertyData.registration")}
                name=""
                placeholder=""
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
    </form>
  );
};

export default observer(AddListingForm);
