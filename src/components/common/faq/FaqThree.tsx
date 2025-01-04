"use client"
import faq_data from '@/data/home-data/FaqData';
import useTranslation from 'next-translate/useTranslation';

const FaqThree = () => {
   const {t} = useTranslation('translations'); 

   return (
     <>
       {faq_data.map((item) => (
         <div key={item.id} className="accordion-item">
           <h2 className="accordion-header">
             <button
               className={`accordion-button collapsed`}
               type="button"
               data-bs-toggle="collapse"
               data-bs-target={`#collapse${item.id}`}
               aria-expanded="true"
               aria-controls={`collapse${item.id}`}
             >
               {t(item.title)}
             </button>
           </h2>
           <div
             id={`collapse${item.id}`}
             className={`accordion-collapse collapse`}
             data-bs-parent="#accordionThree"
           >
             <div className="accordion-body">
               <p>{t(item.content)}</p>
             </div>
           </div>
         </div>
       ))}
     </>
   );
}

export default FaqThree
