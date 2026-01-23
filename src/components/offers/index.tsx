import AddressIcon from "@/assets/images/icon/address.svg";
import CardIcon from "@/assets/images/icon/card.svg";
import KVKIcon from "@/assets/images/icon/kvk.svg";
import PrivacyPolicyIcon from "@/assets/images/icon/privacy-policy.svg";
import Image from "next/image";

export default function OffersSection() {
    const offers = [
        {
            imageUrl: AddressIcon,
            detail: "We never publish <br /> your exact address"
        },
        {
            imageUrl: CardIcon,
            detail: 'Payout via Stripe'
        },
        {
            imageUrl: KVKIcon,
            detail: 'KVK 90831268'
        },
        {
            imageUrl: PrivacyPolicyIcon,
            detail: 'Terms & Policy'
        },
    ];
    return (
        <section className="offer-sec">
            <div className="container">
                <div className="offer-con d-grid">

                    {offers && offers.map((offer, offerIndex) =>
                        <div className="offer-box d-flex flex-column justify-content-center align-items-center" key={offerIndex}>
                            <div className="offer-box__header">
                                <div className="offer-box__header__icon d-flex flex-column justify-content-center align-items-center">
                                    <Image src={offer.imageUrl} alt="offer icon" />
                                </div>
                            </div>
                            <div className="offer-box__content">
                                <p dangerouslySetInnerHTML={{ __html: offer && offer.detail }}></p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    )
}