import useTranslation from "next-translate/useTranslation";
import React from "react";

const CreateDonation = () => {
  const { t } = useTranslation("translations");

  return (
    <form className="form-style-one wow fadeInUp pt-40 pb-40">
      <div className="container">
        <h4 className="text-center">
          {t("donations.your_contribution_means_a_lot")}
        </h4>
        <p className="text-center mb-20">{t("donations.thank_you")}</p>
        <div className="row controls">
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("donations.name_optional")}</label>
              <input type="text" name="name" />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("donations.amount_in_eur")}</label>
              <input type="number" name="amount" />
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta form-group mb-35">
              <textarea
                name="message"
                placeholder={t("donations.message_optional")}
              ></textarea>
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn-nine text-uppercase rounded-3 fw-normal w-100"
            >
              {t("feedbacks.send")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateDonation;
