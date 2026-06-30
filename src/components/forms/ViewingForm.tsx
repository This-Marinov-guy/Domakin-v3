import React, { useEffect, useRef, useState } from "react";
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
import SearchableCitySelect from "../ui/SearchableCitySelect";
import { VIEWING_SERVICE_LOCATIONS } from "@/data/viewingLocations";
import { prefillUserInfo } from "@/utils/helpers";
import {
  INSTAGRAM,
  PHONE_NUMBER,
  VIEWING_EXPRESS_PRICE,
  VIEWING_STANDARD_PRICE,
} from "@/utils/defines";
import moment from "moment";
import Image from "next/image";

const domakinWhatsAppLink = `https://wa.me/${PHONE_NUMBER.replace(/\D/g, "")}`;

type Translate = (key: string) => string;

const getViewingUseCases = (t: Translate) => [
  {
    icon: "fa-plane-departure",
    title: t("viewing.page.use_cases.abroad_title"),
    text: t("viewing.page.use_cases.abroad_text"),
  },
  {
    icon: "fa-shield-halved",
    title: t("viewing.page.use_cases.scam_title"),
    text: t("viewing.page.use_cases.scam_text"),
  },
  {
    icon: "fa-ranking-star",
    title: t("viewing.page.use_cases.lottery_title"),
    text: t("viewing.page.use_cases.lottery_text"),
  },
  {
    icon: "fa-clock",
    title: t("viewing.page.use_cases.trips_title"),
    text: t("viewing.page.use_cases.trips_text"),
  },
];

const getViewingDeliverables = (t: Translate) => [
  {
    icon: "fa-clipboard-check",
    title: t("viewing.page.deliverables.report_title"),
    text: t("viewing.page.deliverables.report_text"),
  },
  {
    icon: "fa-house-circle-check",
    title: t("viewing.page.deliverables.check_title"),
    text: t("viewing.page.deliverables.check_text"),
  },
  {
    icon: "fa-circle-question",
    title: t("viewing.page.deliverables.questions_title"),
    text: t("viewing.page.deliverables.questions_text"),
  },
];

const getViewingQuestionChecklist = (t: Translate) => [
  t("viewing.page.checklist.q1"),
  t("viewing.page.checklist.q2"),
  t("viewing.page.checklist.q3"),
  t("viewing.page.checklist.q4"),
  t("viewing.page.checklist.q5"),
  t("viewing.page.checklist.q6"),
  t("viewing.page.checklist.q7"),
  t("viewing.page.checklist.q8"),
  t("viewing.page.checklist.q9"),
  t("viewing.page.checklist.q10"),
];

const getViewingAnswerFaqs = (t: Translate) => [
  { question: t("viewing.page.faqs.q1"), answer: t("viewing.page.faqs.a1") },
  { question: t("viewing.page.faqs.q2"), answer: t("viewing.page.faqs.a2") },
  { question: t("viewing.page.faqs.q3"), answer: t("viewing.page.faqs.a3") },
  { question: t("viewing.page.faqs.q4"), answer: t("viewing.page.faqs.a4") },
];

const getViewingNextSteps = (t: Translate) => [
  t("viewing.page.next_steps.s1"),
  t("viewing.page.next_steps.s2"),
  t("viewing.page.next_steps.s3"),
];

const getViewingPricingOptions = (t: Translate) => [
  {
    name: t("viewing.page.pricing.standard_name"),
    price: VIEWING_STANDARD_PRICE,
    badge: t("viewing.page.pricing.standard_badge"),
    description: t("viewing.page.pricing.standard_description"),
    bestFor: t("viewing.page.pricing.standard_best"),
    includes: [
      t("viewing.page.pricing.standard_inc1"),
      t("viewing.page.pricing.standard_inc2"),
      t("viewing.page.pricing.standard_inc3"),
    ],
  },
  {
    name: t("viewing.page.pricing.express_name"),
    price: VIEWING_EXPRESS_PRICE,
    badge: t("viewing.page.pricing.express_badge"),
    description: t("viewing.page.pricing.express_description"),
    bestFor: t("viewing.page.pricing.express_best"),
    includes: [
      t("viewing.page.pricing.express_inc1"),
      t("viewing.page.pricing.express_inc2"),
      t("viewing.page.pricing.express_inc3"),
    ],
  },
];

const getViewingPaymentHighlights = (t: Translate) => [
  {
    icon: "calendar-check",
    label: t("viewing.page.payment.standard_label"),
    tooltip: t("viewing.page.payment.standard_tooltip"),
    price: VIEWING_STANDARD_PRICE,
  },
  {
    icon: "flash",
    label: t("viewing.page.payment.express_label"),
    tooltip: t("viewing.page.payment.express_tooltip"),
    price: VIEWING_EXPRESS_PRICE,
  },
];

const getViewingTrustLinks = (t: Translate) => [
  { href: "/about", label: t("viewing.page.links.about"), icon: "fa-building" },
  {
    href: "/contact",
    label: t("viewing.page.links.contact"),
    icon: "fa-envelope",
  },
  {
    href: domakinWhatsAppLink,
    label: t("viewing.page.links.whatsapp"),
    icon: "fa-brands fa-whatsapp",
  },
  { href: "/pricing", label: t("viewing.page.links.pricing"), icon: "fa-tag" },
  {
    href: "/services/room-searching",
    label: t("viewing.page.links.room_search"),
    icon: "fa-magnifying-glass-location",
  },
  {
    href: "/services/add-listing",
    label: t("viewing.page.links.list_room"),
    icon: "fa-house-user",
  },
  {
    href: INSTAGRAM,
    label: t("viewing.page.links.instagram"),
    icon: "fa-brands fa-instagram",
  },
];

const initialViewingQuestionFields = ["", ""];

const getViewingQuestionPlaceholder = (t: Translate, index: number) => {
  const placeholders = [
    t("viewing.page.question_placeholder_1"),
    t("viewing.page.question_placeholder_2"),
    t("viewing.page.question_placeholder_3"),
  ];

  return (
    placeholders[index] ||
    `${t("viewing.page.question_label")} ${index + 1}: ${t(
      "viewing.page.question_placeholder_fallback",
    )}`
  );
};

type ViewingAnswerAccordionProps = {
  eyebrow?: string;
  title: string;
  titleClassName?: string;
  children: React.ReactNode;
  onToggle: (event: React.SyntheticEvent<HTMLDetailsElement>) => void;
};

const ViewingAnswerAccordion = ({
  eyebrow,
  title,
  titleClassName = "h5",
  children,
  onToggle,
}: ViewingAnswerAccordionProps) => (
  <details
    className="viewing-below-section viewing-answer-card viewing-answer-accordion"
    name="viewing-answer-accordion"
    onToggle={onToggle}
    itemScope
    itemProp="mainEntity"
    itemType="https://schema.org/Question"
  >
    <summary className="viewing-answer-accordion-summary">
      <span className="viewing-answer-accordion-heading">
        {/* {eyebrow && (
          <span className="viewing-answer-accordion-eyebrow">{eyebrow}</span>
        )} */}
        <h6 itemProp="name">{title}</h6>
      </span>
      <i
        className="fa-solid fa-chevron-down viewing-answer-accordion-toggle"
        aria-hidden="true"
      ></i>
    </summary>
    <div
      className="viewing-answer-accordion-body"
      itemScope
      itemProp="acceptedAnswer"
      itemType="https://schema.org/Answer"
    >
      <div itemProp="text">{children}</div>
    </div>
  </details>
);

const getViewingJourneySteps = (t: Translate) => [
  {
    image: "/assets/img/bg/listing-header.webp",
    icon: "email-received",
    title: t("viewing.page.journey.step1"),
  },
  {
    image: "/assets/img/properties/property_20/1.jpg",
    icon: "calendar-time",
    title: t("viewing.page.journey.step2"),
  },
  {
    image: "/assets/img/properties/property_10/1.jpeg",
    icon: "camera",
    title: t("viewing.page.journey.step3"),
  },
  {
    image: "/assets/img/properties/property_21/1.jpg",
    icon: "document",
    title: t("viewing.page.journey.step4"),
  },
  {
    image: "/assets/img/properties/property_19/4.jpg",
    icon: "check-bill",
    title: t("viewing.page.journey.step5"),
  },
];

const getViewingInfoText = (t: Translate) => ({
  formIntro: t("viewing.page.info.form_intro"),
  extraQuestions: t("viewing.page.info.extra_questions"),
  location: t("viewing.page.info.location"),
  city: t("viewing.page.info.city"),
  customCity: t("viewing.page.info.custom_city"),
  street: t("viewing.page.info.street"),
  timing: t("viewing.page.info.timing"),
  date: t("viewing.page.info.date"),
  time: t("viewing.page.info.time"),
  applicant: t("viewing.page.info.applicant"),
});

type ViewingAddressParts = {
  postcode: string;
  houseNumber: string;
  streetName: string;
};

type InfoLabelProps = {
  children: React.ReactNode;
  info: string;
};

const InfoLabel = ({ children, info }: InfoLabelProps) => {
  const tooltipId = React.useId();

  return (
    <span className="viewing-info-label">
      <span>{children}</span>
      <span
        className="viewing-info-icon"
        role="button"
        tabIndex={0}
        aria-label={`More information: ${info}`}
        aria-describedby={tooltipId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.focus();
        }}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
        <span className="viewing-info-popover" id={tooltipId} role="tooltip">
          {info}
        </span>
      </span>
    </span>
  );
};

const defaultViewingAddressParts: ViewingAddressParts = {
  postcode: "",
  houseNumber: "",
  streetName: "",
};

const composeViewingAddress = ({
  streetName,
  houseNumber,
  postcode,
}: ViewingAddressParts) => {
  const streetLine = [streetName.trim(), houseNumber.trim()]
    .filter(Boolean)
    .join(" ");

  return [streetLine, postcode.trim()].filter(Boolean).join(", ");
};

const composeViewingNote = (questions: string[], extraQuestions: string) =>
  [...questions, extraQuestions.trim()].filter(Boolean).join("\n");

const ViewingForm = () => {
  const { t } = useTranslation("translations");

  const viewingUseCases = getViewingUseCases(t);
  const viewingDeliverables = getViewingDeliverables(t);
  const viewingQuestionChecklist = getViewingQuestionChecklist(t);
  const viewingAnswerFaqs = getViewingAnswerFaqs(t);
  const viewingNextSteps = getViewingNextSteps(t);
  const viewingPricingOptions = getViewingPricingOptions(t);
  const viewingPaymentHighlights = getViewingPaymentHighlights(t);
  const viewingTrustLinks = getViewingTrustLinks(t);
  const viewingJourneySteps = getViewingJourneySteps(t);
  const VIEWING_INFO_TEXT = getViewingInfoText(t);
  const VIEWING_FORM_INTRO = t("viewing.page.form_intro");
  const VIEWING_OTHER_CITY = t("viewing.page.other_city");
  const VIEWING_OTHER_CITY_DISCLAIMER = t("viewing.page.other_city_disclaimer");
  const VIEWING_CITY_OPTIONS = [
    ...VIEWING_SERVICE_LOCATIONS,
    VIEWING_OTHER_CITY,
  ];

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

  const [addressParts, setAddressParts] = useState<ViewingAddressParts>({
    ...defaultViewingAddressParts,
  });
  const [viewingQuestionFields, setViewingQuestionFields] = useState<string[]>(
    initialViewingQuestionFields,
  );
  const [extraQuestions, setExtraQuestions] = useState("");
  const [citySelectValue, setCitySelectValue] = useState("");
  const [customViewingCity, setCustomViewingCity] = useState("");
  const [canScrollJourneyPrevious, setCanScrollJourneyPrevious] =
    useState(false);
  const [canScrollJourneyNext, setCanScrollJourneyNext] = useState(true);
  const [showStickyReturnCta, setShowStickyReturnCta] = useState(false);
  const journeyGridRef = useRef<HTMLDivElement>(null);

  const isOtherViewingCity = citySelectValue === VIEWING_OTHER_CITY;
  const citySelectDisplayValue =
    citySelectValue ||
    (viewingData.city && !VIEWING_SERVICE_LOCATIONS.includes(viewingData.city)
      ? VIEWING_OTHER_CITY
      : viewingData.city) ||
    "";

  const scrollJourneySteps = (direction: "previous" | "next") => {
    if (direction === "next" && !canScrollJourneyNext) {
      document.getElementById("viewing-request-form-start")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    journeyGridRef.current?.scrollBy({
      left: direction === "next" ? 250 : -250,
      behavior: "smooth",
    });
  };

  const updateJourneyArrowState = () => {
    const grid = journeyGridRef.current;
    if (!grid) return;

    const maxScrollLeft = Math.max(0, grid.scrollWidth - grid.clientWidth);
    setCanScrollJourneyPrevious(grid.scrollLeft > 8);
    setCanScrollJourneyNext(grid.scrollLeft < maxScrollLeft - 8);
  };

  const updateStickyReturnState = () => {
    const belowForm = document.querySelector("[data-viewing-below-form]");
    if (!belowForm) return;

    const rect = belowForm.getBoundingClientRect();
    const shouldShow = rect.top < 140 && rect.bottom > 180;
    setShowStickyReturnCta((current) =>
      current === shouldShow ? current : shouldShow,
    );
  };

  const updateViewingQuestions = (
    questions: string[],
    nextExtraQuestions = extraQuestions,
  ) => {
    setViewingQuestionFields(questions);
    updateViewingData(
      "note",
      "",
      composeViewingNote(questions, nextExtraQuestions),
    );
  };

  const handleQuestionFieldChange = (index: number, value: string) => {
    const nextQuestions = [...viewingQuestionFields];
    nextQuestions[index] = value;

    updateViewingQuestions(nextQuestions);
  };

  const addQuestionField = () => {
    updateViewingQuestions([...viewingQuestionFields, ""]);
  };

  const removeQuestionField = (index: number) => {
    if (viewingQuestionFields.length <= initialViewingQuestionFields.length) {
      return;
    }

    updateViewingQuestions(
      viewingQuestionFields.filter(
        (_, questionIndex) => questionIndex !== index,
      ),
    );
  };

  const handleExtraQuestionsChange = (value: string) => {
    setExtraQuestions(value);
    updateViewingData(
      "note",
      "",
      composeViewingNote(viewingQuestionFields, value),
    );
  };

  const handleViewingFaqToggle = (
    event: React.SyntheticEvent<HTMLDetailsElement>,
  ) => {
    const currentFaq = event.currentTarget;
    if (!currentFaq.open) return;

    currentFaq.parentElement
      ?.querySelectorAll<HTMLDetailsElement>(".viewing-faq-item[open]")
      .forEach((faqItem) => {
        if (faqItem !== currentFaq) {
          faqItem.removeAttribute("open");
        }
      });
  };

  const handleViewingAnswerAccordionToggle = (
    event: React.SyntheticEvent<HTMLDetailsElement>,
  ) => {
    const currentSection = event.currentTarget;
    if (!currentSection.open) return;

    currentSection.parentElement
      ?.querySelectorAll<HTMLDetailsElement>(".viewing-answer-accordion[open]")
      .forEach((section) => {
        if (section !== currentSection) {
          section.removeAttribute("open");
        }
      });
  };

  const handleAddressPartChange = (
    key: keyof ViewingAddressParts,
    value: string,
  ) => {
    const nextAddressParts = {
      ...addressParts,
      [key]: value,
    };

    setAddressParts(nextAddressParts);
    updateViewingData("address", "", composeViewingAddress(nextAddressParts));
  };

  const handleCityChange = (value: string) => {
    setCitySelectValue(value);
    if (value === VIEWING_OTHER_CITY) {
      setCustomViewingCity("");
      updateViewingData("city", "", "");
      return;
    }

    updateViewingData("city", "", value);
  };

  const handleCustomCityChange = (value: string) => {
    setCustomViewingCity(value);
    updateViewingData("city", "", value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    addViewingErrorFields([]);

    // modify time & date format as they will never be changed
    const data = {
      ...viewingData,
      city: isOtherViewingCity ? customViewingCity.trim() : viewingData.city,
      date: viewingData.date
        ? moment(viewingData.date).format("DD-MM-YYYY")
        : viewingData.date,
      time: viewingData.time
        ? viewingData.time.format("HH:mm")
        : viewingData.time,
      address: composeViewingAddress(addressParts) || viewingData.address,
    };

    sendRequest("/viewing/create", "POST", data).then((res) => {
      if (res?.status) {
        resetViewingData();
        setAddressParts({ ...defaultViewingAddressParts });
        setViewingQuestionFields(initialViewingQuestionFields);
        setExtraQuestions("");
        setCitySelectValue("");
        setCustomViewingCity("");

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
    prefillUserInfo(updateViewingData, user, viewingData);
  }, [user]);

  useEffect(() => {
    const grid = journeyGridRef.current;
    if (!grid) return;

    updateJourneyArrowState();
    grid.addEventListener("scroll", updateJourneyArrowState, { passive: true });
    window.addEventListener("resize", updateJourneyArrowState);

    return () => {
      grid.removeEventListener("scroll", updateJourneyArrowState);
      window.removeEventListener("resize", updateJourneyArrowState);
    };
  }, []);

  useEffect(() => {
    updateStickyReturnState();
    window.addEventListener("scroll", updateStickyReturnState, {
      passive: true,
    });
    window.addEventListener("resize", updateStickyReturnState);

    return () => {
      window.removeEventListener("scroll", updateStickyReturnState);
      window.removeEventListener("resize", updateStickyReturnState);
    };
  }, []);

  return (
    <section
      className="viewing-signup-section pt-60 pb-60"
      data-viewing-signup-section
      aria-label={t("viewing.page.section_aria")}
    >
      <span
        id="book-viewing"
        aria-hidden="true"
        style={{ display: "block", scrollMarginTop: "96px" }}
      />
      <div className="container">
        {/* <h5 className="mb-40 text-center" style={{ color: "#ff914d" }}>
          A local agent attends, checks the property and sends you the proof you
          need before you decide.
        </h5> */}
        <div className="mb-40" data-viewing-funnel-steps>
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-20">
            <div>
              <h1 className="h3 mb-0">{t("viewing.page.hero_title")}</h1>
            </div>
            <div className="viewing-hero-summary">
              <div
                className="viewing-payment-strip"
                aria-label={t("viewing.page.payment_terms_aria")}
              >
                {viewingPaymentHighlights.map((item) => (
                  <div className="viewing-payment-item" key={item.label}>
                    <div>
                      <span className="viewing-payment-label-row">
                        <span
                          className="viewing-payment-svg-icon"
                          style={{
                            WebkitMaskImage: `url(/assets/img/icons/${item.icon}.svg)`,
                            maskImage: `url(/assets/img/icons/${item.icon}.svg)`,
                          }}
                          aria-hidden="true"
                        />

                        <small className="viewing-payment-label-text">
                          {item.label}
                        </small>
                      </span>
                      <strong className="viewing-payment-price">
                        {item.price} {t("viewing.page.euros")}
                      </strong>
                      <small>{item.tooltip}</small>
                    </div>
                  </div>
                ))}
                <div className="viewing-payment-note">
                  <i
                    className="fa-solid fa-circle-check"
                    aria-hidden="true"
                  ></i>
                  <span style={{ color: "white" }}>
                    {t("viewing.page.no_charge")}
                  </span>
                </div>
              </div>
              <a
                href="#viewing-request-form-start"
                className="mt-10 btn-thirteen"
              >
                {t("viewing.page.start_request")}
                <i className="fa-solid fa-arrow-down" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <div className="viewing-journey-shell">
            {canScrollJourneyPrevious && (
              <button
                type="button"
                className="viewing-journey-arrow viewing-journey-arrow-prev"
                onClick={() => scrollJourneySteps("previous")}
                aria-label={t("viewing.page.journey_nav.previous")}
              >
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
              </button>
            )}
            <div className="viewing-journey-grid pb-2" ref={journeyGridRef}>
              {viewingJourneySteps.map((step, index) => (
                <div
                  className="viewing-journey-card bg-white border overflow-hidden"
                  key={step.title}
                >
                  <div
                    className="position-relative"
                    style={{ height: 112, backgroundColor: "#f4f4f4" }}
                  >
                    <img
                      src={step.image}
                      alt=""
                      loading={index === 0 ? "eager" : "lazy"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      className="position-absolute d-inline-flex align-items-center justify-content-center rounded-circle bg-white"
                      style={{
                        left: 12,
                        bottom: -18,
                        width: 40,
                        height: 40,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                      aria-hidden="true"
                    >
                      <Image
                        src={`/assets/img/icons/${step.icon}.svg`}
                        alt="step icon"
                        width={30}
                        height={30}
                      />
                    </span>
                  </div>
                  <div className="p-3 pt-4">
                    <p className="small fw-semibold mb-1">
                      {t("viewing.page.journey_nav.step")} {index + 1}
                    </p>
                    <h2
                      className="h6 mb-0"
                      style={{ fontSize: 15, lineHeight: 1.35 }}
                    >
                      {step.title}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="viewing-journey-arrow viewing-journey-arrow-next"
              onClick={() => scrollJourneySteps("next")}
              aria-label={
                canScrollJourneyNext
                  ? t("viewing.page.journey_nav.next")
                  : t("viewing.page.journey_nav.start")
              }
            >
              <i
                className={`fa-solid ${
                  canScrollJourneyNext ? "fa-arrow-right" : "fa-arrow-down"
                }`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>

        <div className="viewing-form-stack">
          <form
            className="form-style-one wow fadeInUp viewing-request-form"
            onSubmit={handleSubmit}
          >
            <div className="row controls">
              <div
                className="col-12 mb-10 viewing-request-form-start"
                id="viewing-request-form-start"
              >
                <h2 className="h4 mb-2">{t("viewing.page.form_heading")}</h2>
                <p className="mb-0">
                  <InfoLabel info={VIEWING_INFO_TEXT.formIntro}>
                    {VIEWING_FORM_INTRO}
                  </InfoLabel>
                </p>
              </div>

              <div className="col-12">
                <div className="input-group-meta form-group mb-25">
                  <div className="viewing-question-fields mb-20">
                    {viewingQuestionFields.map((question, index) => {
                      const questionId = `viewing-question-${index + 1}`;
                      const canRemove =
                        viewingQuestionFields.length >
                        initialViewingQuestionFields.length;

                      return (
                        <div
                          className="viewing-question-field"
                          data-viewing-question-field
                          key={questionId}
                        >
                          <label htmlFor={questionId}>
                            {t("viewing.page.question_label")} {index + 1}
                          </label>
                          <div className="viewing-question-input-row">
                            <Form.Control
                              id={questionId}
                              type="text"
                              placeholder={getViewingQuestionPlaceholder(
                                t,
                                index,
                              )}
                              value={question}
                              onChange={(event) => {
                                handleQuestionFieldChange(
                                  index,
                                  event.target.value,
                                );
                              }}
                              isInvalid={viewingErrorFields.includes("note")}
                            />
                            {canRemove && (
                              <button
                                type="button"
                                className="viewing-question-remove"
                                onClick={() => removeQuestionField(index)}
                                aria-label={`${t("viewing.page.remove_question")} ${index + 1}`}
                              >
                                <i
                                  className="fa-solid fa-xmark"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      className="viewing-add-question"
                      onClick={addQuestionField}
                    >
                      <i className="fa-solid fa-plus" aria-hidden="true"></i>
                      {t("viewing.page.add_question")}
                    </button>
                  </div>

                  <div className="viewing-extra-questions-field">
                    <label
                      className="viewing-extra-questions-label"
                      htmlFor="viewing-extra-questions"
                    >
                      <InfoLabel info={VIEWING_INFO_TEXT.extraQuestions}>
                        {t("viewing.page.extra_questions_label")}
                      </InfoLabel>
                    </label>
                    <Form.Control
                      id="viewing-extra-questions"
                      as="textarea"
                      placeholder={t(
                        "viewing.page.extra_questions_placeholder",
                      )}
                      value={extraQuestions}
                      onChange={(e) => {
                        handleExtraQuestionsChange(e.target.value);
                      }}
                      isInvalid={viewingErrorFields.includes("note")}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <h4 className="col-12 mb-20 mt-10">
                <InfoLabel info={VIEWING_INFO_TEXT.location}>
                  {t("viewing.page.where_heading")}
                </InfoLabel>
              </h4>

              <div className="col-12">
                <div className="input-group-meta form-group mb-25">
                  <label id="viewing-city-label">
                    <InfoLabel info={VIEWING_INFO_TEXT.city}>
                      {t("viewing.page.city_label")}
                    </InfoLabel>
                  </label>
                  <SearchableCitySelect
                    id="viewing-city"
                    aria-labelledby="viewing-city-label"
                    value={citySelectDisplayValue}
                    onChange={handleCityChange}
                    cities={VIEWING_CITY_OPTIONS}
                    placeholder={t("viewing.page.city_placeholder")}
                    isInvalid={viewingErrorFields.includes("city")}
                  />
                  {isOtherViewingCity && (
                    <div className="mt-3">
                      <label htmlFor="viewing-custom-city">
                        <InfoLabel info={VIEWING_INFO_TEXT.customCity}>
                          {t("viewing.page.other_city_label")}
                        </InfoLabel>
                      </label>
                      <Form.Control
                        id="viewing-custom-city"
                        type="text"
                        placeholder={t("viewing.page.other_city_placeholder")}
                        value={customViewingCity}
                        onChange={(e) => {
                          handleCustomCityChange(e.target.value);
                        }}
                        isInvalid={viewingErrorFields.includes("city")}
                      />
                      <small className="d-block mt-2 viewing-other-city-note">
                        {VIEWING_OTHER_CITY_DISCLAIMER}
                      </small>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="input-group-meta form-group mb-25">
                  <label htmlFor="viewing-street-name">
                    <InfoLabel info={VIEWING_INFO_TEXT.street}>
                      {t("viewing.page.street_label")}
                    </InfoLabel>
                  </label>
                  <Form.Control
                    id="viewing-street-name"
                    type="text"
                    value={addressParts.streetName}
                    onChange={(e) => {
                      handleAddressPartChange("streetName", e.target.value);
                    }}
                    isInvalid={viewingErrorFields.includes("address")}
                  />
                </div>
              </div>

              <div className="col-sm-6 col-12">
                <div className="input-group-meta form-group mb-25">
                  <label htmlFor="viewing-postcode">
                    {t("viewing.page.postcode_label")}
                  </label>
                  <Form.Control
                    id="viewing-postcode"
                    type="text"
                    value={addressParts.postcode}
                    onChange={(e) => {
                      handleAddressPartChange("postcode", e.target.value);
                    }}
                    isInvalid={viewingErrorFields.includes("address")}
                  />
                </div>
              </div>

              <div className="col-sm-6 col-12">
                <div className="input-group-meta form-group mb-25">
                  <label htmlFor="viewing-house-number">
                    {t("viewing.page.house_number_label")}
                  </label>
                  <Form.Control
                    id="viewing-house-number"
                    type="text"
                    value={addressParts.houseNumber}
                    onChange={(e) => {
                      handleAddressPartChange("houseNumber", e.target.value);
                    }}
                    isInvalid={viewingErrorFields.includes("address")}
                  />
                </div>
              </div>

              <h4 className="col-12 mb-20 mt-10">
                <InfoLabel info={VIEWING_INFO_TEXT.timing}>
                  When is the viewing?
                </InfoLabel>
              </h4>

              <div className="col-sm-6 col-12">
                <div className="input-group-meta form-group mb-25">
                  <label htmlFor="viewing-date">
                    <InfoLabel info={VIEWING_INFO_TEXT.date}>
                      {t("viewing.page.date_label")}
                    </InfoLabel>
                  </label>
                  <div className="viewing-icon-input">
                    <i
                      className="fa-solid fa-calendar-days"
                      aria-hidden="true"
                    ></i>
                    <SingleDatePicker
                      id="viewing-date"
                      placeholder=""
                      value={viewingData.date}
                      onChange={(value: string) => {
                        updateViewingData("date", "", value);
                      }}
                      isInvalid={viewingErrorFields.includes("date")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-12">
                <div className="input-group-meta form-group mb-25">
                  <label htmlFor="viewing-time">
                    <InfoLabel info={VIEWING_INFO_TEXT.time}>
                      {t("viewing.page.time_label")}
                    </InfoLabel>
                  </label>
                  <div className="viewing-icon-input">
                    <i className="fa-solid fa-clock" aria-hidden="true"></i>
                    <TimePickerInput
                      id="viewing-time"
                      showSecond={false}
                      minuteStep={5}
                      value={viewingData.time}
                      onChange={(value: any) => {
                        updateViewingData("time", "", value);
                      }}
                      isInvalid={viewingErrorFields.includes("time")}
                    />
                  </div>
                  <small>{t("date_time.timezone_nl")}</small>
                </div>
              </div>

              <h4 className="col-12 mb-20 mt-10">
                <InfoLabel info={VIEWING_INFO_TEXT.applicant}>
                  {t("viewing.page.applicant_heading")}
                </InfoLabel>
              </h4>

              {
                <div className="col-12">
                  <div className="input-group-meta form-group mb-30">
                    <label htmlFor="viewing-name">{t("viewing.name")}</label>
                    <Form.Control
                      id="viewing-name"
                      type="text"
                      value={viewingData.name}
                      onChange={(e) => {
                        updateViewingData("name", "", e.target.value);
                      }}
                      isInvalid={viewingErrorFields.includes("name")}
                    />
                  </div>
                </div>
              }

              {
                <div className="col-12">
                  <div className="input-group-meta form-group mb-30">
                    <label htmlFor="viewing-surname">
                      {t("viewing.surname")}
                    </label>
                    <Form.Control
                      id="viewing-surname"
                      type="text"
                      value={viewingData.surname}
                      onChange={(e) => {
                        updateViewingData("surname", "", e.target.value);
                      }}
                      isInvalid={viewingErrorFields.includes("surname")}
                    />
                  </div>
                </div>
              }

              {
                <div className="col-12">
                  <div className="input-group-meta form-group mb-30">
                    <label htmlFor="viewing-phone">{t("viewing.phone")}</label>
                    <PrefixPhoneInput
                      id="viewing-phone"
                      prefixAriaLabel={t("viewing.page.phone_country_aria")}
                      value={viewingData.phone}
                      onChange={(value: string) => {
                        updateViewingData("phone", "", value);
                      }}
                      isInvalid={viewingErrorFields.includes("phone")}
                    />
                  </div>
                </div>
              }

              {
                <div className="col-12">
                  <div className="input-group-meta form-group mb-30">
                    <label htmlFor="viewing-email">{t("viewing.email")}</label>
                    <Form.Control
                      id="viewing-email"
                      type="text"
                      value={viewingData.email}
                      onChange={(e) => {
                        updateViewingData("email", "", e.target.value);
                      }}
                      isInvalid={viewingErrorFields.includes("email")}
                    />
                  </div>
                </div>
              }

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

              <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
                <Form.Check
                  id="viewing-terms-contact"
                  type="checkbox"
                  name="viewingTermsContact"
                  value={viewingData.terms.contact}
                  checked={viewingData.terms.contact}
                  onChange={(e) => {
                    updateViewingData("terms", "contact", e.target.checked);
                  }}
                  isInvalid={viewingErrorFields.includes("terms.contact")}
                />
                <label htmlFor="viewing-terms-contact">
                  {t("legals.permission_contact")}
                </label>
              </div>

              <div className="col-12 mb-20 d-flex gap-3 align-items-center justify-content-start">
                <Form.Check
                  id="viewing-terms-legals"
                  type="checkbox"
                  name="viewingTermsLegals"
                  value={viewingData.terms.legals}
                  checked={viewingData.terms.legals}
                  onChange={(e) => {
                    updateViewingData("terms", "legals", e.target.checked);
                  }}
                  isInvalid={viewingErrorFields.includes("terms.legals")}
                />
                <label htmlFor="viewing-terms-legals">
                  <Trans
                    i18nKey="translations:legals.permission_terms"
                    components={{
                      link: (
                        <a
                          href="/terms&policy"
                          target="_blank"
                          rel="noreferrer"
                        ></a>
                      ),
                    }}
                  />
                </label>
              </div>

              <div className="col-12">
                <button
                  disabled={loading}
                  type="submit"
                  className="btn-nine text-uppercase rounded-3 fw-normal w-100"
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    t("viewing.page.submit")
                  )}
                </button>
              </div>
            </div>
          </form>

          <div
            className="viewing-below-form"
            data-geo-service-answer-block
            data-viewing-below-form
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            <h2 className="viewing-faq-section-title">
              {t("viewing.page.faq_title")}
            </h2>

            <ViewingAnswerAccordion
              eyebrow={t("viewing.page.a_what.eyebrow")}
              title={t("viewing.page.a_what.title")}
              titleClassName="h4"
              onToggle={handleViewingAnswerAccordionToggle}
            >
              <p className="viewing-answer-lead mb-3">
                {t("viewing.page.a_what.body")}
              </p>
              <a href="#book-viewing" className="viewing-inline-cta">
                {t("viewing.page.cta.book")}
              </a>
            </ViewingAnswerAccordion>

            <ViewingAnswerAccordion
              eyebrow={t("viewing.page.a_when.eyebrow")}
              title={t("viewing.page.a_when.title")}
              onToggle={handleViewingAnswerAccordionToggle}
            >
              <p className="mb-3">{t("viewing.page.a_when.body")}</p>
              <div className="d-flex flex-column gap-3">
                {viewingUseCases.map((item) => (
                  <article className="viewing-answer-row" key={item.title}>
                    <span className="viewing-answer-icon" aria-hidden="true">
                      <i className={`fa-solid ${item.icon} color-dark`}></i>
                    </span>
                    <div>
                      <h4 className="small fw-semibold mb-1">{item.title}</h4>
                      <p className="mb-0 small">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </ViewingAnswerAccordion>

            <ViewingAnswerAccordion
              eyebrow={t("viewing.page.a_deliverables.eyebrow")}
              title={t("viewing.page.a_deliverables.title")}
              onToggle={handleViewingAnswerAccordionToggle}
            >
              <p className="mb-3">{t("viewing.page.a_deliverables.body")}</p>
              <div className="d-flex flex-column gap-3 mb-3">
                {viewingDeliverables.map((item) => (
                  <article className="viewing-answer-row" key={item.title}>
                    <span className="viewing-answer-icon" aria-hidden="true">
                      <i className={`fa-solid ${item.icon} color-dark`}></i>
                    </span>
                    <div>
                      <h4 className="small fw-semibold mb-1">{item.title}</h4>
                      <p className="mb-0 small">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="viewing-question-checklist">
                <h4 className="small fw-semibold mb-2">
                  {t("viewing.page.a_deliverables.checklist_title")}
                </h4>
                <ul>
                  {viewingQuestionChecklist.map((question) => (
                    <li key={question}>
                      <i className="fa-solid fa-check" aria-hidden="true"></i>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#book-viewing" className="viewing-inline-cta">
                {t("viewing.page.cta.start")}
              </a>
            </ViewingAnswerAccordion>

            <ViewingAnswerAccordion
              eyebrow={t("viewing.page.a_cities.eyebrow")}
              title={t("viewing.page.a_cities.title")}
              onToggle={handleViewingAnswerAccordionToggle}
            >
              <p className="mb-3">
                {t("viewing.page.a_cities.body_prefix")}{" "}
                {VIEWING_SERVICE_LOCATIONS.join(", ")}.{" "}
                {t("viewing.page.a_cities.body_suffix")}
              </p>
              <div
                className="viewing-service-area-list"
                aria-label={t("viewing.page.a_cities.area_aria")}
              >
                {VIEWING_SERVICE_LOCATIONS.map((city) => (
                  <span key={city}>{city}</span>
                ))}
              </div>
              <a href="#book-viewing" className="viewing-inline-cta mt-3">
                {t("viewing.page.cta.check_city")}
              </a>
            </ViewingAnswerAccordion>

            <ViewingAnswerAccordion
              title={t("viewing.page.a_faq.title")}
              onToggle={handleViewingAnswerAccordionToggle}
            >
              <div
                className="viewing-faq-list"
                itemScope
                itemType="https://schema.org/FAQPage"
              >
                {viewingAnswerFaqs.map((item) => (
                  <details
                    className="viewing-faq-item"
                    key={item.question}
                    name="viewing-faq"
                    onToggle={handleViewingFaqToggle}
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                  >
                    <summary className="viewing-faq-summary">
                      <span itemProp="name">{item.question}</span>
                      <i
                        className="fa-solid fa-chevron-down viewing-faq-toggle"
                        aria-hidden="true"
                      ></i>
                    </summary>
                    <div
                      className="viewing-faq-answer"
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <p className="mb-0 small" itemProp="text">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
              <a href="#book-viewing" className="viewing-inline-cta mt-3">
                {t("viewing.page.cta.request")}
              </a>
            </ViewingAnswerAccordion>

            <ViewingAnswerAccordion
              eyebrow={t("viewing.page.a_pricing.eyebrow")}
              title={t("viewing.page.a_pricing.title")}
              onToggle={handleViewingAnswerAccordionToggle}
            >
              <p className="mb-3">{t("viewing.page.a_pricing.body")}</p>
              <div className="viewing-pricing-grid mb-4">
                {viewingPricingOptions.map((option) => (
                  <article className="viewing-pricing-option" key={option.name}>
                    <div className="viewing-pricing-topline">
                      <p className="fw-semibold mb-0">{option.name}</p>
                      <span>{option.badge}</span>
                    </div>
                    <p className="viewing-pricing-price mb-1">
                      EUR {option.price}
                    </p>
                    <p className="mb-2 small">{option.description}</p>
                    <p className="viewing-pricing-best mb-3">
                      {option.bestFor}
                    </p>
                    <ul className="viewing-pricing-includes">
                      {option.includes.map((includedItem) => (
                        <li key={includedItem}>
                          <i
                            className="fa-solid fa-check"
                            aria-hidden="true"
                          ></i>
                          {includedItem}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <div className="viewing-pricing-next">
                <h4 className="small fw-semibold mb-2">
                  {t("viewing.page.a_pricing.next_title")}
                </h4>
                <ol className="viewing-next-steps mb-0">
                  {viewingNextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <a
                href="/pricing"
                className="viewing-inline-cta mt-3"
                target="_blank"
                rel="noreferrer"
              >
                {t("viewing.page.cta.read_more_pricing")}
              </a>
            </ViewingAnswerAccordion>

            <ViewingAnswerAccordion
              eyebrow={t("viewing.page.a_links.eyebrow")}
              title={t("viewing.page.a_links.title")}
              onToggle={handleViewingAnswerAccordionToggle}
            >
              <div className="viewing-trust-links">
                {viewingTrustLinks.map((link) => {
                  const iconClassName = link.icon.includes("fa-brands")
                    ? link.icon
                    : `fa-solid ${link.icon}`;

                  return (
                    <a
                      href={link.href}
                      key={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className={iconClassName} aria-hidden="true"></i>
                      {link.label}
                    </a>
                  );
                })}
              </div>
              <a href="#book-viewing" className="viewing-inline-cta mt-3">
                {t("viewing.page.cta.back_to_request")}
              </a>
            </ViewingAnswerAccordion>
          </div>
          {showStickyReturnCta && (
            <a href="#book-viewing" className="viewing-sticky-return">
              <span>
                <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
                {t("viewing.page.sticky_return.label")}
              </span>
              <span className="viewing-sticky-return-note">
                {t("viewing.page.sticky_return.note")}
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default observer(ViewingForm);
