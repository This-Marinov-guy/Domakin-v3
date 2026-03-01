import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReactPaginate from "react-paginate";
import PaginatedTableWrapper, {
  PaginatedTableWrapperHandle,
} from "./PaginatedTableWrapper";

import icon_1 from "@/assets/images/dashboard/icon/icon_18.svg";
import icon_2 from "@/assets/images/dashboard/icon/icon_19.svg";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";

import listImg_5 from "@/assets/images/dashboard/img_05.jpg";
import rentSwapLogo from "@/assets/images/logo/rent-swap.svg";
import domakinLogo from "@/assets/img/logo-2.png";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useEffect, useState, useRef } from "react";
import { useServer } from "@/hooks/useServer";
import PropertyDataPreview from "@/components/ui/modals/PropertyDataPreview";
import EditPropertyModal from "@/components/ui/modals/EditPropertyModal";
import { PROPERTY_STATUS } from "@/utils/enum";
import { APPLICATION_MODAL, EDIT_PROPERTY_MODAL, PROPERTY_ID_OFFSET } from "@/utils/defines";
import { formatJsonKeyValuePairs, parsePropertyPreviewData, showGeneralError, showStandardNotification } from "@/utils/helpers";
import StripePaymentLinkButton from "@/components/ui/buttons/StripePaymentLinkButton";
import { getPropertyUrl } from "@/utils/seoHelpers";
import useTranslation from "next-translate/useTranslation";

const PropertyTableBody = () => {
  const {
    propertyStore: { setPropertyDataForEdit, statusLabel },
    modalStore,
    userStore: { isAdmin },
  } = useStore();
  const { lang } = useTranslation("translations");

  const [propertyPreview, setPropertyPreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { sendRequest } = useServer();

  // Ref for PaginatedTableWrapper
  const paginationRef = useRef<PaginatedTableWrapperHandle>(null);

  // Fetch function for PaginatedTableWrapper
  const fetchData = async (page: number, perPage: number) => {
    const response = await sendRequest(
      `${isAdmin ? "/property/list-extended" : "/property/list"
      }?page=${page}&per_page=${perPage}`
    );
    if (response?.status) {
      return {
        data: response.data.properties,
        pagination: {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
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

  const openApplicationsModal = (item: any) => {
    const propertyPayload = {
      ...item.property_data,
      id: PROPERTY_ID_OFFSET + (item.id ?? 0),
    };

    modalStore.setActiveModal(APPLICATION_MODAL, {
      propertyId: item.id,
      propertyTitle: formatJsonKeyValuePairs(item.property_data?.title, ['en']),
      propertyUrl: getPropertyUrl(propertyPayload, true, lang),
    });
  };

  const handleDeleteProperty = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const res = await sendRequest(
        `/property/delete/${deleteConfirm.id}`,
        "DELETE",
        {},
        {},
        { withLoading: false }
      );
      if (res?.status) {
        showStandardNotification("success", "Property deleted.");
        setDeleteConfirm(null);
        paginationRef.current?.reload();
      } else {
        showGeneralError(res?.message ?? "Failed to delete property.");
      }
    } catch {
      showGeneralError("Failed to delete property.");
    } finally {
      setDeleting(false);
    }
  };

  // Table row renderer
  const renderRows = (userProperties: any[]) => (
    <>
      <PropertyDataPreview
        data={propertyPreview}
        onHide={() => setPropertyPreview(null)}
      />
      <Modal show={!!deleteConfirm} onHide={() => !deleting && setDeleteConfirm(null)} centered closeButton>
       
        <Modal.Body>
          {deleteConfirm && (
            <>Are you sure you want to delete &quot;{deleteConfirm.title}&quot;?</>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button className="btn-danger-solid" onClick={handleDeleteProperty} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
      <EditPropertyModal callback={() => paginationRef.current?.reload()} />
      {userProperties.map((item) => {
        const isRentSwap = item.interface === "rentswap" || item.property_data?.interface === "rentswap";

        return (
          <tr className="listing-table" key={item.id}>
            <td className="center">
              <Image
                src={isRentSwap ? rentSwapLogo : domakinLogo}
                alt="RentSwap"
                width={400}
                height={400}
                className="rentswap-logo"
              />
            </td>
            <td className="center">
              <div className="d-lg-flex align-items-center justify-content-center position-relative responsive-title-col">
                {item.status < PROPERTY_STATUS.EXPIRED ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      item.status === PROPERTY_STATUS.PENDING ? (
                        <Tooltip>Add Release date and go to listing</Tooltip>
                      ) : (
                        <Tooltip>Go to the listing</Tooltip>
                      )
                    }
                  >
                    <a
                      target="_blank"
                      href={getPropertyUrl({
                        ...item.property_data,
                        id: PROPERTY_ID_OFFSET + item.id,
                      }, true, lang)}
                    >
                      <Image
                        src={item.property_data.images[0]}
                        width={200}
                        height={200}
                        alt="property-image"
                        className="p-img"
                      />
                    </a>
                  </OverlayTrigger>
                ) : (
                  <Image
                    src={item.property_data.images[0]}
                    width={200}
                    height={200}
                    alt="property-image"
                    className="p-img"
                  />
                )}

              </div>

            </td>
            <td className="center w-25 responsive-title-col">
              <strong className="price color-dark">
                {item.property_data.city}
              </strong>
              <p className="price color-dark">{item.property_data.address}</p>
            </td>
            <td className="center">
              <p className="price color-dark">€{item.property_data.rent}</p>
            </td>
            <td className="center">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Click to change status</Tooltip>}
              >
                <div
                  className={`property-status ${statusLabel(
                    item.status
                  ).toLowerCase()}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!isAdmin) return;

                    setPropertyDataForEdit(item);
                    modalStore.setActiveModal(EDIT_PROPERTY_MODAL);
                  }}
                >
                  {statusLabel(item.status)}
                </div>
              </OverlayTrigger>

            </td>
            {/* Payment link column */}
            <td className="center">
              {isAdmin && item?.property_data?.payment_link && (
                <StripePaymentLinkButton propertyId={item.id} />
              )}
            </td>
            {/* Action column */}
            <td className="center">

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
                      className="dropdown-item"
                      onClick={() =>
                        setPropertyPreview(parsePropertyPreviewData(item))
                      }
                    >
                      <Image src={icon_1} alt="" className="lazy-img" />
                      View Details
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setPropertyDataForEdit(item);
                        modalStore.setActiveModal(EDIT_PROPERTY_MODAL);
                      }}
                    >
                      <Image src={icon_3} alt="" className="lazy-img" /> Edit
                    </button>
                  </li>
                  {isAdmin &&
                    <>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => openApplicationsModal(item)}
                        >
                          <i className="fas fa-users"></i> Applications
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() =>
                            setDeleteConfirm({
                              id: item.id,
                              title: formatJsonKeyValuePairs(item.property_data?.title, ["en"]) || `Property #${item.id}`,
                            })
                          }
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </li>
                    </>
                  }

                </ul>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );

  return (
    <tbody className="border-0">
      <PaginatedTableWrapper
        ref={paginationRef}
        fetchData={fetchData}
        renderRows={renderRows}
        initialPerPage={5}
      />
    </tbody>
  );
};

export default observer(PropertyTableBody);
