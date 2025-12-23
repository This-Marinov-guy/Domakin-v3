
import Image from "next/image";

export default function Card({item}) {
    return (
        <div className="card custom-card simple-card">
            <div className="card-img custom-card__thumbnail simple-card__thumbnail">
                <Image src={item.thumbnail_image} alt="Room Image" className="object-fit-cover w-100 h-100" />
            </div>
            <div className="card-header custom-card__header simple-card__header">
                <h3 className="card-title custom-card__header__title">
                    {item.title}
                </h3>
            </div>
            <div className="card-content custom-card__content simple-card__content">
                <p className="text-center">
                    {item.description && item.description}
                </p>
            </div>
        </div>
    )
}