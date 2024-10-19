"use client";
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";

interface FormData {
  subject: string;
  email: string;
  message: string;
}

const schema = yup
  .object({
    subject: yup.string().required().label("Name"),
    email: yup.string().required().email().label("Email"),
    message: yup.string().required().label("Message"),
  })
  .required();

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const { t } = useTranslation("translations");

  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (data: FormData) => {
    if (form.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVICE ?? "",
          process.env.NEXT_PUBLIC_TEMPLATE ?? "",
          form.current,
          process.env.NEXT_PUBLIC_PUBLIC_KEY
        )
        .then(
          async (result) => {
            const message = await t(
              "contact.your_message_was_sent_successfully"
            );
            const notify = () =>
              toast(message, {
                position: "top-center",
              });
            notify();
            reset();
            console.log(result.text);
          },
          async (error) => {
            const message = await t("contact.error_please_try_again");

            const notify = () =>
              toast(message, {
                position: "top-center",
              });
            notify();
            console.log(error.text);
          }
        );
    } else {
      console.error("Form reference is null");
    }
  };

  return (
    <form ref={form} onSubmit={handleSubmit(sendEmail)}>
      <h3>{t("contact.contact_us_directly")}</h3>
      <div className="messages"></div>
      <div className="row controls">
        <div className="col-12">
          <div className="input-group-meta form-group mb-30">
            <label htmlFor="">{t("contact.enter_the_subject")}</label>
            <input
              type="text"
              {...register("subject")}
              name="subject"
              placeholder={t("contact.enter_the_subject")}
            />
            <p className="form_error">{errors.subject?.message}</p>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-40">
            <label htmlFor="">{t("contact.enter_your_email")}</label>
            <input
              type="email"
              {...register("email")}
              placeholder={t("contact.enter_your_email")}
              name="email"
            />
            <p className="form_error">{errors.email?.message}</p>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta form-group mb-35">
            <textarea
              {...register("message")}
              name="message"
              placeholder={t("contact.enter_your_message")}
            ></textarea>
            <p className="form_error">{errors.message?.message}</p>
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

export default ContactForm;
