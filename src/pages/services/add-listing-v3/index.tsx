import LendingPageV3 from "@/components/inner-pages/services/detail-page/LendingPageV3";
import Wrapper from "@/layouts/Wrapper";
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
})

export default function index() {
    return (
        <>
            <Wrapper>
                <LendingPageV3 className={inter.className} />
            </Wrapper>
        </>
    );
};
