import React, { useMemo, useEffect, useRef } from "react";
import { FiEdit2 } from "react-icons/fi";
import PropertyCardGrid from "@/components/ui/cards/properties/PropertyCardGrid";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";

const MOCK_LISTING = {
    personalData: {
        name: "Alex",
        surname: "Johnson",
        email: "alex.johnson@example.com",
        phone: "+31 6 12345678",
    },
    propertyData: {
        type: "room",
        city: "Amsterdam",
        address: "Jordaan 42",
        postcode: "1015 CG",
        size: "18",
        period: "6 months",
        rent: "850",
        bills: "Included · Deposit: €1700",
        flatmates: "2",
        registration: true,
        description:
            "Bright room in a shared apartment in the heart of Jordaan. Close to cafes, markets and transport. Friendly international flatmates. Available from next month.",
        flatmatesMale: "1",
        flatmatesFemale: "1",
        bathrooms: "1",
        toilets: "1",
        furnishedType: 1,
    },
};

const FURNISHED_TYPE_LABELS: Record<number, string> = {
    1: "Fully furnished",
    2: "Semi-furnished",
    3: "None",
};

const MOCK_PLACEHOLDER_IMAGE = "https://placehold.co/600x400/e2e8f0/64748b?text=Listing+Preview";

function SixthStep({
    steps,
    currentStep,
}: {
    steps: (string | number)[];
    currentStep: number;
}) {
    const {
        listRoomStore: { back, next, isLast, goTo },
        propertyStore: { addListingData },
    } = useStore();

    const raw = addListingData;
    const personalData = useMemo(() => ({
        name: raw.personalData?.name || MOCK_LISTING.personalData.name,
        surname: raw.personalData?.surname || MOCK_LISTING.personalData.surname,
        email: raw.personalData?.email || MOCK_LISTING.personalData.email,
        phone: raw.personalData?.phone || MOCK_LISTING.personalData.phone,
    }), [raw.personalData]);
    const propertyData = useMemo(() => ({
        ...MOCK_LISTING.propertyData,
        ...(raw.propertyData || {}),
    }), [raw.propertyData]);
    const formImages = raw.images || [];
    const pd = propertyData as Record<string, unknown>;
    const prevUrlsRef = useRef<string[]>([]);

    const imageUrls = useMemo(() => {
        const list = formImages || [];
        return list
            .map((fileOrUrl: unknown) => {
                if (typeof fileOrUrl === "string") return fileOrUrl;
                if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
                    return URL.createObjectURL(fileOrUrl);
                }
                return "";
            })
            .filter(Boolean) as string[];
    }, [formImages]);

    useEffect(() => {
        prevUrlsRef.current.forEach((url) => {
            if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        });
        prevUrlsRef.current = imageUrls;
        return () => {
            prevUrlsRef.current.forEach((url) => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [imageUrls]);

    const stepPanels = useMemo(() => {
        const flatmatesMale = Math.max(0, parseInt(String(pd?.flatmatesMale ?? "0"), 10) || 0);
        const flatmatesFemale = Math.max(0, parseInt(String(pd?.flatmatesFemale ?? "0"), 10) || 0);
        const bathrooms = Math.max(1, parseInt(String(pd?.bathrooms ?? "1"), 10) || 1);
        const toilets = Math.max(1, parseInt(String(pd?.toilets ?? "1"), 10) || 1);
        const contact = [
            [personalData?.name, personalData?.surname].filter(Boolean).join(" ") || "—",
            personalData?.email || "—",
            personalData?.phone || "—",
        ].join(" · ");
        const basics = [
            propertyData?.type || "—",
            propertyData?.city || "—",
            [propertyData?.address, propertyData?.postcode].filter(Boolean).join(", ") || "—",
            propertyData?.registration ? "Registration possible" : "No registration",
        ].filter(Boolean).join(" · ");
        const details = [
            propertyData?.rent ? `€${propertyData.rent}/m` : null,
            propertyData?.bills ? `Bills: ${String(propertyData.bills).replace(/\s*\|\s*Deposit:.*$/, "").trim() || "—"}` : null,
            propertyData?.size ? `${propertyData.size} m²` : null,
            flatmatesMale + flatmatesFemale > 0 ? `${flatmatesMale} male, ${flatmatesFemale} female flatmate(s)` : null,
            `${bathrooms} bathroom(s), ${toilets} toilet(s)`,
            pd?.furnishedType != null ? (FURNISHED_TYPE_LABELS[Number(pd.furnishedType)] ?? String(pd.furnishedType)) : null,
            propertyData?.description ? String(propertyData.description).slice(0, 60) + (String(propertyData.description).length > 60 ? "…" : "") : null,
        ].filter(Boolean).join(" · ");
        return [
            { step: 2, title: "Contact details", summary: contact },
            { step: 3, title: "Basics", summary: basics },
            { step: 4, title: "Details", summary: details },
            { step: 5, title: "Photos", summary: "", imageUrls },
        ];
    }, [personalData, propertyData, pd]);

    const previewProperty = useMemo(() => {
        const main = imageUrls[0] || MOCK_PLACEHOLDER_IMAGE;
        const rest = imageUrls.length > 1 ? imageUrls.slice(1) : [];
        return {
            id: 9999,
            hidden: false,
            status: "Draft",
            statusCode: 0,
            price: parseInt(String(propertyData?.rent ?? "0"), 10) || 0,
            title: propertyData?.address
                ? `${propertyData.address}${propertyData.city ? `, ${propertyData.city}` : ""}`
                : propertyData?.city || "Your listing",
            city: propertyData?.city || "",
            location: [propertyData?.address, propertyData?.postcode, propertyData?.city].filter(Boolean).join(", ") || "—",
            description: {
                property: String(propertyData?.description ?? "").slice(0, 120) || "—",
                period: "",
                bills: "",
                flatmates: "",
            },
            main_image: main,
            images: rest,
            folder: "",
        };
    }, [propertyData, imageUrls]);

    return (
        <div className="list-room-modal__first-step">
            <div className="list-room-modal__first-step__body container">
                {/* Left: step summary panels (2–5 only) */}
                <div className="row g-4 g-lg-4">
                    <div className="col-12 col-lg-4 d-flex flex-column gap-3">
                        {stepPanels.map((panel) => (
                            <div
                                key={panel.step}
                                className="border rounded-3 p-3 bg-light step-panel position-relative"
                            >
                                <button
                                    type="button"
                                    className="step-panel__edit-btn position-absolute top-0 end-0 btn btn-link p-2"
                                    style={{ top: "0.25rem", right: "0.25rem" }}
                                    onClick={() => goTo(panel.step - 1)}
                                    aria-label={`Edit ${panel.title}`}
                                >
                                    <FiEdit2 size={18} />
                                </button>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span className="step-panel__step-badge badge rounded-circle d-inline-flex align-items-center justify-content-center">
                                        {panel.step}
                                    </span>
                                    <strong className="small text-dark">{panel.title}</strong>
                                </div>
                                {panel.step === 5 && panel.imageUrls?.length ? (
                                    <>
                                        <p className="small text-muted mb-2">
                                            {panel.imageUrls.length} photo{panel.imageUrls.length !== 1 ? "s" : ""} uploaded
                                        </p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {panel.imageUrls.map((src, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded overflow-hidden bg-secondary"
                                                    style={{ width: 56, height: 56 }}
                                                >
                                                    <img
                                                        src={src}
                                                        alt=""
                                                        className="w-100 h-100 object-fit-cover"
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="small text-muted mb-0">{panel.summary || "—"}</p>
                                )}
                            </div>
                        ))}

                    </div>
                    {/* Right: preview card (form data + uploaded images) + buttons */}
                    <div className="col-12 col-lg-8 d-flex justify-content-center">
                            {previewProperty.main_image ? (
                                <PropertyCardGrid
                                    property={previewProperty}
                                    disableLinks
                                    style
                                />
                            ) : (
                                <div className="col-12">
                                    <div className="border rounded-3 p-4 bg-light text-center text-muted">
                                        Add photos in step 5 to see your listing preview here.
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(SixthStep);