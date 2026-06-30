import FooterFour from "@/layouts/footers/FooterFour";
import ScheduledViewingHeader from "@/components/scheduled-viewing/ScheduledViewingHeader";
import { useStore } from "@/stores/storeContext";
import { SERVER_ENDPOINT } from "@/utils/config";
import axios from "axios";
import { observer } from "mobx-react-lite";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import type { IncomingHttpHeaders } from "http";
import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ViewingStatus = "unassigned" | "assigned" | "completed" | "rejected" | "payment_required";

type ViewingView = "unassigned" | "assigned" | "results" | "payment" | "completed" | "rejected";

type ViewingAgent = {
  id: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  code: string | null;
  city?: string | null;
  iban?: string | null;
};

type PublicViewing = {
  token: string;
  reference: string;
  status: ViewingStatus;
  view: ViewingView;
  timezone?: string | null;
  details: {
    name: string | null;
    email: string | null;
    phone: string | null;
    city: string | null;
    address: string | null;
    date: string | null;
    time: string | null;
    note: string | null;
  };
  agent: ViewingAgent | null;
  results?: {
    answers: string | null;
    media: string[];
  } | null;
};

const CONTACT_EMAIL = "info@domakin.nl";

type ViewingApprovalPageProps = {
  viewing: PublicViewing;
};

const apiUrl = (path: string) => `${SERVER_ENDPOINT}${path}`;

const firstHeaderValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

const requestOrigin = (headers: IncomingHttpHeaders) => {
  const host = firstHeaderValue(headers["x-forwarded-host"]) || firstHeaderValue(headers.host);

  if (!host) {
    return process.env.NEXT_PUBLIC_URL || "https://www.domakin.nl";
  }

  const forwardedProto = firstHeaderValue(headers["x-forwarded-proto"]);
  const protocol = forwardedProto || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return `${protocol}://${host}`;
};

const fetchViewing = async (token: string, origin?: string): Promise<PublicViewing | null> => {
  if (!SERVER_ENDPOINT) return null;

  try {
    const response = await axios.get(apiUrl(`/api/v1/viewing/public/${encodeURIComponent(token)}`), {
      headers: origin ? { Origin: origin } : undefined,
      timeout: 15000,
    });

    return response.data?.status && response.data?.data ? response.data.data : null;
  } catch {
    return null;
  }
};

const ViewingShell = ({ children }: { children: ReactNode }) => (
  <div className="viewing-approval-page">
    <Head>
      <meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />
      <meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet" />
    </Head>
    <ScheduledViewingHeader />
    <main>{children}</main>
    <FooterFour />
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string | null }) => {
  if (!value) return null;

  return (
    <div className="viewing-approval-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
};

const ViewingDetails = ({ details }: { details: PublicViewing["details"] }) => (
  <div className="viewing-approval-details">
    <DetailRow label="Client" value={details.name} />
    <DetailRow label="Date" value={details.date} />
    <DetailRow label="Time" value={details.time} />
    <DetailRow label="Address" value={details.address} />
    <DetailRow label="City" value={details.city} />
    <DetailRow label="Questions" value={details.note} />
  </div>
);

const StatusPanel = ({
  icon,
  iconAlt,
  title,
  children,
}: {
  icon: string;
  iconAlt: string;
  title: string;
  children: ReactNode;
}) => (
  <section className="viewing-approval-panel">
    <div className="viewing-approval-panel__title">
      <img
        alt={iconAlt}
        className="viewing-approval-panel__icon"
        src={`/assets/img/icons/3d/${icon}.png`}
      />
      <h2 style={{ color: "#ff914d" }}>{title}</h2>
    </div>
    {children}
  </section>
);

const AgentDetails = ({ agent }: { agent: ViewingAgent }) => (
  <div className="viewing-approval-agent">
    <div>
      <span>Agent</span>
      <strong>{agent.name || "Agent"}</strong>
    </div>
    {agent.email && <p>{agent.email}</p>}
    {agent.phone && <p>{agent.phone}</p>}
    {agent.code && <small>Agent code: {agent.code}</small>}
  </div>
);

const AgentPaymentDetails = ({ agent, reference }: { agent: ViewingAgent | null; reference: string }) => {
  const contactHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(reference)}`;

  return (
    <div className="viewing-approval-agent">
      <div>
        <span>Agent</span>
        <strong>{agent?.name || "Agent"}</strong>
      </div>
      {agent?.email && <p>{agent.email}</p>}
      <div>
        <span>IBAN</span>
        <strong>{agent?.iban || "Not provided"}</strong>
      </div>
      <p className="viewing-approval-copy">Something looks wrong? Let us know.</p>
      <a className="viewing-approval-secondary-button viewing-approval-contact" href={contactHref}>
        Contact us
      </a>
    </div>
  );
};

const InfoTooltip = ({ text }: { text: string }) => (
  <span className="viewing-approval-info" tabIndex={0}>
    <i className="bi bi-info-circle" />
    <span className="viewing-approval-tooltip" role="tooltip">
      {text}
    </span>
  </span>
);

const ActionRequiredButton = ({
  visible,
  onClick,
  label,
}: {
  visible: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    aria-hidden={!visible}
    className="btn-nine viewing-approval-action-required"
    onClick={onClick}
    tabIndex={visible ? 0 : -1}
    type="button"
    style={{
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(24px)",
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
      zIndex: 999,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "7px 20px",
      fontSize: "18px",
      fontWeight: 500,
      borderRadius: "50px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      transition:
        "opacity 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out",
    }}
  >
    {label}
  </button>
);

const ViewingApprovalPage = ({ viewing: initialViewing }: ViewingApprovalPageProps) => {
  const [viewing, setViewing] = useState(initialViewing);
  const [identifier, setIdentifier] = useState("");
  const [agent, setAgent] = useState<ViewingAgent | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "found" | "missing">("idle");
  const [showCustom, setShowCustom] = useState(false);
  const [autoLookupKey, setAutoLookupKey] = useState("");
  const [skipAccountAgent, setSkipAccountAgent] = useState(false);
  const [customAgent, setCustomAgent] = useState({
    name: "",
    email: "",
    phone: "",
    code: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resultsAnswers, setResultsAnswers] = useState("");
  const [resultImages, setResultImages] = useState<File[]>([]);
  const [resultVideos, setResultVideos] = useState<File[]>([]);
  const actionSectionRef = useRef<HTMLDivElement | null>(null);
  const resultPanelRef = useRef<HTMLDivElement | null>(null);
  const missingPanelRef = useRef<HTMLDivElement | null>(null);
  const customPanelRef = useRef<HTMLDivElement | null>(null);
  const [showActionButton, setShowActionButton] = useState(false);
  const {
    userStore: { user, userLoading },
  } = useStore();

  const scrollToAction = useCallback(() => {
    actionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Show the sticky "Action required" button only while the action section is
  // scrolled out of view (unassigned viewings only).
  useEffect(() => {
    if (viewing.status !== "unassigned") {
      setShowActionButton(false);
      return;
    }

    const node = actionSectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowActionButton(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [viewing.status]);

  // Auto-scroll to whichever conditional panel just appeared.
  useEffect(() => {
    const target = showCustom
      ? customPanelRef.current
      : lookupState === "found" && agent
        ? resultPanelRef.current
        : lookupState === "missing"
          ? missingPanelRef.current
          : null;

    if (!target) return;

    const frame = requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [showCustom, lookupState, agent]);

  const canApproveCustom = useMemo(
    () => Boolean(customAgent.name.trim() && customAgent.email.trim() && customAgent.phone.trim()),
    [customAgent],
  );

  const lookupAgentByIdentifier = useCallback(async (value: string) => {
    setError("");
    setAgent(null);
    setShowCustom(false);
    setLookupState("loading");

    try {
      const response = await axios.post(apiUrl(`/api/v1/viewing/public/${encodeURIComponent(viewing.token)}/find-agent`), {
        identifier: value,
      });

      if (response.data?.status && response.data?.data?.agent) {
        setAgent(response.data.data.agent);
        setLookupState("found");
      } else {
        setLookupState("missing");
      }
    } catch {
      setLookupState("missing");
    }
  }, [viewing.token]);

  const lookupAgent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSkipAccountAgent(true);
    await lookupAgentByIdentifier(identifier);
  };

  useEffect(() => {
    const email = user?.email?.trim();
    if (
      viewing.status !== "unassigned" ||
      userLoading ||
      !email ||
      showCustom ||
      skipAccountAgent ||
      autoLookupKey === `${viewing.token}:${email}`
    ) {
      return;
    }

    setIdentifier(email);
    setAutoLookupKey(`${viewing.token}:${email}`);
    lookupAgentByIdentifier(email);
  }, [
    autoLookupKey,
    lookupAgentByIdentifier,
    showCustom,
    skipAccountAgent,
    user?.email,
    userLoading,
    viewing.status,
    viewing.token,
  ]);

  const approveViewing = async () => {
    setError("");
    setSubmitting(true);

    try {
      const response = await axios.post(apiUrl(`/api/v1/viewing/public/${encodeURIComponent(viewing.token)}/approve`), {
        agent_id: agent?.id ?? undefined,
        identifier: agent ? identifier : undefined,
        custom_agent: showCustom ? customAgent : undefined,
      });

      if (response.data?.status && response.data?.data?.viewing) {
        setViewing(response.data.data.viewing);
      } else {
        setError("Could not approve the viewing. Please try again.");
      }
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Could not approve the viewing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmitResults = Boolean(resultsAnswers.trim());

  const submitResults = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("answers", resultsAnswers);
      resultImages.forEach((file) => formData.append("images[]", file));
      resultVideos.forEach((file) => formData.append("videos[]", file));

      const response = await axios.post(
        apiUrl(`/api/v1/viewing/public/${encodeURIComponent(viewing.token)}/results`),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data?.status && response.data?.data?.viewing) {
        setViewing(response.data.data.viewing);
      } else {
        setError("Could not submit the viewing results. Please try again.");
      }
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Could not submit the viewing results. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const useOtherAgent = () => {
    setSkipAccountAgent(true);
    setAgent(null);
    setLookupState("idle");
    setShowCustom(true);
    setError("");
  };

  const viewingTitle = viewing.reference || "Scheduled viewing";

  if (viewing.view === "assigned") {
    return (
      <>
        <Head>
          <title>{viewingTitle} assigned | Domakin</title>
        </Head>
        <ViewingShell>
          <StatusPanel icon="agent" iconAlt="Assigned viewing" title="This viewing is already assigned">
            <ViewingDetails details={viewing.details} />
            <div className="viewing-approval-action-section">
              {viewing.agent && <AgentDetails agent={viewing.agent} />}
            </div>
          </StatusPanel>
        </ViewingShell>
      </>
    );
  }

  if (viewing.view === "payment") {
    return (
      <>
        <Head>
          <title>{viewingTitle} payment | Domakin</title>
        </Head>
        <ViewingShell>
          <StatusPanel icon="payment-card" iconAlt="Payment required" title="Payment details">
            <ViewingDetails details={viewing.details} />
            <div className="viewing-approval-action-section">
              <p className="viewing-approval-copy">
                The viewing is complete. Below are the payout details we have on file for the agent.
              </p>
              <AgentPaymentDetails agent={viewing.agent} reference={viewing.reference} />
            </div>
          </StatusPanel>
        </ViewingShell>
      </>
    );
  }

  if (viewing.view === "results") {
    return (
      <>
        <Head>
          <title>Submit viewing results | Domakin</title>
        </Head>
        <ViewingShell>
          <StatusPanel icon="info-clip" iconAlt="Submit viewing results" title="Share the viewing results">
            <ViewingDetails details={viewing.details} />
            <form className="viewing-approval-action-section viewing-approval-results" onSubmit={submitResults}>
              <div className="viewing-approval-questions">
                <span>Client questions</span>
                <p>{viewing.details.note || "No specific questions were provided."}</p>
              </div>

              <label>
                <span>Your answers</span>
                <textarea
                  onChange={(event) => setResultsAnswers(event.target.value)}
                  placeholder="Answer the client's questions and add any notes from the viewing"
                  required
                  rows={5}
                  value={resultsAnswers}
                />
              </label>

              <label>
                <span>Photos</span>
                <input
                  accept="image/*"
                  multiple
                  onChange={(event) => setResultImages(event.target.files ? Array.from(event.target.files) : [])}
                  type="file"
                />
              </label>

              <label>
                <span>Videos</span>
                <input
                  accept="video/*"
                  multiple
                  onChange={(event) => setResultVideos(event.target.files ? Array.from(event.target.files) : [])}
                  type="file"
                />
              </label>

              <button disabled={!canSubmitResults || submitting} type="submit">
                {submitting ? "Submitting..." : "Submit results"}
              </button>

              {error && <p className="viewing-approval-error">{error}</p>}
            </form>
          </StatusPanel>
        </ViewingShell>
      </>
    );
  }

  if (viewing.view === "completed") {
    return (
      <>
        <Head>
          <title>{viewingTitle} completed | Domakin</title>
        </Head>
        <ViewingShell>
          <StatusPanel icon="success" iconAlt="Completed viewing" title="This viewing has already been completed">
            <ViewingDetails details={viewing.details} />
            <div className="viewing-approval-action-section">
              <p className="viewing-approval-copy">There is nothing else to approve for this viewing.</p>
            </div>
          </StatusPanel>
        </ViewingShell>
      </>
    );
  }

  if (viewing.view === "rejected") {
    return (
      <>
        <Head>
          <title>{viewingTitle} rejected | Domakin</title>
        </Head>
        <ViewingShell>
          <StatusPanel icon="fail" iconAlt="Rejected viewing" title="This viewing has been rejected">
            <ViewingDetails details={viewing.details} />
            <div className="viewing-approval-action-section">
              <p className="viewing-approval-copy">This viewing is no longer open for agent assignment.</p>
            </div>
          </StatusPanel>
        </ViewingShell>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Approve viewing | Domakin</title>
      </Head>
      <ViewingShell>
        <StatusPanel icon="searching" iconAlt="Unassigned viewing" title="Accept this viewing">
          <ViewingDetails details={viewing.details} />

          <div className="viewing-approval-action-section" ref={actionSectionRef}>
            <form className="viewing-approval-form" onSubmit={lookupAgent}>
              <label>
                <span>Email or agent code</span>
                <input
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="agent@email.com or code"
                  required
                  type="text"
                  value={identifier}
                />
              </label>
              <button disabled={lookupState === "loading"} type="submit">
                {lookupState === "loading" ? "Loading..." : "Load agent"}
              </button>
            </form>

            {lookupState === "found" && agent && (
              <div className="viewing-approval-result" ref={resultPanelRef}>
                <AgentDetails agent={agent} />
                <div className="viewing-approval-actions">
                  <button disabled={submitting} onClick={approveViewing} type="button">
                    {submitting ? "Approving..." : "Approve viewing"}
                  </button>
                  {user?.email && (
                    <button className="viewing-approval-secondary-button" onClick={useOtherAgent} type="button">
                      Not me
                    </button>
                  )}
                </div>
              </div>
            )}

            {lookupState === "missing" && !showCustom && (
              <div className="viewing-approval-missing" ref={missingPanelRef}>
                <p>No agent was found for this email or agent code.</p>
                <button onClick={() => setShowCustom(true)} type="button">
                  Custom fill
                </button>
              </div>
            )}

            {showCustom && (
              <div className="viewing-approval-custom" ref={customPanelRef}>
                <label>
                  <span>Agent name</span>
                  <input
                    onChange={(event) => setCustomAgent((current) => ({ ...current, name: event.target.value }))}
                    required
                    value={customAgent.name}
                  />
                </label>
                <label>
                  <span>Agent email</span>
                  <input
                    onChange={(event) => setCustomAgent((current) => ({ ...current, email: event.target.value }))}
                    required
                    type="email"
                    value={customAgent.email}
                  />
                </label>
                <label>
                  <span>Agent phone</span>
                  <input
                    onChange={(event) => setCustomAgent((current) => ({ ...current, phone: event.target.value }))}
                    required
                    value={customAgent.phone}
                  />
                </label>
                <label>
                  <span className="viewing-approval-label-row">
                    Agent code
                    <InfoTooltip text="The agent code is a quick custom reference for the system - keep it simple and unique" />
                  </span>
                  <input
                    onChange={(event) => setCustomAgent((current) => ({ ...current, code: event.target.value }))}
                    value={customAgent.code}
                  />
                </label>
                <button disabled={!canApproveCustom || submitting} onClick={approveViewing} type="button">
                  {submitting ? "Approving..." : "Approve viewing"}
                </button>
              </div>
            )}

            {error && <p className="viewing-approval-error">{error}</p>}
          </div>
        </StatusPanel>
      </ViewingShell>
      <ActionRequiredButton label="Actions" onClick={scrollToAction} visible={showActionButton} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ViewingApprovalPageProps> = async (context) => {
  context.res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");

  const token = String(context.params?.id ?? "");
  const viewing = await fetchViewing(token, requestOrigin(context.req.headers));

  if (!viewing) {
    return { notFound: true };
  }

  return {
    props: {
      viewing,
    },
  };
};

export default observer(ViewingApprovalPage);
