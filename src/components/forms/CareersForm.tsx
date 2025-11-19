"use client";
import React, { useRef, useState, useEffect } from "react";
import { toast, ToastContent } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import { useServer } from "@/hooks/useServer";
import { transformToFormData } from "@/utils/helpers";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import PrefixPhoneInput from "@/components/ui/inputs/phone/PrefixPhoneInput";
import { useStore } from "@/stores/storeContext";

interface FormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  location: string;
  experience?: string;
  message?: string;
  resume?: FileList;
}

const schema = yup
  .object({
    name: yup.string().required().label("Name"),
    surname: yup.string().required().label("Surname"),
    email: yup.string().required().email().label("Email"),
    phone: yup.string().required().label("Phone"),
    position: yup.string().required().label("Position"),
    location: yup.string().required().label("Location"),
    experience: yup.string().label("Experience"),
    message: yup.string().label("Message"),
  })
  .required();

const CareersForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation("translations");
  const { sendRequest, loading } = useServer();
  const { userStore: { user } } = useStore();
  const [success, setSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [phoneValue, setPhoneValue] = useState("");

  const form = useRef<HTMLFormElement>(null);

  // Prefill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.name) {
        setValue("name", user.name);
      }
      if (user.surname) {
        setValue("surname", user.surname);
      }
      if (user.email) {
        setValue("email", user.email);
      }
      if (user.phone) {
        setValue("phone", user.phone);
        setPhoneValue(user.phone);
      }
    }
  }, [user]);

  const submitForm = async (data: FormData) => {
    clearErrors();
    setInvalidFields([]);
    setSuccess(false);

    // Prepare form data with file handling
    const formData: any = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: phoneValue || data.phone,
      position: data.position,
      location: data.location,
      experience: data.experience,
      message: data.message,
    };

    // Handle file upload if present
    if (data.resume && data.resume.length > 0) {
      formData.resume = data.resume[0];
    }

    sendRequest(
      "/career/apply",
      "POST",
      transformToFormData(formData),
      {},
    ).then((res) => {
      if (res?.status) {
        setSuccess(true);

        toast.success(
          t("careers.application_submitted_successfully") as ToastContent,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );

        // Start exit animation after 4 seconds
        setTimeout(() => {
          setIsExiting(true);
        }, 4000);

        // Hide success and reset form after fade out completes
        setTimeout(() => {
          setSuccess(false);
          setIsExiting(false);
          
          // Clear form
          reset();
          setPhoneValue("");

          // Reset file input
          if (form.current) {
            const fileInput = form.current.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          }
        }, 4500);
      } else if (res?.invalid_fields) {
        setInvalidFields(res.invalid_fields);
        
        // Set errors for invalid fields
        res.invalid_fields.forEach((field: string) => {
          setError(field as keyof FormData, {
            type: "server",
            message: t(`careers.${field}_error`) || `${field} is invalid`,
          });
        });

        toast.error(
          t("careers.error_please_try_again") as ToastContent,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    });
  };

  return (
    <div className="careers-form-wrapper position-relative">
      {success && (
        <div className={`success-animation ${isExiting ? "exiting" : ""}`}>
          <svg
            width="72"
            height="71"
            viewBox="0 0 72 71"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M36.6016 2.47412C57.2382 2.47412 70.2309 20.8638 70.2309 41.5004C70.2309 62.137 57.2382 67.2828 36.6016 67.2828C15.965 67.2828 1.85132 62.137 1.85132 41.5004C1.85132 20.8638 15.965 2.47412 36.6016 2.47412Z"
              fill="#ECF5FC"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M37.0854 22.553C46.7731 22.553 54.6265 30.4064 54.6265 40.0942C54.6265 49.7819 46.7731 57.6353 37.0854 57.6353C27.3976 57.6353 19.5442 49.7819 19.5442 40.0942C19.5442 30.4064 27.3976 22.553 37.0854 22.553Z"
              fill="#05C583"
            />
            <path
              d="M29.4866 40.2902C35.4018 45.4059 35.5906 45.4121 35.5906 45.4121L44.8505 34.376"
              stroke="#F3F9FF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26.3518 4.59904C26.4156 4.54271 26.4802 4.51486 26.512 4.48793C26.6088 4.40375 26.673 4.2648 26.7695 4.1814C26.673 4.32035 26.512 4.45931 26.3518 4.59904Z"
              fill="#203B71"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26.3518 4.59904C26.4156 4.54271 26.4802 4.51486 26.512 4.48793C26.6088 4.40375 26.673 4.2648 26.7695 4.1814C26.673 4.32035 26.512 4.45931 26.3518 4.59904Z"
              fill="#203B71"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.5203 4.778C22.5842 4.72098 22.6482 4.69241 22.6801 4.66562C22.7769 4.58099 22.8409 4.44251 22.9379 4.36035C22.8411 4.49952 22.6801 4.63704 22.5203 4.778Z"
              fill="#203B71"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.8575 40.4308L18.9235 40.1385L18.5059 40.0132"
              fill="#37639A"
            />
          </svg>
          <p className="success-message">
            {t("careers.application_submitted_successfully")}
          </p>
        </div>
      )}

      <form
        ref={form}
        onSubmit={handleSubmit(submitForm)}
        className={success ? "form-hidden" : ""}
      >
        <h3 className="text-center">{t("careers.apply_now")}</h3>
        <div className="messages"></div>
        <div className="row controls">
          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="name">{t("careers.name")}</label>
              <Form.Control
                type="text"
                {...register("name")}
                name="name"
                placeholder={t("careers.enter_name")}
                isInvalid={!!errors.name || invalidFields.includes("name")}
              />
              <p className="form_error">{errors.name?.message}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="surname">{t("careers.surname")}</label>
              <Form.Control
                type="text"
                {...register("surname")}
                name="surname"
                placeholder={t("careers.enter_surname")}
                isInvalid={
                  !!errors.surname || invalidFields.includes("surname")
                }
              />
              <p className="form_error">{errors.surname?.message}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="email">{t("careers.email")}</label>
              <Form.Control
                type="email"
                {...register("email")}
                placeholder={t("careers.enter_email")}
                name="email"
                isInvalid={!!errors.email || invalidFields.includes("email")}
              />
              <p className="form_error">{errors.email?.message}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="phone">{t("careers.phone")}</label>
              <PrefixPhoneInput
                value={phoneValue}
                onChange={(value: string) => {
                  setPhoneValue(value);
                  setValue("phone", value);
                }}
                isInvalid={!!errors.phone || invalidFields.includes("phone")}
              />
              <p className="form_error">{errors.phone?.message}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="position">{t("careers.position")}</label>
              <Form.Select
                {...register("position")}
                name="position"
                isInvalid={
                  !!errors.position || invalidFields.includes("position")
                }
              >
                <option value="">{t("careers.select_position")}</option>
                <option value="viewing_agent">
                  {t("careers.viewing_agent")}
                </option>
                <option value="property_seeker">
                  {t("careers.property_seeker")}
                </option>
              </Form.Select>
              <p className="form_error">{errors.position?.message}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="location">{t("careers.location")}</label>
              <Form.Control
                type="text"
                {...register("location")}
                placeholder={t("careers.enter_location")}
                name="location"
                isInvalid={
                  !!errors.location || invalidFields.includes("location")
                }
              />
              <p className="form_error">{errors.location?.message}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="experience">{t("careers.experience")}</label>
              <Form.Control
                type="text"
                {...register("experience")}
                placeholder={t("careers.enter_experience")}
                name="experience"
                isInvalid={
                  !!errors.experience || invalidFields.includes("experience")
                }
              />
              <p className="form_error">{errors.experience?.message}</p>
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta form-group mb-30">
              <label htmlFor="resume">{t("careers.resume")} (Optional)</label>
              <Form.Control
                type="file"
                {...register("resume")}
                name="resume"
                accept=".pdf,.doc,.docx"
                isInvalid={invalidFields.includes("resume")}
              />
              {invalidFields.includes("resume") && (
                <p className="form_error">
                  {t("careers.resume_error") || "Invalid file format"}
                </p>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta form-group mb-35">
              <label htmlFor="message">{t("careers.cover_letter")}</label>
              <Form.Control
                as="textarea"
                {...register("message")}
                name="message"
                placeholder={t("careers.enter_cover_letter")}
                rows={5}
                isInvalid={
                  !!errors.message || invalidFields.includes("message")
                }
              />
              <p className="form_error">{errors.message?.message}</p>
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn-nine text-uppercase rounded-3 fw-normal w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {t("careers.submitting") || "Submitting..."}
                </>
              ) : (
                t("careers.submit_application")
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .careers-form-wrapper {
          position: relative;
          min-height: 400px;
        }

        .form-hidden {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease-in;
        }

        form:not(.form-hidden) {
          opacity: 1;
          transition: opacity 0.5s ease-in 0.2s;
        }

        .success-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          animation: fadeIn 0.5s ease-in;
          opacity: 1;
          transition: opacity 0.5s ease-out;
        }

        .success-animation.exiting {
          animation: fadeOut 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }

        .success-message {
          font-size: 18px;
          font-weight: 600;
          color: #05c583;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default CareersForm;

