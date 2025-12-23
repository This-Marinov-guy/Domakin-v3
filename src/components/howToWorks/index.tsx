import Card from "@/components/card/card";
import Link from "next/link";
import WorkImageOne from "@/assets/images/media/work-image-one.png";
import WorkImageTwo from "@/assets/images/media/work-image-two.png";
import WorkImageThree from "@/assets/images/media/work-image-three.png";

export default function HowToWorksSection() {
    const workSteps = [
        {
            thumbnail_image: WorkImageOne,
            title: 'Add Room Details',
            description: 'Add a description and photos of the room and common areas.'
        },
        {
            thumbnail_image: WorkImageTwo,
            title: 'Pick Your Tenant',
            description: 'Receive a list of high quality candidates and choose the new tenant.'
        },
        {
            thumbnail_image: WorkImageThree,
            title: 'Receive Your Commission',
            description: 'Receive €200 once the new tenant signs the contract.'
        }
    ];

    return (
        <section className="pt-15">
            <div className="container">
                <h2 className="section__title text-center mb-25">
                    How does it work?
                </h2>

                <div className="d-flex flex-column flex-lg-row mb-3 gap-2">
                    {workSteps && workSteps.map((step, stepIndex) =>
                        <Card item={step} key={stepIndex} />
                    )}
                </div>

                <Link href="#" className="custom-card__footer__btn btn btn-lg btn-warning w-100 mb-2">
                    List My Room
                </Link>

                <p className="mt-1 mb-3 text-center opacity-50">
                    Most rooms get filled in <span> 4 days </span>
                </p>
            </div>
        </section>
    )
}