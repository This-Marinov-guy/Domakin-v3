import AgencyFormOne from "@/components/forms/AgencyFormOne"
import AuthModal from "@/modals/AuthModal";
import Link from "next/link";
import { useState } from "react";

const ReviewForm = () => {

   const [AuthModal, setAuthModal] = useState<boolean>(false);

   return (
      <>
         <div className="review-form">
            <h4 className="mb-20">Leave A Reply</h4>
            <p className="fs-20 lh-lg pb-15">
            <Link href="#" data-bs-toggle="modal" data-bs-target="#AuthModal"
					className="color-dark fw-500 text-decoration-underline">Sign in</Link> to post your comment or signup if you don&apos;t have any account.
            </p>

            <div className="bg-dot p-30">
               <AgencyFormOne />
            </div>
         </div>

      </>
   )
}

export default ReviewForm
