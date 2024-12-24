"use client";
import React from "react";
import TimePicker from "rc-time-picker";
import useTranslation from "next-translate/useTranslation";
import SingleDatePicker from "../ui/inputs/dates/SingleDatePicker";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";

const ViewingForm = () => {
  const { t } = useTranslation("translations");

  return (
    <form className="form-style-one wow fadeInUp pt-40 pb-40">
      <div className="container m-a row controls">
        <h4 className="mb-20">{t("viewing.fill_your_details")}</h4>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.name")}</label>
            <input type="text" name="subject" />
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.surname")}</label>
            <input type="text" name="subject" />
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.phone_to_be_contacted")}</label>
            <PrefixPhoneInput />
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.email")}</label>
            <input type="email" name="subject" />
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.city_of_viewing")}</label>
            <input type="text" name="subject" />
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.address_of_viewing_optional")}</label>
            <input type="text" name="subject" />
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.date")}</label>
            <SingleDatePicker />
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.time")}</label>
            <TimePicker showSecond={false} minuteStep={15} placeholder="Select Time"/>
            {/* <p className="form_error">{errors.subject?.message}</p> */}
          </div>
        </div>

        <div className="col-12">
          <div className="input-group-meta form-group mb-40">
            <textarea placeholder={t("viewing.comments")} name="email" />
            {/* <p className="form_error">{errors.email?.message}</p> */}
          </div>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn-nine text-uppercase rounded-3 fw-normal w-100"
          >
            {t("contact.send")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ViewingForm;
