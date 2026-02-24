import useTranslation from "next-translate/useTranslation";

export default function QuestionsSection({secClasses}: {secClasses?: string}) {
    const { t } = useTranslation("translations");
    const questions: { question: string; answer: string }[] = t("faq.items", {}, { returnObjects: true }) as any;

    return (
        <section className={`pt-15 ${secClasses}`}>
            <div className="container">
                <h2 className="section__title text-center mb-25">
                    {t("faq.title")}
                </h2>

                <div className="accordion custom-accordion" id="accordionExample">
                    {questions && questions.map((question, questionIndex) => {
                        const collapseId = `faq_collapse_${questionIndex}`;
                        return (
                        <div className="accordion-item custom-accordion__item" key={questionIndex}>
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed custom-accordion__item__button" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`} aria-expanded="false" aria-controls={collapseId}>
                                    {question.question}
                                </button>
                            </h2>
                            <div id={collapseId} className="accordion-collapse collapse custom-accordion-collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body custom-accordion-body"
                                    dangerouslySetInnerHTML={{ __html: question.answer || '' }}
                                />
                            </div>
                        </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
