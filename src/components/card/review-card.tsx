
import StarsIcon from "@/assets/images/icon/stars.svg";
import Image from "next/image";

export default function ReviewCard({item}) {
    return (
        <div className="card custom-card review-card">
            <div className="card-content custom-card__content">
                <div className="card-header custom-card__header review-card__header">
                    <div className="card-img custom-card__thumbnail review-card__thumbnail">
                        <Image src={item.thumbnail_image} alt="Room Image" className="object-fit-cover w-100 h-100" />
                    </div>
                    <div className="d-flex flex-column gap-1">
                        <h3 className="card-title custom-card__header__title">
                            {item.name}
                        </h3>
                        <p className="custom-card__header__date">
                            {item.date && item.date}
                        </p>
                    </div>
                </div>
                <p className="card-subtitle custom-card__header__sub-title">
                    <Image src={StarsIcon} alt="map marker" className="d-inline" />
                </p>
                <p className="message-text">
                    {item.message && item.message}
                </p>
            </div>
        </div>
    )
}