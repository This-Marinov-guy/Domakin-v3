interface Question {
    question?: string;
    answer?: string;
}

const questions = [
    {
        question: 'Do I choose who gets my room when I move out?',
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
    },
    {
        question: 'Can I sublet my room through Domakin?',
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
    },
    {
        question: 'Can I list my room if I originally rented it through an agency?',
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
    },
    {
        question: 'How do I receive the €200 payout?',
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
    },
    {
        question: 'Do I get to decide who becomes my new rommate?',
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing Proin pharetra ultrices magna ac Pellentesque pellentesque dui vitae diam suscipit.`
    }
];

export default function QuestionsSection({secClasses}: {secClasses?: string}) {
    return (
        <section className={`pt-15 ${secClasses}`}>
            <div className="container">
                <h2 className="section__title text-center mb-25">
                    Frequently Asked Questions
                </h2>

                <div className="accordion custom-accordion" id="accordionExample">
                    {questions && questions.map((question, questionIndex) =>
                        <div className="accordion-item custom-accordion__item" key={questionIndex}>
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed custom-accordion__item__button" type="button" data-bs-toggle="collapse" data-bs-target={`#${question.question?.toLowerCase().replace(/\s+/g, '_')}`} aria-expanded="true" aria-controls={question.question?.toLowerCase().replace(/\s+/g, '_')}>
                                    {question.question && question.question}
                                </button>
                            </h2>
                            <div id={question.question?.toLowerCase().replace(/\s+/g, '_')} className="accordion-collapse collapse custom-accordion-collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body custom-accordion-body"
                                    dangerouslySetInnerHTML={{ __html: question.answer || '' }}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}