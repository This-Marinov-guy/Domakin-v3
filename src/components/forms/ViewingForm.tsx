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

const domakinWhatsAppLink = `https://wa.me/${PHONE_NUMBER.replace(/\D/g, "")}`;

const viewingUseCases = [
  {
    icon: "fa-plane-departure",
    title: "Invited but abroad",
    text: "Use this when you get invited for a viewing but cannot attend because you are abroad.",
  },
  {
    icon: "fa-shield-halved",
    title: "Scam and condition check",
    text: "Use it when you think the listing may be a scam or want to know if the place is in good condition as advertised.",
  },
  {
    icon: "fa-ranking-star",
    title: "Move faster in lotteries",
    text: "You can increase your chances during a housing lottery by deciding quickly after the viewing.",
  },
  {
    icon: "fa-clock",
    title: "Avoid wasted trips",
    text: "You can save time and money traveling when you need a trusted local check first.",
  },
];

const viewingDeliverables = [
  {
    icon: "fa-clipboard-check",
    title: "Viewing report",
    text: "You receive a practical report with the agent's notes, pictures and videos from the property.",
  },
  {
    icon: "fa-house-circle-check",
    title: "Property check",
    text: "The agent checks the condition of the room, studio or apartment against the advert and your concerns.",
  },
  {
    icon: "fa-circle-question",
    title: "Questions answered",
    text: "Your agent asks the questions you select in the form, so you can get all your questions answered in the report.",
  },
];

const viewingQuestionChecklist = [
  "How much is the rent and the deposit?",
  "What is the contract length?",
  "Is registration possible?",
  "Is housing allowance possible?",
  "How many tenants is the bathroom shared with?",
  "Is there a storage room?",
  "Do I need to buy kitchen utensils?",
  "How do I apply for the property if I am interested?",
  "How to apply for the place after the viewing and what is the deadline?",
  "How many people are interested in the place and what are the chances of getting it?",
];

const viewingAnswerFaqs = [
  {
    question: "What is a remote viewing?",
    answer:
      "A remote viewing is an in-person rental viewing attended by a local Domakin agent on your behalf. The agent inspects the property, asks your questions, records photos and videos, then sends you a report so you can decide from abroad or from another city.",
  },
  {
    question: "When should I book an online viewing?",
    answer:
      "Book an online viewing when you are invited to a viewing but cannot attend, when you want a scam or condition check, or when you need to decide quickly in a competitive housing process.",
  },
  {
    question: "Does a remote viewing improve my chances?",
    answer:
      "A remote viewing can improve your chances by helping you respond faster after a housing lottery or invitation, ask the right questions and avoid wasting time on unsuitable or suspicious listings.",
  },
  {
    question: "What happens after the viewing?",
    answer:
      "After the viewing, you receive the report with pictures, videos, answers and practical notes. You then decide yourself whether to apply, continue negotiating or walk away.",
  },
];

const viewingNextSteps = [
  "Send the viewing address, scheduled time and questions you want answered.",
  "Use the photos, video and notes to decide whether to proceed.",
  "Check rent, deposit, service costs and house rules against the written documents before paying.",
];

const viewingPricingOptions = [
  {
    name: "Standard remote viewing",
    price: VIEWING_STANDARD_PRICE,
    badge: "Planned viewing",
    description:
      "For viewings scheduled in advance when there is enough time to match an agent.",
    bestFor: "Best when your viewing is not urgent.",
    includes: [
      "Agent attends the viewing on your behalf",
      "Your selected questions are asked",
      "Photos, videos and a written report",
    ],
  },
  {
    name: "Express remote viewing",
    price: VIEWING_EXPRESS_PRICE,
    badge: "Urgent request",
    description:
      "For urgent viewings within 24 hours when a Domakin agent is available.",
    bestFor: "Best when the landlord gave you a short deadline.",
    includes: [
      "Priority agent check for short-notice availability",
      "Agent attends, asks your questions and checks condition",
      "Photos, videos and a written report",
    ],
  },
];

const viewingPaymentHighlights = [
  {
    icon: "fa-calendar-check",
    label: "Standard",
    price: VIEWING_STANDARD_PRICE,
    note: "Planned viewing",
  },
  {
    icon: "fa-bolt",
    label: "Express",
    price: VIEWING_EXPRESS_PRICE,
    note: "Urgent request",
  },
];

const viewingTrustLinks = [
  {
    href: "/about",
    label: "About Domakin",
    icon: "fa-building",
  },
  {
    href: "/contact",
    label: "Contact us",
    icon: "fa-envelope",
  },
  {
    href: domakinWhatsAppLink,
    label: "WhatsApp",
    icon: "fa-brands fa-whatsapp",
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: "fa-tag",
  },
  {
    href: "/services/room-searching",
    label: "Room search service",
    icon: "fa-magnifying-glass-location",
  },
  {
    href: "/services/add-listing",
    label: "List a room",
    icon: "fa-house-user",
  },
  {
    href: INSTAGRAM,
    label: "Instagram",
    icon: "fa-brands fa-instagram",
  },
];

const initialViewingQuestionFields = ["", ""];
const viewingQuestionFieldPlaceholders = [
  "Question 1 suggestion: Is registration possible?",
  "Question 2 suggestion: How much is the rent and deposit?",
  "Question 3 suggestion: How do I apply?",
];

const getViewingQuestionPlaceholder = (index: number) =>
  viewingQuestionFieldPlaceholders[index] ||
  `Question ${index + 1}: Add anything else the agent should ask`;

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
        {eyebrow && (
          <span className="viewing-answer-accordion-eyebrow">{eyebrow}</span>
        )}
        <h3
          className={`viewing-answer-accordion-title ${titleClassName}`}
          itemProp="name"
        >
          {title}
        </h3>
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

const viewingJourneySteps = [
  {
    image: "/assets/img/bg/listing-header.webp",
    icon: "fa-envelope-open-text",
    title: "You have been invited to a viewing you cannot attend",
  },
  {
    image: "/assets/img/properties/property_20/1.jpg",
    icon: "fa-calendar-check",
    title:
      "Schedule a viewing and tell us everything you want to know about the place",
  },
  {
    image: "/assets/img/properties/property_10/1.jpeg",
    icon: "fa-person-walking-luggage",
    title:
      "We attend on your behalf and create a report with pictures and videos",
  },
  {
    image: "/assets/img/properties/property_21/1.jpg",
    icon: "fa-images",
    title: "We send you the report",
  },
  {
    image: "/assets/img/properties/property_19/4.jpg",
    icon: "fa-circle-check",
    title: "You make your own decision",
  },
];

const VIEWING_OTHER_CITY = "Other";
const VIEWING_OTHER_CITY_DISCLAIMER =
  "We will contact you about this location, but we might not be able to fulfill the viewing.";
const VIEWING_FORM_INTRO =
  "Tell us what to check, where to go and who the viewing is for.";
const VIEWING_INFO_TEXT = {
  formIntro:
    "Add the exact questions you want the agent to ask. Start with the suggested placeholders or write your own.",
  extraQuestions:
    "Use this for broader context, scam concerns, furniture details, documents you need checked or exact photos you want.",
  location:
    "Add the exact viewing location from your invitation so the agent can confirm the right property and arrive prepared.",
  city:
    "Choose one of the supported cities. If your city is missing, choose Other and type the location so we can check whether an agent is available.",
  customCity:
    "Type the city, village or nearby area. We will contact you if we cannot cover that location.",
  street:
    "Use the street name from the invitation or listing so the agent can match the viewing correctly.",
  timing:
    "Use the viewing date and Netherlands local time shown in your invitation, so we book the agent for the correct slot.",
  date: "Select the date from the viewing invitation.",
  time: "Use the viewing time in Europe/Amsterdam time.",
  applicant:
    "These details tell us who the viewing is for, how to contact you and where to send the report with photos and videos.",
};
const VIEWING_CITY_OPTIONS = [...VIEWING_SERVICE_LOCATIONS, VIEWING_OTHER_CITY];

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
    updateViewingData("note", "", composeViewingNote(questions, nextExtraQuestions));
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
      viewingQuestionFields.filter((_, questionIndex) => questionIndex !== index),
    );
  };

  const handleExtraQuestionsChange = (value: string) => {
    setExtraQuestions(value);
    updateViewingData("note", "", composeViewingNote(viewingQuestionFields, value));
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
      aria-label="Book a remote viewing"
    >
      <span
        id="book-viewing"
        aria-hidden="true"
        style={{ display: "block", scrollMarginTop: "96px" }}
      />
      <div className="container">
        <div className="mb-40" data-viewing-funnel-steps>
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-20">
            <div>
              <p className="fw-semibold text-uppercase small mb-2">
                How remote viewing works
              </p>
              <h1 className="h3 mb-0">Book a remote viewing</h1>
            </div>
            <div className="viewing-hero-summary">
              <p className="mb-0 small">
                A local agent attends, checks the property and sends you the
                proof you need before you decide.
              </p>
              <div
                className="viewing-payment-strip"
                aria-label="Viewing payment terms"
              >
                {viewingPaymentHighlights.map((item) => (
                  <div className="viewing-payment-item" key={item.label}>
                    <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                    <div>
                      <span>{item.label}</span>
                      <strong>{item.price} euros</strong>
                      <small>{item.note}</small>
                    </div>
                  </div>
                ))}
                <div className="viewing-payment-note">
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                  <span>No charge unless we successfully attend.</span>
                </div>
              </div>
              <a href="#viewing-request-form-start" className="viewing-start-cta">
                Start request
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
                aria-label="Previous remote viewing step"
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
                      <i className={`fa-solid ${step.icon} color-dark`}></i>
                    </span>
                  </div>
                  <div className="p-3 pt-4">
                    <p className="small fw-semibold mb-1">Step {index + 1}</p>
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
                  ? "Next remote viewing step"
                  : "Start remote viewing request"
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
                  <p className="fw-semibold text-uppercase small mb-2">
                    Remote viewing request
                  </p>
                  <h2 className="h4 mb-2">
                    You have been invited to a viewing
                  </h2>
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
                              Question {index + 1}
                            </label>
                            <div className="viewing-question-input-row">
                              <Form.Control
                                id={questionId}
                                type="text"
                                placeholder={getViewingQuestionPlaceholder(index)}
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
                                  aria-label={`Remove question ${index + 1}`}
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
                        Add another question
                      </button>
                    </div>

                    <div className="viewing-extra-questions-field">
                      <label
                        className="viewing-extra-questions-label"
                        htmlFor="viewing-extra-questions"
                      >
                        <InfoLabel info={VIEWING_INFO_TEXT.extraQuestions}>
                          Extra questions or notes
                        </InfoLabel>
                      </label>
                      <Form.Control
                        id="viewing-extra-questions"
                        as="textarea"
                        placeholder="Anything specific you want us to check, ask, photograph or mention during the viewing."
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
            Where is the place?
          </InfoLabel>
        </h4>

        <div className="col-12">
          <div className="input-group-meta form-group mb-25">
            <label id="viewing-city-label">
              <InfoLabel info={VIEWING_INFO_TEXT.city}>
                City of viewing
              </InfoLabel>
            </label>
            <SearchableCitySelect
              id="viewing-city"
              aria-labelledby="viewing-city-label"
              value={citySelectDisplayValue}
              onChange={handleCityChange}
              cities={VIEWING_CITY_OPTIONS}
              placeholder="Choose city or Other"
              isInvalid={viewingErrorFields.includes("city")}
            />
            {isOtherViewingCity && (
              <div className="mt-3">
                <label htmlFor="viewing-custom-city">
                  <InfoLabel info={VIEWING_INFO_TEXT.customCity}>
                    City or location
                  </InfoLabel>
                </label>
                <Form.Control
                  id="viewing-custom-city"
                  type="text"
                  placeholder="Type the city or nearby location"
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
                Street name
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
            <label htmlFor="viewing-postcode">Postcode</label>
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
            <label htmlFor="viewing-house-number">House number</label>
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
                Date of the viewing
              </InfoLabel>
            </label>
            <div className="viewing-icon-input">
              <i className="fa-solid fa-calendar-days" aria-hidden="true"></i>
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
                Time of the viewing
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
            Who is this viewing for?
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
              <label htmlFor="viewing-surname">{t("viewing.surname")}</label>
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
                prefixAriaLabel="Phone country code"
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
            className="btn-nine text-uppercase rounded-3 fw-normal w-100"
          >
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Request remote viewing"
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
              <h2 className="viewing-faq-section-title">FAQ</h2>

              <ViewingAnswerAccordion
                eyebrow="Remote viewing answer"
                title="What is a remote viewing service in the Netherlands?"
                titleClassName="h4"
                onToggle={handleViewingAnswerAccordionToggle}
              >
                <p className="viewing-answer-lead mb-3">
                  A remote viewing, online viewing or virtual viewing service
                  lets a local Domakin agent attend a rental viewing for you in
                  the Netherlands. The agent checks the property, asks your
                  questions, takes pictures and videos, and sends you a report
                  so you can make a decision. It is built for people
                  searching for viewing Netherlands, remote viewing Netherlands
                  or online viewing Netherlands support.
                </p>
                <a href="#book-viewing" className="viewing-inline-cta">
                  Book your remote viewing
                </a>
              </ViewingAnswerAccordion>

              <ViewingAnswerAccordion
                eyebrow="Remote viewing use cases"
                title="When should you book a remote or online viewing?"
                onToggle={handleViewingAnswerAccordionToggle}
              >
                <p className="mb-3">
                  Book a remote viewing in the Netherlands when you are invited
                  to a rental viewing but cannot attend, need a scam check, or
                  want practical property feedback before applying.
                </p>
                <div className="d-flex flex-column gap-3">
                  {viewingUseCases.map((item) => (
                    <article className="viewing-answer-row" key={item.title}>
                      <span
                        className="viewing-answer-icon"
                        aria-hidden="true"
                      >
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
                eyebrow="Remote viewing deliverables"
                title="What do you get after a Domakin remote viewing?"
                onToggle={handleViewingAnswerAccordionToggle}
              >
                <p className="mb-3">
                  After a Domakin online viewing, you get the information a
                  renter needs to compare the listing, decide faster and avoid
                  unnecessary travel.
                </p>
                <div className="d-flex flex-column gap-3 mb-3">
                  {viewingDeliverables.map((item) => (
                    <article className="viewing-answer-row" key={item.title}>
                      <span
                        className="viewing-answer-icon"
                        aria-hidden="true"
                      >
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
                    Common questions your agent can ask
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
                  Start the request
                </a>
              </ViewingAnswerAccordion>

              <ViewingAnswerAccordion
                eyebrow="Viewing Netherlands cities"
                title="Supported viewing cities for remote viewing in the Netherlands"
                onToggle={handleViewingAnswerAccordionToggle}
              >
                <p className="mb-3">
                  Domakin offers remote viewings and online viewings in{" "}
                  {VIEWING_SERVICE_LOCATIONS.join(", ")}. If your city is not in
                  the list, choose Other in the form and type the location; we
                  will contact you and let you know if an agent can cover it.
                </p>
                <div
                  className="viewing-service-area-list"
                  aria-label="Remote viewing service cities"
                >
                  {VIEWING_SERVICE_LOCATIONS.map((city) => (
                    <span key={city}>{city}</span>
                  ))}
                </div>
                <a href="#book-viewing" className="viewing-inline-cta mt-3">
                  Check your viewing city
                </a>
              </ViewingAnswerAccordion>

              <ViewingAnswerAccordion
                title="Remote viewing FAQ"
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
                  Request a remote viewing
                </a>
              </ViewingAnswerAccordion>

              <ViewingAnswerAccordion
                eyebrow="Remote viewing pricing"
                title="What does a remote viewing cost in the Netherlands?"
                onToggle={handleViewingAnswerAccordionToggle}
              >
                <p className="mb-3">
                  Choose the option based on how soon the viewing is scheduled.
                  Both remote viewing prices include an agent attending the
                  rental viewing, asking your questions, checking the property
                  condition and sending a report with pictures and videos.
                </p>
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
                            <i className="fa-solid fa-check" aria-hidden="true"></i>
                            {includedItem}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
                <div className="viewing-pricing-next">
                  <h4 className="small fw-semibold mb-2">
                    What happens after you request a viewing?
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
                  Read more about pricing
                </a>
              </ViewingAnswerAccordion>

              <ViewingAnswerAccordion
                eyebrow="Domakin information"
                title="Where can you find Domakin company links?"
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
                  Go back to the viewing request
                </a>
              </ViewingAnswerAccordion>
            </div>
            {showStickyReturnCta && (
              <a href="#book-viewing" className="viewing-sticky-return">
                <span>
                  <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
                  Back to remote viewing request
                </span>
                <span className="viewing-sticky-return-note">
                  Continue booking
                </span>
              </a>
            )}
          </div>
      </div>
    </section>
  );
};

export default observer(ViewingForm);
