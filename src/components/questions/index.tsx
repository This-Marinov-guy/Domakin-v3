interface Question {
    question?: string;
    answer?: string;
}

const questions = [
    {
        question: 'When do I get my €200?',
        answer: `You receive the €200 after the new tenant signs the contract and has officially moved into the room. The payment is made once everything is confirmed and there is no doubt that the tenancy has started.`
    },
    {
        question: 'Who is Domakin for?',
        answer: `Domakin is for anyone who needs to find a tenant quickly and safely. This includes:<ul class="mb-0 mt-2"><li>Students leaving the city</li><li>Students going on exchange</li><li>People switching universities</li><li>Tenants who want to sublet temporarily</li><li>Anyone who needs a smooth and secure handover</li></ul>We organize the viewings based on your criteria and you choose the most suitable candidate.`
    },
    {
        question: 'Can I sublet if I have a landlord?',
        answer: `Yes. Domakin operates as a social housing platform similar to Facebook or WhatsApp groups, but with added structure, screening, and support.<br><br>However, you must inform your landlord and have permission to sublet if your contract requires it.`
    },
    {
        question: 'Can I sublet if I rent through an agency?',
        answer: `Yes. The same rule applies. Domakin helps you find a tenant, but your agency must allow subletting according to your contract.<br><br>If subletting is not allowed in your contract, you must first get written approval.`
    },
    {
        question: 'What is the minimum sublet period?',
        answer: `The minimum sublet period is 6 months.<br><br>This ensures stability for the incoming tenant and avoids unnecessary short term turnover.`
    },
    {
        question: 'Does the room need to allow registration?',
        answer: `Yes. To list your room on Domakin, the room must allow municipal registration.<br><br>This protects both the new tenant and you, and ensures everything is legally compliant.`
    },
    {
        question: 'Can someone register at the address while I am subletting?',
        answer: `Yes. We can structure the contract so the new tenant can register at the address while subletting your room.<br><br>This can be arranged in a way that does not affect your DUO or other benefits, depending on your situation. We guide you through the correct setup.`
    },
    {
        question: 'Do I have to organize the viewings myself?',
        answer: `No. Domakin can organize and manage the viewings for you based on your preferences. You remain in control of the final decision.`
    },
    {
        question: 'How do you select tenants?',
        answer: `We pre screen candidates and only present you with serious and suitable options. You always make the final choice.`
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
                    {questions && questions.map((question, questionIndex) => {
                        const collapseId = `faq_collapse_${questionIndex}`;
                        return (
                        <div className="accordion-item custom-accordion__item" key={questionIndex}>
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed custom-accordion__item__button" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`} aria-expanded="false" aria-controls={collapseId}>
                                    {question.question && question.question}
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