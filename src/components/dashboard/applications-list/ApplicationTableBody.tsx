"use client";

import Image from "next/image";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useServer } from "@/hooks/useServer";
import { APPLICATION_MODAL, APPLICATION_PREVIEW_MODAL } from "@/utils/defines";
import { formatJsonKeyValuePairs } from "@/utils/helpers";
import { getPropertyUrl } from "@/utils/seoHelpers";
import { showGeneralError, showStandardNotification } from "@/utils/helpers";
import useTranslation from "next-translate/useTranslation";
import PaginatedTableWrapper, {
  PaginatedTableWrapperHandle,
} from "../properties-list/PaginatedTableWrapper";
import moment from "moment";
import icon_1 from "@/assets/images/dashboard/icon/icon_18.svg";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";

const FALLBACK_PROPERTY_IMAGE = "/assets/img/icons/3d/house.png";

/** Application list item: may include property_id, property_title, property_url, step, location for opening modal */
export interface ApplicationListItem {
  id: number | string;
  property_id?: number;
  property_title?: string | Record<string, string>;
  property_url?: string;
  property_data?: any;
  name?: string;
  surname?: string;
  email?: string;
  created_at?: string;
  status?: number;
  step?: number;
  current_step?: number;
  location?: string;
  [key: string]: unknown;
}

interface ApplicationTableBodyProps {
  filterCity?: string;
  filterSearch?: string;
  filterReferenceId?: string;
}

const ApplicationTableBody = ({
  filterCity = "",
  filterSearch = "",
  filterReferenceId = "",
}: ApplicationTableBodyProps) => {
  const { modalStore, userStore: { isAdmin } } = useStore();
  const { sendRequest } = useServer();
  const { lang } = useTranslation("translations");
  const paginationRef = useRef<PaginatedTableWrapperHandle>(null);

  const buildQueryParams = (page: number, perPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    const city = filterCity?.trim();
    const search = filterSearch?.trim();
    const referenceId = filterReferenceId?.trim();
    if (city) params.set("city", city);
    if (search) params.set("search", search);
    if (referenceId) params.set("reference_id", referenceId);
    return params.toString();
  };

  const fetchData = async (page: number, perPage: number) => {
    const query = buildQueryParams(page, perPage);
    const base = isAdmin ? "/listing-application/list-extended" : "/listing-application/list";
    const response = await sendRequest(`${base}?${query}`);
    if (response?.status && response?.data != null) {
      const raw = response.data;
      const list = Array.isArray(raw)
        ? raw
        : raw?.applications ?? raw?.data ?? raw?.list ?? [];
      const pagination = raw?.pagination ?? {
        current_page: raw?.current_page ?? page,
        last_page: raw?.last_page ?? 1,
        per_page: raw?.per_page ?? perPage,
        total: raw?.total ?? list?.length ?? 0,
      };
      return {
        data: Array.isArray(list) ? list : [],
        pagination: {
          current_page: pagination.current_page ?? page,
          last_page: pagination.last_page ?? 1,
          per_page: pagination.per_page ?? perPage,
          total: pagination.total ?? 0,
        },
      };
    }
    return {
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: 0,
      },
    };
  };

  const getPropertyUrlForItem = (item: ApplicationListItem): string => {
    let url = item.property_url;
    if (!url && item.property_data) {
      const payload = {
        ...item.property_data,
        id: item.property_data.id ?? item.property_id ?? item.propertyId,
      };
      url = getPropertyUrl(payload, true, lang);
    }
    return url ?? "";
  };

  const openApplicationsModal = (item: ApplicationListItem) => {
    const propertyId = item.property_id ?? item.propertyId;
    const title =
      typeof item.property_title === "object"
        ? formatJsonKeyValuePairs(JSON.stringify(item.property_title), ["en"])
        : String(item.property_title ?? "");
    const propertyUrl = getPropertyUrlForItem(item);
    modalStore.setActiveModal(APPLICATION_MODAL, {
      propertyId,
      propertyTitle: title,
      propertyUrl,
    });
  };

  const openPreviewModal = (item: ApplicationListItem) => {
    modalStore.setActiveModal(APPLICATION_PREVIEW_MODAL, { entry: item });
  };

  const handleCopyLink = async (item: ApplicationListItem) => {
    const url = getPropertyUrlForItem(item);
    if (!url) {
      showGeneralError("No link to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showStandardNotification("success", "Link copied to clipboard");
    } catch {
      showGeneralError("Failed to copy link");
    }
  };

  const handleSendReminder = async (item: ApplicationListItem) => {
    try {
      const response = await sendRequest(
        "/renting/send-reminder",
        "POST",
        { id: item.id }
      );
      if (response?.status) {
        showStandardNotification("success", "Reminder email sent");
      } else {
        showGeneralError(response?.message ?? "Failed to send reminder");
      }
    } catch {
      showGeneralError("Failed to send reminder email");
    }
  };

  const getFirstPropertyImage = (item: ApplicationListItem): string => {
    const pd = item.property_data;
    if (!pd) return FALLBACK_PROPERTY_IMAGE;
    const main = pd.main_image ?? pd.main_image_url;
    if (main && typeof main === "string") return main;
    const images = pd.images;
    if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string") return images[0];
    return FALLBACK_PROPERTY_IMAGE;
  };

  const getLocation = (item: ApplicationListItem): string => {
    if (item.city || item.address || item.postcode) {
      return `${item.city} | ${item.address} | ${item.postcode}`;
    }

    return "—";
  };

  const getStepDisplay = (item: ApplicationListItem): string => {
    const step = item.step ?? item.current_step;
    if (step == null) return "—";
    const num = Number(step);
    return Number.isNaN(num) ? String(step) : `Step ${num}`;
  };

  const renderRows = (applications: ApplicationListItem[]) => (
    <>
      {applications.map((item) => {
        const title =
          typeof item.property_title === "object"
            ? formatJsonKeyValuePairs(JSON.stringify(item.property_title), ["en"])
            : String(item.property_title ?? "—");
        const applicant = [item.name, item.surname].filter(Boolean).join(" ") || "—";
        const date = item.created_at
          ? moment(item.created_at).format("DD/MM/YYYY HH:mm")
          : "—";
        const propertyImageSrc = getFirstPropertyImage(item);
        const isFallback = propertyImageSrc === FALLBACK_PROPERTY_IMAGE;
        const referenceId = item.reference_id ?? item.referenceId;
        const refIdStr = referenceId != null && referenceId !== "" ? String(referenceId) : null;

        return (
          <tr className="listing-table" key={item.id}>
            <td className="center">
              <div className="d-flex align-items-center gap-2 m-auto" style={{ width: 100, height: 100 }}>
                {refIdStr ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`ref-${item.id}`}>Reference ID: {refIdStr}</Tooltip>}
                  >
                    <Image
                      src={propertyImageSrc}
                      alt=""
                      width={56}
                      height={56}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      unoptimized={isFallback}
                    />
                  </OverlayTrigger>
                ) : (
                  <Image
                    src={propertyImageSrc}
                    alt=""
                    width={56}
                    height={56}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    unoptimized={isFallback}
                  />
                )}
              </div>
            </td>
            <td className="center">{getLocation(item)}</td>
            <td className="center">{applicant}</td>
            <td className="center">{item.email ?? "—"}</td>
            <td className="center">{date}</td>
            <td className="center">{getStepDisplay(item)}</td>
            <td className="center">
              {isAdmin ? (
                <div className="action-dots float-end">
                  <button
                    className="action-btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span></span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => openPreviewModal(item)}
                      >
                        <Image src={icon_1} alt="" className="lazy-img" />
                        Preview
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => openApplicationsModal(item)}
                      >
                        <Image src={icon_3} alt="" className="lazy-img" />
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleSendReminder(item)}
                      >
                        <i className="fas fa-envelope me-2" />
                        Send reminder email
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleCopyLink(item)}
                      >
                        <i className="fas fa-link me-2" />
                        Copy link
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-fourteen btn-sm"
                  onClick={() => openApplicationsModal(item)}
                >
                  Continue
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );

  return (
    <tbody className="border-0">
      <PaginatedTableWrapper
        key={`${filterCity}-${filterSearch}-${filterReferenceId}`}
        ref={paginationRef}
        fetchData={fetchData}
        renderRows={(data) => renderRows(data as ApplicationListItem[])}
        initialPerPage={10}
      />
    </tbody>
  );
};

export default observer(ApplicationTableBody);
