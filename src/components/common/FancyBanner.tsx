"use client";

import useTranslation from "next-translate/useTranslation";
import { underlineWordElement } from "@/utils/reactHelpers";
import NiceSelect from "@/ui/NiceSelect";
import { capitalizeFirstLetter } from "@/utils/helpers";
import Form from "react-bootstrap/Form";
import { useServer } from "@/hooks/useServer";
import { useState } from "react";

const FancyBanner = ({ style }: any) => {
  const { t } = useTranslation("translations");

  const { sendRequest } = useServer();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ email: "", cities: [] });
  const [errors, setErrors] = useState<any>([]);

  const handleChange = (e: any) => {
    setForm((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });    
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await sendRequest(
        "/common/newsletter/subscribe",
        "POST",
        form,
        {},
        { withLoading: false, withError: true }
      );

      if (response?.status) {
        setSuccess(true);
      } else if (response?.invalid_fields) {
        setErrors(response.invalid_fields);
      }
    } catch (error) {
      // do nothing
    } finally {
      setLoading(false);
    }
  };

  const locations = Object.keys(
    t("locations", {}, { returnObjects: true }) ?? []
  ).map((key) => key.toLowerCase());

  return (
    <div className="fancy-banner-two position-relative z-3 pt-90 lg-pt-50 pb-90 lg-pb-50">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="title-one text-center text-lg-start md-mb-40 pe-xl-5">
              <h4 className="text-white m0">
                {underlineWordElement(t("subscribe_email.description"), 3)}
              </h4>
            </div>
          </div>
          {success ? (
            <i className="col-lg-6 text-success text-center fa-solid fa-circle-check icon-big"></i>
          ) : (
            <div className="col-lg-6">
              <div className="form-wrapper me-auto ms-auto me-lg-0">
                <NiceSelect
                  className="nice-select mb-10"
                  options={locations.map((location) => {
                    return {
                      value: location,
                      text: capitalizeFirstLetter(location),
                    };
                  })}
                  defaultCurrent={0}
                  onChange={(e) => {
                    setForm((prevState: any) => {
                      return { ...prevState, cities: e.target.value };
                    });
                  }}
                  name="cities"
                  placeholder={t("filter.select_city")}
                  multi
                  isInvalid={errors.includes("cities")}
                />

                <form>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder={t("subscribe_email.email")}
                    onChange={handleChange}
                    value={form.email}
                    isInvalid={errors.includes("email")}
                    className={style ? "rounded-0" : ""}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={style ? "rounded-0" : ""}
                  >
                    {t("subscribe_email.send")}
                  </button>
                </form>
                {/* <div className="fs-16 mt-10 text-white">Already a Agent? <Link href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Sign in.</Link></div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FancyBanner;
