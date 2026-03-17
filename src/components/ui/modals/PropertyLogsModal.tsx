"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Image from "next/image";
import { useStore } from "@/stores/storeContext";
import { useServer } from "@/hooks/useServer";
import { observer } from "mobx-react-lite";
import { PROPERTY_LOGS_MODAL } from "@/utils/defines";
import { showGeneralError } from "@/utils/helpers";
import moment from "moment";
import domakinLogo from "@/assets/img/logo-2.png";

interface Modification {
  id: string;
  userId: string | null;
  userName?: string | null;
  userProfileImage?: string | null;
  timestamp: string;
  content: string;
}

const getInitials = (name?: string | null, userId?: string | null): string => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (userId) return userId.slice(0, 2).toUpperCase();
  return "?";
};

const PropertyLogsModal = () => {
  const { modalStore, userStore } = useStore();
  const { sendRequest } = useServer();

  const currentUserId = userStore.user?.id;
  const propertyId = modalStore.modalSettings?.propertyId as number | undefined;

  const [logs, setLogs] = useState<Modification[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [adding, setAdding] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const isOpen = modalStore.modals[PROPERTY_LOGS_MODAL];

  const fetchLogs = useCallback(async () => {
    if (!propertyId) return;
    setFetchLoading(true);
    try {
      const response = await sendRequest(`/property/modifications/${propertyId}`);
      setLogs(response?.status && Array.isArray(response.data) ? response.data : []);
    } catch {
      setLogs([]);
    } finally {
      setFetchLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchLogs();
      setNewContent("");
    }
  }, [isOpen, propertyId, fetchLogs]);

  useEffect(() => {
    if (logs.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleClose = () => {
    modalStore.closeAll();
    setLogs([]);
    setNewContent("");
  };

  const handleAdd = async () => {
    const trimmed = newContent.trim();
    if (!trimmed || !propertyId) return;

    setAdding(true);
    setNewContent("");
    try {
      const response = await sendRequest(
        "/property/modifications/add",
        "POST",
        { propertyId, content: trimmed },
        {},
        { withLoading: false }
      );
      if (response?.status) {
        await fetchLogs();
      } else {
        setNewContent(trimmed);
        showGeneralError(response?.message ?? "Failed to add log.");
      }
    } catch {
      setNewContent(trimmed);
      showGeneralError("Failed to add log.");
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Property #{propertyId} — Logs</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "60vh",
        }}
      >
        {/* Chat messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {fetchLoading ? (
            <>
              <style>{`
                @keyframes log-skeleton-pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.4; }
                }
                .log-skeleton {
                  background: #e0e0e0;
                  animation: log-skeleton-pulse 1.4s ease-in-out infinite;
                }
              `}</style>
              {([
                { w: 60, right: false },
                { w: 75, right: true },
                { w: 45, right: false },
                { w: 80, right: true },
                { w: 55, right: false },
                { w: 65, right: true },
                { w: 40, right: false },
              ] as { w: number; right: boolean }[]).map(({ w, right }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    flexDirection: right ? "row-reverse" : "row",
                    gap: 8,
                  }}
                >
                  <div
                    className="log-skeleton"
                    style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, animationDelay: `${i * 0.1}s` }}
                  />
                  <div style={{ width: `${w}%` }}>
                    <div
                      className="log-skeleton"
                      style={{
                        height: 42,
                        borderRadius: right ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                    <div
                      className="log-skeleton"
                      style={{
                        height: 10,
                        width: 80,
                        borderRadius: 4,
                        marginTop: 5,
                        marginLeft: right ? "auto" : 0,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </>
          ) : logs.length === 0 ? (
            <p className="text-muted text-center mt-4">Nothing here — be the first to add a message.</p>
          ) : (
            logs.map((log) => {
              const isOwn = log.userId === currentUserId;
              const displayName =
                log.userName ||
                (log.userId ? `User ${log.userId.slice(0, 8)}…` : "System");
              const initials = getInitials(log.userName, log.userId);

              return (
                <div
                  key={log.id}
                  className="d-flex align-items-end flex-row-reverse gap-2"
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#004aad",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {!log.userId ? (
                      <Image
                        src={domakinLogo}
                        alt="System"
                        width={36}
                        height={36}
                        style={{ objectFit: "cover" }}
                      />
                    ) : log.userProfileImage ? (
                      <img
                        src={log.userProfileImage}
                        alt={displayName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Bubble */}
                  <div style={{ maxWidth: "70%", minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#888",
                        marginBottom: 3,
                        textAlign: "right",
                      }}
                    >
                      {isOwn ? "You" : displayName}
                    </div>
                    <div
                      style={{
                        background: isOwn ? "#004aad" : "#f1f1f1",
                        color: isOwn ? "#fff" : "#000",
                        borderRadius: "18px 18px 4px 18px",
                        padding: "10px 14px",
                        wordBreak: "break-word",
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {log.content}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#aaa",
                        marginTop: 3,
                        textAlign: "right",
                      }}
                    >
                      {moment(log.timestamp).format("DD MMM YYYY, HH:mm")}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Chat input area */}
        <div
          style={{
            borderTop: "1px solid #eee",
            padding: "12px 16px",
            display: "flex",
            gap: "10px",
            alignItems: "flex-end",
          }}
        >
          <textarea
            className="form-control"
            rows={2}
            placeholder="Type a note"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={adding}
            style={{ resize: "none", fontSize: 14 }}
          />
          <button
            className="btn btn-nine"
            onClick={handleAdd}
            disabled={adding || !newContent.trim()}
            style={{
              flexShrink: 0,
              height: 24,
              width: '50px',
              minWidth: '50px',
              margin: 'auto',
              padding: 0,
              borderRadius: 12,
            }}
          >
            {adding ? (
              <Spinner as="span" animation="border" size="sm" role="status" />
            ) : (
              <i className="fas fa-paper-plane" />
            )}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default observer(PropertyLogsModal);
