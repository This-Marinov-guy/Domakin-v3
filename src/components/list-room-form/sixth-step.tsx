import React, { useMemo, useEffect, useRef } from "react";
import { FiEdit2 } from "react-icons/fi";
import PropertyCardGrid from "@/components/ui/cards/properties/PropertyCardGrid";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";

/**
 * Converts addListingImages (string URLs from backend + File objects) to display URLs.
 * Strings are used as-is; File/Blob get a blob URL (caller must revoke on unmount).
 */
function toDisplayImageUrls(images: (string | File)[]): string[] {
    return images
        .map((item: string | File) => {
            if (typeof item === "string") return item;
            if (typeof File !== "undefined" && item instanceof File) return URL.createObjectURL(item);
            if (typeof Blob !== "undefined" && item instanceof Blob) return URL.createObjectURL(item);
            return "";
        })
        .filter(Boolean);
}

/** Strip street number and optional suffix (e.g. "42" or "42a") from address for approximate display. */
function toApproximateAddress(address: string): string {
    if (!address || typeof address !== "string") return "";

    const cleaned = address
        .replace(/\d+[a-zA-Z]*/g, "") // removes 12, 12A, 12bis (partial)
        .replace(/\s{2,}/g, " ")
        .replace(/[,\-\/]+/g, " ")
        .trim();

    return cleaned || "";
}

function SixthStep({
    steps,
    currentStep,
    discreteAddress = false,
}: {
    steps: (string | number)[];
    currentStep: number;
    discreteAddress?: boolean;
}) {
    const {
        propertyStore: {
            addListingImages,
            goToAddListingStep: goTo,
            getAddListingStepPanels,
            getAddListingPreviewProperty,
            addListingDisplayPropertyData: pd,
        },
    } = useStore();

    const prevUrlsRef = useRef<string[]>([]);
    const imageUrls = useMemo(() => toDisplayImageUrls(addListingImages), [addListingImages]);

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

    const stepPanels = getAddListingStepPanels(imageUrls);
    const previewProperty = getAddListingPreviewProperty(imageUrls);

    const displayProperty = useMemo(() => {
        const address = (pd?.address as string) ?? "";
        const city = (pd?.city as string) ?? "";
        const approxAddress = toApproximateAddress(address);
        const approxTitle = 'Available property';
        const approxLocation = `${approxAddress}, ${city}`;
        return {
            ...previewProperty,
            title: approxTitle,
            location: approxLocation,
        };
    }, [discreteAddress, previewProperty, pd?.address, pd?.city]);

    return (
        <div className="list-room-modal__first-step">
            <div className="list-room-modal__first-step__body container">
                <div className="flex-box">
                    <div className="col-12 col-lg-4">
                        {stepPanels.map((panel) => (
                            <div
                                key={panel.step}
                                className="border rounded-3 p-3 bg-light step-panel position-relative mb-3"
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

                    <div className="d-flex justify-content-center w-100">
                        {displayProperty.main_image ? (
                            <PropertyCardGrid
                                property={displayProperty}
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
