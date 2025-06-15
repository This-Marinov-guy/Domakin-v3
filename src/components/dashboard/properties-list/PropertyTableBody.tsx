import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ReactPaginate from "react-paginate";
import PaginatedTableWrapper, {
  PaginatedTableWrapperHandle,
} from "./PaginatedTableWrapper";

import icon_1 from "@/assets/images/dashboard/icon/icon_18.svg";
import icon_2 from "@/assets/images/dashboard/icon/icon_19.svg";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";

import listImg_5 from "@/assets/images/dashboard/img_05.jpg";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useEffect, useState, useRef } from "react";
import { useServer } from "@/hooks/useServer";
import PropertyDataPreview from "@/components/ui/modals/PropertyDataPreview";
import EditPropertyModal from "@/components/ui/modals/EditPropertyModal";
import { PROPERTY_STATUS } from "@/utils/enum";
import { EDIT_PROPERTY_MODAL, PROPERTY_ID_OFFSET } from "@/utils/defines";

const PropertyTableBody = () => {
  const {
    propertyStore: {
      setPropertyDataForEdit,
      statusLabel,
    },
    modalStore,
    userStore: { isAdmin },
  } = useStore();

  const [propertyPreview, setPropertyPreview] = useState(null);

  const { sendRequest } = useServer();

  // Ref for PaginatedTableWrapper
  const paginationRef = useRef<PaginatedTableWrapperHandle>(null);

  // Fetch function for PaginatedTableWrapper
  const fetchData = async (page: number, perPage: number) => {
    const response = await sendRequest(
      `${
        isAdmin ? "/property/list-extended" : "/property/list"
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

  // Table row renderer
  const renderRows = (userProperties: any[]) => (
    <>
      <PropertyDataPreview
        data={propertyPreview}
        onHide={() => setPropertyPreview(null)}
      />
      <EditPropertyModal callback={() => paginationRef.current?.reload()} />
      {userProperties.map((item) => (
        <tr className="listing-table" key={item.id}>
          <td className="center">
            <div className="d-lg-flex align-items-center justify-content-center position-relative responsive-title-col">
              {item.status < PROPERTY_STATUS.EXPIRED ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Go to the listing</Tooltip>}
                >
                  <Link
                    href={`/services/renting/property/${
                      PROPERTY_ID_OFFSET + item.id
                    }`}
                  >
                    <Image
                      src={item.property_data.images[0]}
                      width={200}
                      height={200}
                      alt="property-image"
                      className="p-img"
                    />
                  </Link>
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
                  setPropertyDataForEdit(item);
                  modalStore.setActiveModal(EDIT_PROPERTY_MODAL);
                }}
              >
                {statusLabel(item.status)}
              </div>
            </OverlayTrigger>
          </td>
          {isAdmin ? (
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
                        setPropertyPreview({
                          ...item.personal_data,
                          ...item.property_data,
                        })
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
                </ul>
              </div>
            </td>
          ) : (
            <td className="center"></td>
          )}
        </tr>
      ))}
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
