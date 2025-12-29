
import GoogleIcon from "@/assets/images/icon/google.svg";
import Image from "next/image";

export default function ReviewCard({item}) {
    return (
        <div className="card custom-card review-card review-card-v2">
            <div className="card-content custom-card__content review-card__content review-card-v2__content">
                <h4 className="card-subtitle custom-card__header__sub-title review-card-v2__header__sub-title">
                    {item.subject && item.subject}
                </h4>
                <p className="message-text review-card-v2__message-text" dangerouslySetInnerHTML={{ __html: item.message && item.message }}></p>
            </div>
            <div className="card-header custom-card__header review-card__header review-card-v2__header">
                <div className="card-img custom-card__thumbnail review-card__thumbnail review-card-v2__thumbnail">
                    <Image src={item.thumbnail_image} alt="Room Image" className="object-fit-cover w-100 h-100" />
                </div>
                <div className="d-flex flex-column gap-1">
                    <h3 className="card-title custom-card__header__title review-card-v2__header__title">
                        {item.name}
                    </h3>
                    <p className="custom-card__header__date review-card-v2__header__date">
                        {item.location && item.location}
                    </p>
                </div>
                <div className="review_from-box">
                    <Image src={GoogleIcon} alt="Google icon" />
                </div>
            </div>
        </div>
    )
}