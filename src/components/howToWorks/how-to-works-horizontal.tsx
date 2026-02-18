import SimpleHorizontalCard from "@/components/card/simple-horizontal-card";
import WriteIcon from "@/assets/images/icon/write.svg";
import FavouriteIcon from "@/assets/images/icon/favourite-list.svg";
import CommissionIcon from "@/assets/images/icon/commission.svg";
import useTranslation from "next-translate/useTranslation";

export default function HowToWorksSectionHorizontal() {
    const { t } = useTranslation("translations");
    const workSteps = [
        {
            thumbnail_image: WriteIcon,
            title: t("how_to_works_lending.step1_title"),
            description: t("how_to_works_lending.step1_description"),
        },
        {
            thumbnail_image: FavouriteIcon,
            title: t("how_to_works_lending.step2_title"),
            description: t("how_to_works_lending.step2_description"),
        },
        {
            thumbnail_image: CommissionIcon,
            title: t("how_to_works_lending.step3_title"),
            description: t("how_to_works_lending.step3_description"),
        },
    ];

    return (
        <section className="how-to-works-sec-h">
            <div className="container">
                <h2 className="section__title text-center mb-25">
                    {t("how_to_works_lending.title")}
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