import {array} from "yup";

export default function QuestionsSection({questions, secClasses}: {questions: array, secClasses?: string}) {
    return (
        <section className={`pt-15 ${secClasses}`}>
            <div className="container">
                <h2 className="section__title text-center mb-25">
                    Frequently Asked Questions
                </h2>

                <div class="accordion custom-accordion" id="accordionExample">
                    {questions && questions.map((question, questionIndex) =>
                        <div class="accordion-item custom-accordion__item" key={questionIndex}>
                            <h2 class="accordion-header">
                                <button class="accordion-button collapsed custom-accordion__item__button" type="button" data-bs-toggle="collapse" data-bs-target={`#${question.question?.toLowerCase().replace(/\s+/g, '_')}`} aria-expanded="true" aria-controls={question.question?.toLowerCase().replace(/\s+/g, '_')}>
                                    {question.question && question.question}
                                </button>
                            </h2>
                            <div id={question.question?.toLowerCase().replace(/\s+/g, '_')} class="accordion-collapse collapse custom-accordion-collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body custom-accordion-body"
                                    dangerouslySetInnerHTML={{ __html: question.answer }}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}