
import MapMarker from "@/assets/images/map/map-marker.svg";
import ArrowRightCornerUp from "@/assets/images/icon/arrow-right-corner-up.svg";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface RoomCardProps {
    item: {
        thumbnail_image: string | StaticImageData;
        title: string;
        price?: string;
        plan_type?: string;
        location?: string;
        details?: string[];
        url: string;
    };
}

export default function RoomCard({item}: RoomCardProps) {
    return (
        <div className="card custom-card">
            <div className="card-img custom-card__thumbnail">
                <Image src={item.thumbnail_image} alt="Room Image" className="object-fit-cover w-100 h-100" />
            </div>
            <div className="card-content custom-card__content">
                <div className="card-header custom-card__header">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <h3 className="card-title custom-card__header__title">
                            {item.title}
                        </h3>
                        <h4 className="custom-card__header__price">
                            <span>{item.price && item.price}</span>{item.plan_type && item.plan_type}
                        </h4>
                    </div>
                    <p className="card-subtitle custom-card__header__sub-title">
                        <Image src={MapMarker} alt="map marker" className="d-inline" /> {item.location && item.location}
                    </p>
                </div>
                <ul>
                    {item.details && item.details.map((detailItem, detailItemIndex) =>
                        <li key={detailItemIndex}>
                            {detailItem}
                        </li>
                    )}
                </ul>
            </div>
            <div className="card-footer custom-card__footer">
                <Link href={item.url} className="btn btn-lg btn-warning custom-card__footer__btn">
                    More info <Image src={ArrowRightCornerUp} alt="arrow icon" />
                </Link>
            </div>
        </div>
    )
}