import Card from "@/components/card/card";
import WorkImageOne from "@/assets/images/media/work-image-one.png";
import WorkImageTwo from "@/assets/images/media/work-image-two.png";
import WorkImageThree from "@/assets/images/media/work-image-three.png";

export default function QuestionsSection() {
    const questions = [
        {
            question: 'Do I choose who gets my room when I move out?',
            answer: `<strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'Can I sublet my room through Domakin?',
            answer: `<strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'Can I list my room if I originally rented it through an agency?',
            answer: `<strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'How do I receive the €200 payout?',
            answer: `<strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        },
        {
            question: 'Do I get to decide who becomes my new rommate?',
            answer: `<strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`
        }
    ];

    return (
        <section className="pt-15">
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
                                <div
                                    className="accordion-body custom-accordion-body"
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