"use client";

import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useServer } from "@/hooks/useServer";
import { toast, ToastContent } from "react-toastify";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";
import { prefillUserInfo, transformToFormData } from "@/utils/helpers";
import Trans from "next-translate/Trans";

const RentingForm = ({ refElement, property }: any) => {
  const { t } = useTranslation("translations");

  const { sendRequest, loading } = useServer();

  const [success, setSuccess] = useState(false);

  const {
    serviceStore: {
      rentingData,
      rentingErrorFields,
      updateRentingData,
      addRentingErrorFields,
      resetRentingData,
    },
    userStore: { user },
  } = useStore();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    addRentingErrorFields([]);

    sendRequest(
      "/renting/create",
      "POST",
      transformToFormData({
        ...rentingData,
        property: `${property.id} | ${property.title} | ${property.location}`,
      })
    ).then((res) => {
      if (res?.status) {
        resetRentingData();
        setSuccess(true);
      } else if (res?.invalid_fields) {
        addRentingErrorFields(res.invalid_fields);
      }
    });
  };

  useEffect(() => {
    prefillUserInfo(updateRentingData, user);
  }, [user]);

  if (success) {
    refElement.current = null;

    return (
      <div className="d-flex align-items-center justify-content-center bg-pink">
        <i className="text-success fa-solid fa-clipboard-check icon-big"></i>
      </div>
    );
  }

  return (
    <form ref={refElement} className="form-style-one wow fadeInUp pt-40 pb-40">
      <div className="container m-a row controls">
        <h4 className="mb-20">{t("viewing.fill_your_details")}</h4>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.name")}</label>
            <Form.Control
              type="text"
              value={rentingData.name}
              onChange={(e) => {
                updateRentingData("name", "", e.target.value);
              }}
              isInvalid={rentingErrorFields.includes("name")}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.surname")}</label>
            <Form.Control
              type="text"
              value={rentingData.surname}
              onChange={(e) => {
                updateRentingData("surname", "", e.target.value);
              }}
              isInvalid={rentingErrorFields.includes("surname")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.phone")}</label>
            <PrefixPhoneInput
              value={rentingData.phone}
              onChange={(value: string) => {
                updateRentingData("phone", "", value);
              }}
              isInvalid={rentingErrorFields.includes("phone")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.email")}</label>
            <Form.Control
              type="text"
              value={rentingData.email}
              onChange={(e) => {
                updateRentingData("email", "", e.target.value);
              }}
              isInvalid={rentingErrorFields.includes("email")}
            />
          </div>
        </div>

        <div className="col-lg-6col-md-12 col-12 mb-40">
          <div className="input-item input-item-name">
            <label htmlFor="">{t("files.motivational_letter_input")}</label>
            <Form.Control
              type="file"
              accept=".docx,.pdf"
              onChange={(event: any) => {
                const file = event.target.files[0];

                updateRentingData("letter", "", file);
              }}
              className="w-full p-2 border rounded"
              isInvalid={rentingErrorFields.includes("letter")}
            />
          </div>
        </div>

        <div className="col-lg-6col-md-12 col-12 mb-40 d-flex align-items-center gap-3">
          <label htmlFor="">{t("files.motivational_letter_example")}</label>
          <a
            href="/assets/img/templates/cover_letter_template.pdf"
            className="btn-eleven text-uppercase"
            target="_blank"
          >
            {t("files.download")}
          </a>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("emergency_housing.referral_code")}</label>
            <Form.Control
              type="text"
              value={rentingData.referralCode}
              onChange={(e) => {
                updateRentingData("referralCode", "", e.target.value);
              }}
              isInvalid={rentingErrorFields.includes("referralCode")}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="input-group-meta form-group mb-40">
            <Form.Control
              as="textarea"
              placeholder={t("viewing.comments")}
              value={rentingData.note}
              onChange={(e) => {
                updateRentingData("note", "", e.target.value);
              }}
              isInvalid={rentingErrorFields.includes("note")}
            />
          </div>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={rentingData.terms.contact}
            checked={rentingData.terms.contact}
            onChange={(e) => {
              updateRentingData("terms", "contact", e.target.checked);
            }}
            isInvalid={rentingErrorFields.includes("terms.contact")}
          />
          <label>{t("legals.permission_contact")}</label>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={rentingData.terms.legals}
            checked={rentingData.terms.legals}
            onChange={(e) => {
              updateRentingData("terms", "legals", e.target.checked);
            }}
            isInvalid={rentingErrorFields.includes("terms.legals")}
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
            {loading ? <Spinner size='sm' animation="border" /> : t("contact.send")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default observer(RentingForm);
