import React, { useEffect, useState } from "react";
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
import moment from "moment";

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
    text: "A practical report with pictures and videos.",
  },
  {
    icon: "fa-house-circle-check",
    text: "The property inspected against the advert and your concerns.",
  },
  {
    icon: "fa-circle-question",
    text: "Get all your questions answered so you can make a decision.",
  },
];

const viewingSuggestedQuestions = [
  "How many tenants is the bathroom shared with?",
  "Is there a storage room?",
  "Do I need to buy kitchen utensils?",
  "How do I apply for the property if I am interested?",
  "How much is the rent and the deposit?",
  "What is the contract length?",
  "Is registration possible?",
  "Is housing allowance possible?",
  "How to apply for the place after the viewing and what is the deadline?",
  "How many people are interested in the place and what are the chances of getting it?",
];

const viewingJourneySteps = [
  {
    image: "/assets/img/bg/listing-header.webp",
    icon: "fa-envelope-open-text",
    title: "You have been invited to a viewing you cannot attend",
  },
  {
    image: "/assets/img/properties/property_20/1.jpg",
    icon: "fa-calendar-check",
    title: "You schedule a viewing",
  },
  {
    image: "/assets/img/properties/property_10/1.jpeg",
    icon: "fa-person-walking-luggage",
    title: "They attend on your behalf, presenting you in your best light",
  },
  {
    image: "/assets/img/properties/property_21/1.jpg",
    icon: "fa-images",
    title: "They send you a report with pictures and videos",
  },
  {
    image: "/assets/img/properties/property_19/4.jpg",
    icon: "fa-circle-check",
    title: "You make your own decision",
  },
];

const VIEWING_OTHER_CITY = "Other";
const VIEWING_OTHER_CITY_DISCLAIMER =
  "We might not be able to fulfill this request, but we are going to contact you to let you know.";

type ViewingAddressParts = {
  postcode: string;
  houseNumber: string;
  streetName: string;
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
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [extraQuestions, setExtraQuestions] = useState("");

  const updateViewingQuestions = (
    questions: string[],
    nextExtraQuestions = extraQuestions,
  ) => {
    setSelectedQuestions(questions);
    updateViewingData("note", "", composeViewingNote(questions, nextExtraQuestions));
  };

  const handleSuggestedQuestionToggle = (question: string) => {
    const nextQuestions = selectedQuestions.includes(question)
      ? selectedQuestions.filter((item) => item !== question)
      : [...selectedQuestions, question];

    updateViewingQuestions(nextQuestions);
  };

  const handleExtraQuestionsChange = (value: string) => {
    setExtraQuestions(value);
    updateViewingData("note", "", composeViewingNote(selectedQuestions, value));
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
      address: composeViewingAddress(addressParts) || viewingData.address,
    };

    sendRequest("/viewing/create", "POST", data).then((res) => {
      if (res?.status) {
        resetViewingData();
        setAddressParts({ ...defaultViewingAddressParts });
        setSelectedQuestions([]);
        setExtraQuestions("");

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
            <p className="mb-0 small" style={{ maxWidth: 360 }}>
              A local agent attends, checks the property and sends you the
              proof you need before you decide.
            </p>
          </div>

          <div className="viewing-journey-grid pb-2">
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
        </div>

        <div className="row gx-xl-5 gy-4 align-items-start">
          <div className="col-lg-5 order-2 order-lg-1">
            <div
              className="p-4 p-xl-5 rounded-3 h-100"
              style={{
                backgroundColor: "#f8f8f8",
                border: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              <h2 className="h4 mb-3">Why send an agent?</h2>
              <p className="mb-4">
                When you cannot be there, we help you inspect the place, ask
                the questions and decide with practical proof.
              </p>

              <div className="mb-4">
                <h3 className="h6 mb-3">Use this when</h3>
                <div className="d-flex flex-column gap-2">
                  {viewingUseCases.map((item) => (
                    <div className="d-flex gap-2" key={item.title}>
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white border flex-shrink-0"
                        style={{ width: 34, height: 34 }}
                      >
                        <i className={`fa-solid ${item.icon} color-dark`}></i>
                      </span>
                      <div>
                        <h4 className="small fw-semibold mb-1">{item.title}</h4>
                        <p className="mb-0 small">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="h6 mb-3">What you get</h3>
                <div className="d-flex flex-column gap-2">
                  {viewingDeliverables.map((item) => (
                    <div className="d-flex gap-2" key={item.text}>
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white border flex-shrink-0"
                        style={{ width: 34, height: 34 }}
                      >
                        <i className={`fa-solid ${item.icon} color-dark`}></i>
                      </span>
                      <p className="mb-0 small">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="col-lg-7 order-1 order-lg-2">
            <form
              className="form-style-one wow fadeInUp"
              onSubmit={handleSubmit}
            >
              <div className="row controls">
                <div className="col-12 mb-25">
                  <p className="fw-semibold text-uppercase small mb-2">
                    Remote viewing request
                  </p>
                  <h2 className="h4 mb-2">
                    You have been invited to a viewing
                  </h2>
                  <p className="mb-0">
                    What would you like to know about the place? Tell us what
                    to check, where to go and who the viewing is for.
                  </p>
                  <div className="d-none d-md-flex flex-wrap gap-3 mt-3">
                    <span className="d-inline-flex align-items-center gap-2 small fw-semibold">
                      <i className="fa-solid fa-person-walking"></i>
                      Agent attends for you
                    </span>
                    <span className="d-inline-flex align-items-center gap-2 small fw-semibold">
                      <i className="fa-solid fa-camera"></i>
                      Photos, video and question checks
                    </span>
                    <span className="d-inline-flex align-items-center gap-2 small fw-semibold">
                      <i className="fa-solid fa-clipboard-check"></i>
                      Report with pictures and videos
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="input-group-meta form-group mb-35">
                    <label>
                      Questions you want our agent to ask on your behalf
                    </label>
                    <p className="small mb-3">
                      Select the question chips below, then add anything
                      specific in the extra field.
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-25">
                      {viewingSuggestedQuestions.map((question) => {
                        const isSelected = selectedQuestions.includes(question);

                        return (
                          <button
                            className={`viewing-question-chip ${
                              isSelected ? "selected" : ""
                            }`}
                            key={question}
                            type="button"
                            onClick={() => handleSuggestedQuestionToggle(question)}
                            aria-pressed={isSelected}
                          >
                            <i
                              className={`fa-solid ${
                                isSelected ? "fa-check" : "fa-plus"
                              }`}
                              aria-hidden="true"
                            ></i>
                            {question}
                          </button>
                        );
                      })}
                    </div>

                    <label htmlFor="viewing-extra-questions">
                      Extra questions or notes
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
                      rows={4}
                      style={{
                        fontFamily: "inherit",
                        lineHeight: "1.5",
                        resize: "vertical",
                        minHeight: "110px",
                      }}
                    />
                  </div>
                </div>

        <h4 className="col-12 mb-20 mt-10">Where is the place?</h4>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-25">
            <label htmlFor="">City of viewing</label>
            <SearchableCitySelect
              value={viewingData.city}
              onChange={(value) => {
                updateViewingData("city", "", value);
              }}
              cities={[...VIEWING_SERVICE_LOCATIONS, VIEWING_OTHER_CITY]}
              placeholder="Choose city or Other"
              isInvalid={viewingErrorFields.includes("city")}
            />
            <small className="d-block mt-2">
              Choose a supported city from the list, or choose Other if your
              city is missing.
              <br />
              {`${VIEWING_OTHER_CITY_DISCLAIMER} You can also contact us at `}
              <a href="mailto:info@domakin.nl">info@domakin.nl</a>.
            </small>
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-25">
            <label htmlFor="viewing-street-name">Street name</label>
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

        <div className="col-lg-3 col-md-6 col-6">
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

        <div className="col-lg-3 col-md-6 col-6">
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

        <h4 className="col-12 mb-20 mt-10">When is the viewing?</h4>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-25">
            <label htmlFor="">Date of the viewing</label>
            <div className="viewing-icon-input">
              <i className="fa-solid fa-calendar-days" aria-hidden="true"></i>
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
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="input-group-meta form-group mb-25">
            <label htmlFor="">Time of the viewing</label>
            <div className="viewing-icon-input">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
              <TimePickerInput
                showSecond={false}
                minuteStep={15}
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

        <h4 className="col-12 mb-20 mt-10">Who is this viewing for?</h4>

        {
          <div className="col-lg-6 col-md-6 col-12">
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
        }

        {
          <div className="col-lg-6 col-md-6 col-12">
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
        }

        {
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
        }

        {
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default observer(ViewingForm);
