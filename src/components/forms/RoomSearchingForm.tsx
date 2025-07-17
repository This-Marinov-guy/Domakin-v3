import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Trans from "next-translate/Trans";
import Spinner from "react-bootstrap/Spinner";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useServer } from "@/hooks/useServer";
import { toast, ToastContent } from "react-toastify";
import SingleDatePicker from "../ui/inputs/dates/SingleDatePicker";
import PrefixPhoneInput from "../ui/inputs/phone/PrefixPhoneInput";
import NiceSelect from "@/ui/NiceSelect";
import { prefillUserInfo, transformToFormData } from "@/utils/helpers";

const RoomSearchingForm = () => {
  const { t } = useTranslation("translations");

  const { sendRequest, loading } = useServer();

  const peopleOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (i + 1).toString(),
    text: i === 4 ? "5+" : (i + 1).toString(),
  }));

  const periodOptions = [
    {
      value: "less than 4 months",
      text: `${t("common.less_than")} 4 ${t("date_time.months")}`,
    },
    { value: "4 months", text: 4 + " " + t("date_time.months") },
    { value: "6 months", text: 6 + " " + t("date_time.months") },
    { value: "12 months", text: 12 + " " + t("date_time.months") },
    { value: "2 years", text: 2 + " " + t("date_time.years") },
    { value: "3 years", text: 3 + " " + t("date_time.years") },
    { value: "unlimited", text: t("common.unlimited") },
  ];

  const typeOptions = [
    { value: "any", text: t("room_searching.type_options.any") },
    { value: "shared", text: t("room_searching.type_options.shared") },
    { value: "private", text: t("room_searching.type_options.private") },
  ];

  const {
    serviceStore: {
      searchingData,
      searchingErrorFields,
      updateSearchingData,
      addSearchingErrorFields,
      resetSearchingData,
    },
    userStore: { user },
  } = useStore();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    addSearchingErrorFields([]);

    sendRequest(
      "/renting/searching/create",
      "POST",
      transformToFormData(searchingData)
    ).then((res) => {
      if (res?.status) {
        resetSearchingData();

        toast.success(t("viewing.confirmation_message") as ToastContent, {
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
        addSearchingErrorFields(res.invalid_fields);
      }
    });
  };

  useEffect(() => {
    prefillUserInfo(updateSearchingData, user);
  }, [user]);

  return (
    <form className="form-style-one wow fadeInUp pt-40 pb-40">
      <div className="container m-a row controls">
        <h4 className="mb-20">{t("viewing.fill_your_details")}</h4>

        {(!user?.name || !searchingData.name) && (
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.name")}</label>
              <Form.Control
                type="text"
                value={searchingData.name}
                onChange={(e) => {
                  updateSearchingData("name", "", e.target.value);
                }}
                isInvalid={searchingErrorFields.includes("name")}
              />
            </div>
          </div>
        )}

        {(!user?.name || !searchingData.surname) && (
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.surname")}</label>
              <Form.Control
                type="text"
                value={searchingData.surname}
                onChange={(e) => {
                  updateSearchingData("surname", "", e.target.value);
                }}
                isInvalid={searchingErrorFields.includes("surname")}
              />
            </div>
          </div>
        )}

        {(!user?.phone || !searchingData.phone) && (
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.phone")}</label>
              <PrefixPhoneInput
                value={searchingData.phone}
                onChange={(value: string) => {
                  updateSearchingData("phone", "", value);
                }}
                isInvalid={searchingErrorFields.includes("phone")}
              />
            </div>
          </div>
        )}

        {(!user?.email || !searchingData.email) && (
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.email")}</label>
              <Form.Control
                type="text"
                value={searchingData.email}
                onChange={(e) => {
                  updateSearchingData("email", "", e.target.value);
                }}
                isInvalid={searchingErrorFields.includes("email")}
              />
            </div>
          </div>
        )}

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("emergency_housing.city")}</label>
            <Form.Control
              type="text"
              value={searchingData.city}
              onChange={(e) => {
                updateSearchingData("city", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("city")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">
              {t("room_searching.budget")} ({t("donations.amount_in_eur")})
            </label>
            <Form.Control
              type="number"
              value={searchingData.budget}
              onChange={(e) => {
                updateSearchingData("budget", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("budget")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("room_searching.move_in_date")}</label>
            <SingleDatePicker
              placeholder=""
              value={searchingData.moveIn}
              onChange={(value: string) => {
                updateSearchingData("moveIn", "", value);
              }}
              isInvalid={searchingErrorFields.includes("move_in")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("room_searching.period")}</label>
            <NiceSelect
              className="nice-select border-one d-flex align-items-center"
              options={periodOptions}
              defaultCurrent={0}
              onChange={(e) => {
                updateSearchingData("period", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("period")}
              name=""
              placeholder=""
            />
          </div>
        </div>

        <div className="col-lg-4 col-md-4 col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("room_searching.registration")}</label>
            <NiceSelect
              className="nice-select border-one d-flex align-items-center"
              options={[
                { value: "yes", text: t("common.yes") },
                { value: "no", text: t("common.no") },
              ]}
              defaultCurrent={0}
              onChange={(e) => {
                updateSearchingData("registration", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("registration")}
              name=""
              placeholder=""
            />
          </div>
        </div>

        <div className="col-lg-4 col-md-4 col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("room_searching.type")}</label>
            <NiceSelect
              className="nice-select border-one d-flex align-items-center"
              options={typeOptions}
              defaultCurrent={0}
              onChange={(e) => {
                updateSearchingData("type", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("type")}
              name=""
              placeholder=""
            />
          </div>
        </div>

        <div className="col-lg-4 col-md-4 col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("room_searching.people")}</label>
            <NiceSelect
              className="nice-select border-one d-flex align-items-center"
              options={peopleOptions}
              defaultCurrent={0}
              onChange={(e) => {
                updateSearchingData("people", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("people")}
              name=""
              placeholder=""
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-12 col-12 mb-40">
          <div className="input-item input-item-name">
            <label htmlFor="">{t("files.motivational_letter_input")}</label>
            <Form.Control
              type="file"
              accept=".docx,.doc,.pdf"
              onChange={(event: any) => {
                const file = event.target.files[0];

                updateSearchingData("letter", "", file);
              }}
              className="w-full p-2 border rounded"
              isInvalid={searchingErrorFields.includes("letter")}
            />
          </div>
        </div>

        <div className="col-lg-6 col-md-12 col-12 mb-40 d-flex align-items-center gap-3">
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
              value={searchingData.referralCode}
              onChange={(e) => {
                updateSearchingData("referralCode", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("referralCode")}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="input-group-meta form-group mb-40">
            <Form.Control
              as="textarea"
              placeholder={t("viewing.comments_optional")}
              value={searchingData.note}
              onChange={(e) => {
                updateSearchingData("note", "", e.target.value);
              }}
              isInvalid={searchingErrorFields.includes("note")}
            />
          </div>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={searchingData.terms.contact}
            checked={searchingData.terms.contact}
            onChange={(e) => {
              updateSearchingData("terms", "contact", e.target.checked);
            }}
            isInvalid={searchingErrorFields.includes("terms.contact")}
          />
          <label>{t("legals.permission_contact")}</label>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={searchingData.terms.legals}
            checked={searchingData.terms.legals}
            onChange={(e) => {
              updateSearchingData("terms", "legals", e.target.checked);
            }}
            isInvalid={searchingErrorFields.includes("terms.legals")}
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

export default observer(RoomSearchingForm);
