import React, { useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useServer } from "@/hooks/useServer";
import useTranslation from "next-translate/useTranslation";
import { toast, ToastContent } from "react-toastify";

function isFirstOfMonthInFuture(month: number, year: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(year, month - 1, 1);
    return selected > today;
}

interface ReminderFormModalProps {
    show: boolean;
    onHide: () => void;
}

export default function ReminderFormModal({ show, onHide }: ReminderFormModalProps) {
    const { t } = useTranslation("translations");
    const { sendRequest, loading } = useServer();
    const months = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) => {
                const value = i + 1;
                const key = String(value).padStart(2, "0");
                return { value, label: t(`date_time.${key}`) };
            }),
        [t]
    );

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [email, setEmail] = useState("");
    const [month, setMonth] = useState<number>(() => {
        const n = new Date().getMonth() + 2; // next month 1-based (2-13)
        return n > 12 ? 1 : n;
    });
    const [year, setYear] = useState<number>(() => {
        const now = new Date();
        const n = now.getMonth() + 2;
        return n > 12 ? now.getFullYear() + 1 : now.getFullYear();
    });
    const [dateError, setDateError] = useState<string | null>(null);
    const [invalidFields, setInvalidFields] = useState<Record<string, string>>({});

    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4];

    const normalizeInvalidFields = (raw: unknown): Record<string, string> => {
        if (Array.isArray(raw)) {
            return (raw as string[]).reduce((acc, key) => ({ ...acc, [key]: t("api.fill_fields") || "Invalid" }), {});
        }
        if (raw && typeof raw === "object" && !Array.isArray(raw)) {
            return raw as Record<string, string>;
        }
        return {};
    };

    const clearFieldError = (field: string) => {
        setInvalidFields((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleSubmit = async () => {
        setDateError(null);
        setInvalidFields({});

        if (!isFirstOfMonthInFuture(month, year)) {
            setDateError(t("list_room_steps.reminder.future_date_error"));
            return;
        }

        const date = `${year}-${String(month).padStart(2, "0")}-01`;
        const payload = {
            email: email.trim(),
            date,
            metadata: {
                city: city.trim(),
                name: name.trim(),
            },
        };

        const response = await sendRequest("/reminder/listing", "POST", payload, {}, { withLoading: true, withError: true });

        if (response?.status) {
            toast.success(
                (t("list_room_steps.reminder.success_toast") || "Reminder set successfully.") as unknown as ToastContent<unknown>
            );
            setName("");
            setCity("");
            setEmail("");
            const now = new Date();
            const nextM = now.getMonth() + 2;
            setMonth(nextM > 12 ? 1 : nextM);
            setYear(nextM > 12 ? now.getFullYear() + 1 : now.getFullYear());
            setDateError(null);
            setInvalidFields({});
            onHide();
        } else if (response?.invalid_fields) {
            setInvalidFields(normalizeInvalidFields(response.invalid_fields));
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className="blue-modal">
            <Modal.Header closeButton>
                <h5 className="text-white">{t("list_room_steps.reminder.title")}</h5>
            </Modal.Header>
            <Modal.Body>
                <div className="">
                    <div className="list-room-modal__first-step__body d-flex flex-column mt-20">
                        <div className="form-group mb-2">
                            <Form.Control
                                type="text"
                                placeholder={t("emergency_housing.name")}
                                className="py-2"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    clearFieldError("name");
                                }}
                                isInvalid={!!invalidFields.name}
                            />
                            <Form.Control.Feedback type="invalid">{invalidFields.name}</Form.Control.Feedback>
                        </div>

                        <div className="form-group mb-2">
                            <Form.Control
                                type="text"
                                placeholder={t("emergency_housing.city")}
                                className="py-2"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    clearFieldError("city");
                                }}
                                isInvalid={!!invalidFields.city}
                            />
                            <Form.Control.Feedback type="invalid">{invalidFields.city}</Form.Control.Feedback>
                        </div>

                        <div className="form-group mb-2">
                            <Form.Control
                                type="email"
                                placeholder={t("emergency_housing.email")}
                                className="py-2"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearFieldError("email");
                                }}
                                isInvalid={!!invalidFields.email}
                            />
                            <Form.Control.Feedback type="invalid">{invalidFields.email}</Form.Control.Feedback>
                        </div>

                        <div className="d-flex flex-column gap-3 mt-5">
                            <div className="d-flex flex-column gap-0 justify-content-between align-items-center">
                                <p className="text-white">{t("list_room_steps.reminder.when_free")}</p>
                                <div className="d-flex flex-row justify-content-center align-items-center gap-2 w-75">
                                    <div className="form-group flex-grow-1">
                                        <Form.Select
                                            className="py-2 px-2"
                                            value={month}
                                            onChange={(e) => {
                                                setMonth(Number(e.target.value));
                                                clearFieldError("date");
                                            }}
                                            aria-label={t("list_room_steps.reminder.month")}
                                            isInvalid={!!invalidFields.date}
                                        >
                                            {months.map((m) => (
                                                <option key={m.value} value={m.value}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <div className="form-group flex-grow-1">
                                        <Form.Select
                                            className="py-2 px-2"
                                            value={year}
                                            onChange={(e) => {
                                                setYear(Number(e.target.value));
                                                clearFieldError("date");
                                            }}
                                            aria-label={t("list_room_steps.reminder.year")}
                                            isInvalid={!!invalidFields.date}
                                        >
                                            {yearOptions.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                            {(dateError || invalidFields.date) && (
                                <p className="text-warning small mb-0">{dateError || invalidFields.date}</p>
                            )}
                        </div>

                        <div className="d-flex flex-row justify-content-center align-items-center mt-20 gap-2">
                            <button
                                type="button"
                                className="btn-two"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "..." : t("common.submit")}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}