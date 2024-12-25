import React from "react";
import Form from "react-bootstrap/Form";
import NiceSelect from "@/ui/NiceSelect";
import useTranslation from "next-translate/useTranslation";
import PrefixMultiFilePreviewInput from "../ui/inputs/files/MultiFilePreviewInput";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";
import { useStore } from "@/stores/storeContext";

const AddListingForm = () => {
  const { t } = useTranslation("translations");

  const {
    propertyStore: {
      addListingData: { personalData, propertyData, terms },
      updateListingData,
      errorFields
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
              <label htmlFor="">City</label>
              <input type="text" name="subject" />
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Address</label>
              <input type="text" name="subject" />
              <small>*Exclude any street numbers for security reasons</small>
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Size</label>
              <input type="text" name="subject" />
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Phone</label>
              <input type="text" name="subject" />
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Period of availability</label>
              <input type="email" name="subject" />
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Rent (in euro)</label>
              <input type="text" name="subject" />
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Approximate cost of bills (in euro)</label>
              <input type="text" name="subject" />
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">
                Number of flatmates / roommates (please specify)
              </label>
              <input type="text" name="subject" />
              {/* <p className="form_error">{errors.subject?.message}</p> */}
            </div>
          </div>

          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">Is registration possible</label>
              <NiceSelect
                className="nice-select border-one d-flex align-items-center"
                options={[
                  { value: "yes", text: "Yes" },
                  { value: "no", text: "No" },
                ]}
                defaultCurrent={0}
                onChange={() => {}}
                name=""
                placeholder=""
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group-meta form-group mb-40">
              <textarea placeholder={t("viewing.comments")} name="email" />
              {/* <p className="form_error">{errors.email?.message}</p> */}
            </div>
          </div>
        </div>

        <div className="col-12 mt-10 mb-40">
          <PrefixMultiFilePreviewInput />
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <input
            type="checkbox"
            name="Amenities"
            // value={list}
            // checked={selectedAmenities.includes(list)}
            // onChange={handleAmenityChange}
          />
          <label>
            I give my permission to be contacted by the organization for the
            purposes of the service
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

export default AddListingForm;
