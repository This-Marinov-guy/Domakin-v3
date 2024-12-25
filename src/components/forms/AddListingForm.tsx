import React from "react";
import Form from "react-bootstrap/Form";
import NiceSelect from "@/ui/NiceSelect";
import Trans from 'next-translate/Trans';
import useTranslation from "next-translate/useTranslation";
import PrefixMultiFilePreviewInput from "../ui/inputs/files/MultiFilePreviewInput";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";

const AddListingForm = () => {
  const { t } = useTranslation("translations");

  const {
    propertyStore: {
      addListingData: { personalData, propertyData, terms },
      updateListingData,
      errorFields,
    },
  } = useStore();

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <form className="form-style-one wow fadeInUp pt-40 pb-40">
      <div className="container m-a controls">
        <div className="row mt-20 mb-20">
          <h4 className="mb-20">
            {t("emergency_housing.personal_information")}
          </h4>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.name")}</label>
              <Form.Control
                type="text"
                value={personalData.name}
                onChange={(e) => {
                  updateListingData("personalData", "name", e.target.value);
                }}
                isInvalid={errorFields.includes("name")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.surname")}</label>
              <Form.Control
                type="text"
                value={personalData.surname}
                onChange={(e) => {
                  updateListingData("personalData", "surname", e.target.value);
                }}
                isInvalid={errorFields.includes("surname")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.phone")}</label>
              <PrefixPhoneInput
                onChange={(value: string) => {
                  updateListingData("personalData", "phone", value);
                }}
                isInvalid={errorFields.includes("phone")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.email")}</label>
              <Form.Control
                type="email"
                value={personalData.email}
                onChange={(e) => {
                  updateListingData("personalData", "email", e.target.value);
                }}
                isInvalid={errorFields.includes("email")}
              />
            </div>
          </div>
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
                isInvalid={errorFields.includes("city")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.address")}</label>
              <Form.Control
                type="text"
                value={propertyData.address}
                onChange={(e) => {
                  updateListingData("propertyData", "address", e.target.value);
                }}
                isInvalid={errorFields.includes("address")}
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
                isInvalid={errorFields.includes("size")}
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
                isInvalid={errorFields.includes("period")}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("emergency_housing.rent")}</label>
              <Form.Control
                type="text"
                value={propertyData.rent}
                onChange={(e) => {
                  updateListingData("propertyData", "rent", e.target.value);
                }}
                isInvalid={errorFields.includes("rent")}
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
                isInvalid={errorFields.includes("bills")}
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
                isInvalid={errorFields.includes("flatmates")}
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
                isInvalid={errorFields.includes("registration")}
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
                value={propertyData.flatmates}
                onChange={(e) => {
                  updateListingData(
                    "propertyData",
                    "description",
                    e.target.value
                  );
                }}
                isInvalid={errorFields.includes("description")}
              />
              <small>* {t("emergency_housing.description_disclaimer")}</small>
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
                isInvalid={errorFields.includes("note")}
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
            value={propertyData.images}
            onChange={(files: any) => {
              updateListingData("propertyData", "images", files);
            }}
            isInvalid={errorFields.includes("images")}
            // maxSizeNote={t("files.allowed_sizes_note", { allowed_size: "5MB" })}
            allowedFormatsNotes={t("files.allowed_types_note", {
              allowed_types: "jpg, png, jpeg, webp, svg, bmp, heic",
            })}
          />
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <input
            type="checkbox"
            name="Amenities"
            value={terms.contact}
            checked={terms.contact}
            onChange={(e) => {
              updateListingData("terms", "contact", e.target.checked);
            }}
          />
          <label>{t("legals.permission_contact")}</label>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <input
            type="checkbox"
            name="Amenities"
            value={terms.legals}
            checked={terms.legals}
            onChange={(e) => {
              updateListingData("terms", "legals", e.target.checked);
            }}
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
            type="submit"
            onClick={handleSubmit}
            className="btn-nine text-uppercase rounded-3 fw-normal w-100"
          >
            {t("contact.send")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default observer(AddListingForm);
