import SimpleHorizontalCard from "@/components/card/simple-horizontal-card";
import WriteIcon from "@/assets/images/icon/write.svg";
import FavouriteIcon from "@/assets/images/icon/favourite-list.svg";
import CommissionIcon from "@/assets/images/icon/commission.svg";

export default function HowToWorksSectionHorizontal() {
    const workSteps = [
        {
            thumbnail_image: WriteIcon,
            title: '1. Add room details',
            description: 'Add a description and photos of the room and common areas.'
        },
        {
            thumbnail_image: FavouriteIcon,
            title: '2. Pick your tenant',
            description: 'Receive a list of high quality candidates and choose the new tenant.'
        },
        {
            thumbnail_image: CommissionIcon,
            title: '3. Receive your commission',
            description: 'Receive €200 once the new tenant signs the contract.'
        }
    ];

    return (
        <section className="how-to-works-sec-h">
            <div className="container">
                <h2 className="section__title text-center mb-25">
                    How does it work?
                </h2>

                <div className="d-flex flex-column flex-lg-row gap-2">
                    {workSteps && workSteps.map((step, stepIndex) =>
                        <SimpleHorizontalCard item={step} key={stepIndex} />
                    )}
                </div>

            </div>
        </section>
    )
}