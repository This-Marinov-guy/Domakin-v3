"use client";
import NiceSelect from "@/ui/NiceSelect";
import MediaGallery from "./MediaGallery";
import Review from "@/components/inner-pages/agency/agency-details/Review";
import Sidebar from "./Sidebar";
import CommonBanner from "../listing-details-common/CommonBanner";
import CommonPropertyOverview from "../listing-details-common/CommonPropertyOverview";
import CommonPropertyFeatureList from "../listing-details-common/CommonPropertyFeatureList";
import CommonAmenities from "../listing-details-common/CommonAmenities";
import CommonPropertyVideoTour from "../listing-details-common/CommonPropertyVideoTour";
import CommonPropertyFloorPlan from "../listing-details-common/CommonPropertyFloorPlan";
import CommonNearbyList from "../listing-details-common/CommonNearbyList";
import CommonSimilarProperty from "../listing-details-common/CommonSimilarProperty";
import CommonProPertyScore from "../listing-details-common/CommonProPertyScore";
import CommonLocation from "../listing-details-common/CommonLocation";
import CommonReviewForm from "../listing-details-common/CommonReviewForm";
import PageLoader from "@/components/ui/loading/PageLoader";
import { useStore } from "@/stores/storeContext";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import useTranslation from "next-translate/useTranslation";
import { EDIT_PROPERTY_MODAL, PROPERTY_ID_OFFSET } from "@/utils/defines";
import EditPropertyModal from "@/components/ui/modals/EditPropertyModal";
import { useServer } from "@/hooks/useServer";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import PropertyDataPreview from "@/components/ui/modals/PropertyDataPreview";
import { parsePropertyPreviewData } from "@/utils/helpers";
import StripePaymentLinkButton from "@/components/ui/buttons/StripePaymentLinkButton";

const ListingDetailsOneArea = ({ property, slug, style_3 }: any) => {
  const { t } = useTranslation("translations");
  const {
    userStore: { isAdmin },
    modalStore,
    propertyStore: { setPropertyDataForEdit, userProperties },
  } = useStore();

  const [extendedPropertyDetails, setExtendedPropertyDetails] =
    useState<any>(null);
  const [isEditLoading, setIsEditLoading] = useState(true);
  const [isPreviewOpened, setIsPreviewOpened] = useState(false);

  const { sendRequest } = useServer();

  const folder = `/assets/img/properties/${
    property.folder ?? "property_" + property.id
  }/`;

  const loadExtendedPropertyDetails = async () => {
    if (Number(slug) < PROPERTY_ID_OFFSET) return;

    const response = await sendRequest(
      `/property/details/${Number(slug) - PROPERTY_ID_OFFSET}`,
      "GET",
      {},
      {},
      { withLoading: true, withError: false }
    );

    if (response?.status) {
      setExtendedPropertyDetails(response.data);
      setIsEditLoading(false);
    }
  };

  useEffect(() => {
    loadExtendedPropertyDetails();
  }, []);

  const openEditModal = () => {
    if (!extendedPropertyDetails) return;

    setPropertyDataForEdit(extendedPropertyDetails);
    modalStore.setActiveModal(EDIT_PROPERTY_MODAL);
  };

  const allImages =
    Number(property.id) > 1000
      ? [property.main_image, ...property.images]
      : [
          folder + property.main_image,
          ...property.images.map((img: any) => folder + img),
        ];

  return (
    <>
      <EditPropertyModal callback={location.reload} />
      {isPreviewOpened && (
        <PropertyDataPreview
          data={parsePropertyPreviewData(extendedPropertyDetails)}
          onHide={() => setIsPreviewOpened(false)}
        />
      )}

      <div className="listing-details-one theme-details-one bg-pink pt-180 lg-pt-150 pb-50 xl-pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h4 className="property-title">{property.title} </h4>
              {isAdmin &&
                (isEditLoading ? (
                  <small>Loading Actions...</small>
                ) : (
                  <div className="d-flex align-items-center gap-2 fs-5">
                    <span>Quick Actions:</span>
                    {extendedPropertyDetails?.property_data?.payment_link && (
                      <StripePaymentLinkButton propertyId={property.id} />
                    )}
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Property</Tooltip>}
                    >
                      <i
                        onClick={openEditModal}
                        style={{ cursor: "pointer" }}
                        className="fa-regular ml-10 fa-edit cursor-pointer"
                      ></i>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Preview Property</Tooltip>}
                    >
                      <i
                        onClick={() => setIsPreviewOpened(true)}
                        style={{ cursor: "pointer" }}
                        className="fa-regular ml-10 fa-eye cursor-pointer"
                      ></i>
                    </OverlayTrigger>
                  </div>
                ))}
              <div className="d-flex flex-wrap mt-10">
                {/* <div
                className={`list-type text-uppercase mt-15 me-3 ${
                  style_3
                    ? "bg-white text-dark fw-500"
                    : "text-uppercase border-20"
                }`}
              >
                FOR SELL
              </div> */}
                <div className="address mt-15">
                  <i className="bi bi-geo-alt"></i> {property.location}
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-lg-end">
              <div className="d-inline-block md-mt-40">
                <div className="price color-dark fw-500">
                  <h4>
                    {property.price} € / {t("renting.per_month")}
                  </h4>
                </div>

                {/* <ul className="style-none d-flex align-items-center action-btns">
                <li className="me-auto fw-500 color-dark">
                  <i className="fa-sharp fa-regular fa-share-nodes me-2"></i>
                  Share
                </li>
                <li>
                  <Link
                    href="#"
                    className={`d-flex align-items-center justify-content-center tran3s ${
                      style_3 ? "" : "rounded-circle"
                    }`}
                  >
                    <i className="fa-light fa-heart"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`d-flex align-items-center justify-content-center tran3s ${
                      style_3 ? "" : "rounded-circle"
                    }`}
                  >
                    <i className="fa-light fa-bookmark"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`d-flex align-items-center justify-content-center tran3s ${
                      style_3 ? "" : "rounded-circle"
                    }`}
                  >
                    <i className="fa-light fa-circle-plus"></i>
                  </Link>
                </li>
              </ul> */}
              </div>
            </div>
          </div>{" "}
          <MediaGallery images={allImages} />
          <div className="property-feature-list bg-white shadow4 border-20 p-40 mt-20 mb-10">
            <h4 className="sub-title-one mb-40 lg-mb-20 text-center">
              {t("property.property_details")}
            </h4>
            <CommonPropertyOverview property={property} />
          </div>
          {/* <div className="row">
               <div className="col-xl-8">
                  <div className="property-overview mb-50 bg-white shadow4 border-20 p-40">
                     <h4 className="mb-20">Overview</h4>
                     <p className="fs-20 lh-lg">Lorem ipsum dolor sit amet consectetur. Et velit varius ipsum tempor vel
                        dignissim tincidunt. Aliquam accumsan laoreet ultricies tincidunt faucibus fames augue in
                        sociis. Nisl enim integer neque nec.</p>
                  </div>
                  <div className="property-feature-accordion bg-white shadow4 border-20 p-40 mb-50">
                     <h4 className="mb-20">Property Features</h4>
                     <p className="fs-20 lh-lg">Risk management and compliance, when approached strategically, have the potential to go beyond mitigating threats.</p>
                     <div className="accordion-style-two mt-45">
                        <CommonPropertyFeatureList />
                     </div>
                  </div>
                  <div className="property-amenities bg-white shadow4 border-20 p-40 mb-50">
                     <CommonAmenities />
                  </div>
                  <div className="property-video-tour mb-50">
                     <CommonPropertyVideoTour />
                  </div>
                  <CommonPropertyFloorPlan style={false} />
                  <div className="property-nearby bg-white shadow4 border-20 p-40 mb-50">
                     <CommonNearbyList />
                  </div>
                  <CommonSimilarProperty />
                  <div className="property-score bg-white shadow4 border-20 p-40 mb-50">
                     <CommonProPertyScore />
                  </div>
                  <div className="property-location mb-50">
                     <CommonLocation />
                  </div>

                  <div className="review-panel-one bg-white shadow4 border-20 p-40 mb-50">
                     <div className="position-relative z-1">
                        <div className="d-sm-flex justify-content-between align-items-center mb-10">
                           <h4 className="m0 xs-pb-30">Reviews</h4>
                           <NiceSelect className="nice-select"
                              options={[
                                 { value: "01", text: "Newest" },
                                 { value: "02", text: "Best Seller" },
                                 { value: "03", text: "Best Match" },
                              ]}
                              defaultCurrent={0}
                              onChange={selectHandler}
                              name=""
                              placeholder="" />
                        </div>
                        <Review style={true} />
                     </div>
                  </div>
                  <div className="review-form bg-white shadow4 border-20 p-40">
                     <CommonReviewForm />
                  </div>
               </div>
               <Sidebar />
            </div> */}
        </div>
      </div>
    </>
  );
};

export default ListingDetailsOneArea;
