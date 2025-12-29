
import MapMarker from "@/assets/images/map/map-marker.svg";
import ArrowLeftWhite from "@/assets/images/icon/arrow-left-2.svg";
import Link from "next/link";
import Image from "next/image";

export default function RoomCardV3({item}) {

    return (
        <div className="card custom-card room-card-v2 room-card-v3">
            <div className="d-flex flex-column">
                <div className="card-img custom-card__thumbnail room-card-v2__thumbnail">
                    <Image src={item.thumbnail_image} alt="Room Image" className="object-fit-cover w-100 h-100" />
                </div>
            </div>
            <div className="d-flex flex-column">
                <div className="card-content custom-card__content room-card-v2__content">
                    <div className="card-header custom-card__header room-card-v2__header">
                        <h3 className="card-title custom-card__header__title room-card-v2__header__title">
                            {item.title}
                        </h3>
                        <p className="card-subtitle custom-card__header__sub-title room-card-v2__header__sub-title">
                            <Image src={MapMarker} alt="map marker" className="d-inline" /> {item.location && item.location}
                        </p>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: item && item.text }}></p>
                </div>
                <div className="card-footer d-flex flex-row justify-content-between align-items-center custom-card__footer room-card-v2__footer">
                    <h4 className="custom-card__header__price room-card-v2__header__price">
                        <span>{item.price && item.price}</span>{item.plan_type && item.plan_type}
                    </h4>
                    <Link href={item.url} className="btn btn-lg btn-warning custom-card__footer__btn room-card-v2__footer__btn">
                        <Image src={ArrowLeftWhite} alt="arrow icon" />
                    </Link>
                </div>
            </div>
        </div>
    )
}