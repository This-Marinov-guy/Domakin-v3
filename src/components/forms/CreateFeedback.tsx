import useTranslation from "next-translate/useTranslation";
import React from "react";

const CreateFeedback = () => {
  const { t } = useTranslation("translations");

  return (
    <form className="bg-pink-two form-style-one wow fadeInUp pb-40">
      <div className="container">
        <h4 className="text-center">{t("feedbacks.share_your_experience")}</h4>
        <div className="row controls">
          <div className="col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("feedbacks.name")}</label>
              <input
                type="text"
                name="name"
                placeholder={t("feedbacks.name")}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta form-group mb-35">
              <textarea
                name="message"
                placeholder={t("feedbacks.share_your_feedback")}
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

export default CreateFeedback;
