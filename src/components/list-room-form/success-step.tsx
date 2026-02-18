
import logoTransparentWhite from "@/assets/img/logo.png";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

export default function SuccessStep() {
    const { t } = useTranslation("translations");
    return (
        <div className="list-room-modal__first-step pt-25">
            <div className="list-room-modal__first-step__body d-flex flex-column justify-content-center">
                <h2 className="text-center pb-25">
                    {t("list_room_steps.success.title")}
                </h2>
                <div className="list-room-modal__first-step__header justify-content-center">
                    <Image src={logoTransparentWhite} alt="Logo Icon" />
                </div>
                <h3 className="text-center">
                    <Trans
                        i18nKey="translations:list_room_steps.success.message"
                        components={{ br: <br /> }}
                    />
                </h3>
                <p className="text-center">
                    {t("list_room_steps.success.contact_intro")} <br />
                    <strong>
                        list-my-room@domakin.nl
                    </strong>
                    <br />
                    {t("list_room_steps.success.or_at")}
                    <strong>
                        (+31) 085 083 5000
                    </strong>
                </p>
                <p className="text-center">
                    {t("list_room_steps.success.tips")}
                </p>

                <button type="button" className="btn btn-primary border-0 btn-draft" data-bs-dismiss="modal">
                    {t("common.exit")}
                </button>
            </div>
        </div>
    )
}