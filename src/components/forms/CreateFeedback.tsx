import { useServer } from "@/hooks/useServer";
import Form from "react-bootstrap/Form";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContent } from "react-toastify";
import { observer } from "mobx-react-lite";

const defaultData = {
  name: "",
  content: "",
};

const CreateFeedback = () => {
  const { t, lang } = useTranslation("translations");

  const { sendRequest, loading } = useServer();

  const [form, setForm] = useState(defaultData);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: any) => {
    setForm((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setErrors([]);

    sendRequest("/feedback/create", "POST", {
      ...form,
      language: lang,
    }).then((res) => {
      if (res?.status) {
        setForm(defaultData);

        toast.success(t("feedbacks.thank_you_your_feedback_was_sent") as ToastContent, {
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
        setErrors(res.invalid_fields);
      }
    });
  };

  return (
    <form className="bg-pink-two form-style-one wow fadeInUp pb-40 pt-40">
      <div className="container">
        <h4 className="text-center">{t("feedbacks.share_your_experience")}</h4>
        <div className="row controls">
          <div className="col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="">{t("feedbacks.name")}</label>
              <Form.Control
                type="name"
                name="name"
                value={form.name}
                onChange={(e) => {
                  handleChange(e);
                }}
                isInvalid={errors.includes("name")}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta form-group mb-35">
              <label htmlFor="">{t("feedbacks.share_your_feedback")}</label>
              <Form.Control
                as={"textarea"}
                name="content"
                value={form.content}
                onChange={(e) => {
                  handleChange(e);
                }}
                isInvalid={errors.includes("content")}
              />
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="btn-nine text-uppercase rounded-3 fw-normal w-100"
            >
              {loading ? <Spinner /> : t("feedbacks.send")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default observer(CreateFeedback);
