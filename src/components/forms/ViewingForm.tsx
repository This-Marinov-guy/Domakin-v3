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
import TimePickerInput from "../ui/inputs/dates/TimePickerInput";
import { prefillUserInfo } from "@/utils/helpers";
import moment from "moment";

const ViewingForm = () => {
  const { t } = useTranslation("translations");

  const { sendRequest, loading } = useServer();

  const {
    serviceStore: {
      viewingData,
      viewingErrorFields,
      updateViewingData,
      addViewingErrorFields,
      resetViewingData,
    },
    userStore: { user, isUserFullySet },
  } = useStore();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    addViewingErrorFields([]);

    // modify time & date format as they will never be changed
    const data = {
      ...viewingData,
      date: viewingData.date
        ? moment(viewingData.date).format("DD-MM-YYYY")
        : viewingData.date,
      time: viewingData.time
        ? viewingData.time.format("HH:mm")
        : viewingData.time,
    };

    sendRequest("/viewing/create", "POST", data).then((res) => {
      if (res?.status) {
        resetViewingData();

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
        addViewingErrorFields(res.invalid_fields);
      }
    });
  };

  useEffect(() => {
    prefillUserInfo(updateViewingData, user);
  }, [user]);

  return (
    <form className="form-style-one wow fadeInUp pt-40 pb-40">
      <div className="container m-a row controls">
        {isUserFullySet && (
          <h4 className="mb-20">{t("viewing.fill_your_details")}</h4>
        )}

        {(!user?.name || !viewingData.name) && (
          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.name")}</label>
              <Form.Control
                type="text"
                value={viewingData.name}
                onChange={(e) => {
                  updateViewingData("name", "", e.target.value);
                }}
                isInvalid={viewingErrorFields.includes("name")}
              />
            </div>
          </div>
        )}

        {(!user?.name || !viewingData.surname) && (
          <div className="col-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.surname")}</label>
              <Form.Control
                type="text"
                value={viewingData.surname}
                onChange={(e) => {
                  updateViewingData("surname", "", e.target.value);
                }}
                isInvalid={viewingErrorFields.includes("surname")}
              />
            </div>
          </div>
        )}

        {(!user?.phone || !viewingData.phone) && (
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.phone")}</label>
              <PrefixPhoneInput
                value={viewingData.phone}
                onChange={(value: string) => {
                  updateViewingData("phone", "", value);
                }}
                isInvalid={viewingErrorFields.includes("phone")}
              />
            </div>
          </div>
        )}

        {(!user?.email || !viewingData.email) && (
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("viewing.email")}</label>
              <Form.Control
                type="text"
                value={viewingData.email}
                onChange={(e) => {
                  updateViewingData("email", "", e.target.value);
                }}
                isInvalid={viewingErrorFields.includes("email")}
              />
            </div>
          </div>
        )}

        <h4 className="mb-20 mt-20">{t("viewing.viewing_details")}</h4>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.city_of_viewing")}</label>
            <Form.Control
              type="text"
              value={viewingData.city}
              onChange={(e) => {
                updateViewingData("city", "", e.target.value);
              }}
              isInvalid={viewingErrorFields.includes("city")}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.address_of_viewing")}</label>
            <Form.Control
              type="text"
              value={viewingData.address}
              onChange={(e) => {
                updateViewingData("address", "", e.target.value);
              }}
              isInvalid={viewingErrorFields.includes("address")}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("viewing.date")}</label>
            <SingleDatePicker
              placeholder=""
              value={viewingData.date}
              onChange={(value: string) => {
                updateViewingData("date", "", value);
              }}
              isInvalid={viewingErrorFields.includes("date")}
            />
          </div>
        </div>

        <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{`${t("viewing.time")}`}</label>
            <TimePickerInput
              showSecond={false}
              minuteStep={15}
              value={viewingData.time}
              onChange={(value: any) => {
                updateViewingData("time", "", value);
              }}
              isInvalid={viewingErrorFields.includes("time")}
            />
            <small>{t("date_time.timezone_nl")}</small>
          </div>
        </div>

        {/* Note 17.07.25 : remove referral code */}
        {/* <div className="col-6">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("emergency_housing.referral_code")}</label>
            <Form.Control
              type="text"
              value={viewingData.referralCode}
              onChange={(e) => {
                updateViewingData("referralCode", "", e.target.value);
              }}
              isInvalid={viewingErrorFields.includes("referralCode")}
            />
          </div>
        </div> */}

        <div className="col-12">
          <div className="input-group-meta form-group mb-40">
            <Form.Control
              as="textarea"
              placeholder={t("viewing.comments")}
              value={viewingData.note}
              onChange={(e) => {
                updateViewingData("note", "", e.target.value);
              }}
              isInvalid={viewingErrorFields.includes("note")}
              rows={12}
              style={{
                fontFamily: "inherit",
                lineHeight: "1.5",
                resize: "vertical",
                minHeight: "220px",
              }}
            />
          </div>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={viewingData.terms.contact}
            checked={viewingData.terms.contact}
            onChange={(e) => {
              updateViewingData("terms", "contact", e.target.checked);
            }}
            isInvalid={viewingErrorFields.includes("terms.contact")}
          />
          <label>{t("legals.permission_contact")}</label>
        </div>

        <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
          <Form.Check
            type="checkbox"
            name="Amenities"
            value={viewingData.terms.legals}
            checked={viewingData.terms.legals}
            onChange={(e) => {
              updateViewingData("terms", "legals", e.target.checked);
            }}
            isInvalid={viewingErrorFields.includes("terms.legals")}
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

export default observer(ViewingForm);
