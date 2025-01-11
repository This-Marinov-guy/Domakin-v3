import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { handleShare } from "@/utils/helpers";

const icons = [
  { className: "fa-brands fa-whatsapp", name: "WhatsApp" },
  { className: "fa-brands fa-facebook", name: "Facebook" },
  { className: "fa-brands fa-linkedin", name: "LinkedIn" },
  { className: "fa-brands fa-instagram", name: "Instagram" },
];

const Recommendations = () => {
  const { t } = useTranslation("translations");

  return (
    <div className="blog-details border-top mt-40 mb-40">
      <div className="container">
        <div className="row gx-xl-5">
          <div className="col-lg-12">
            <div className="blog-post-meta mb-20 lg-mb-40">
              <h3 className="blog-title">
                {t("recommendations.recommended_from_domakin_nl")}
              </h3>
            </div>
          </div>
        </div>
        <div className="row gx-xl-5">
          <div className="col-lg-12">
            <article className="blog-post-meta">
              <div className="post-data pt-50 md-pt-30">
                {/* Websites start */}

                <p>{t("recommendations.team_made_list")}</p>
                <h5>{t("recommendations.websites")}</h5>
                <ul className="style-none list-item">
                  <li>
                    <a href="https://050vastgoed.nl/" target="_blank">
                      050Vastgoed
                    </a>{" "}
                    | Email: info@050vastgoed.nl
                  </li>
                  <li>
                    <a href="https://jansenverhuurenbeheer.nl/" target="_blank">
                      Jansen verhuur & beheer
                    </a>{" "}
                    | Email: hugo@jansenverhuurenbeheer.nl
                  </li>
                  <li>
                    <a href="https://www.groningsepanden.nl/" target="_blank">
                      Groningse Panden
                    </a>{" "}
                    | Email: korten@groningsepanden.nl
                  </li>
                  <li>
                    <a href="https://bultenvastgoed.nl/" target="_blank">
                      Bulten Vastgoed
                    </a>{" "}
                    | Email: info@bultenvastgoed.nl
                  </li>
                  <li>
                    <a href="https://maxxhuren.nl/" target="_blank">
                      Maxx Aanhuurmakelaars
                    </a>{" "}
                    | Email: info@maxxgroningen.nl
                  </li>
                  <li>
                    <a href="http://livresidential.nl/" target="_blank">
                      LIV residential
                    </a>{" "}
                    | Email: info@livresidential.nl
                  </li>
                  <li>
                    <a href="https://www.pandomo.nl/" target="_blank">
                      Pandomo Makelaars
                    </a>{" "}
                    | Email: info@pandomo.nl
                  </li>
                  <li>
                    <a href="https://www.vbo.nl/" target="_blank">
                      VBO Makelaar
                    </a>{" "}
                    | Email: vbo@vbo.nl
                  </li>
                  <li>
                    <a href="https://www.nijestee.nl/" target="_blank">
                      Nijestee
                    </a>{" "}
                    | Email: info@nijestee.nl
                  </li>
                  <li>
                    <a
                      href="https://www.vandermeulenmakelaars.nl/"
                      target="_blank"
                    >
                      Van Der Meulen Makelaars Groningen
                    </a>{" "}
                    | Email: Info@vandermeulenmakelaars.nl
                  </li>
                  <li>
                    <a
                      href="https://www.123wonen.nl/verhuurmakelaar/groningen"
                      target="_blank"
                    >
                      Verhuurmakelaar - 123Wonen
                    </a>{" "}
                    | Email: groningen@123wonen.nl
                  </li>
                  <li>
                    <a href="https://househunting.nl/" target="_blank">
                      House Hunting
                    </a>{" "}
                    | Email: groningen@househunting.nl
                  </li>
                  <li>
                    <a href="https://www.allooy.nl/" target="_blank">
                      Allooy
                    </a>{" "}
                    | Email: info@allooy.nl
                  </li>
                  <li>
                    <a href="https://bensverhuurenbeheer.nl" target="_blank">
                      BensverhuurenBeheer
                    </a>{" "}
                    | Email: info@bensverhuurenbeheer.nl
                  </li>
                  <li>
                    <a href="https://www.campusgroningen.com/" target="_blank">
                      Campus Groningen
                    </a>{" "}
                    | Email: info@campusgroningen.com
                  </li>
                  <li>
                    <a href="https://www.dcwonen.com/" target="_blank">
                      DC Wonen
                    </a>{" "}
                    | Email: info@dcwonen.nl
                  </li>
                  <li>
                    <a href="https://www.kpmakelaars.nl/" target="_blank">
                      K&P Makelaars
                    </a>{" "}
                    | Email: info@kpmakelaars.nl
                  </li>
                  <li>
                    <a href="https://pegasusvastgoed.nl/" target="_blank">
                      Pegasus Vastgoed
                    </a>{" "}
                    | Email: info@pegasusvastgoed.nl
                  </li>
                  <li>
                    <a href="https://kamernet.nl/en" target="_blank">
                      Kamernet
                    </a>
                  </li>
                  <li>
                    <a href="https://qrent.nl/" target="_blank">
                      QRENT
                    </a>{" "}
                    | Email: info@qrent.nl
                  </li>
                </ul>

                {/* Websites end */}

                {/* Facebook start */}
                <p> {t("recommendations.beware_of_scammers")}</p>
                <h5>Facebook</h5>
                <ul className="style-none list-item">
                  <li>
                    <a
                      href="https://www.facebook.com/groups/1403096933323844/"
                      target="_blank"
                    >
                      Groningen Housing
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/groups/400200805138484/"
                      target="_blank"
                    >
                      Groningen rooms, studios, and apartments
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/groups/1462626293842157/"
                      target="_blank"
                    >
                      Groningen International Students Accommodation & Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/groups/162781577095263/"
                      target="_blank"
                    >
                      Free Housing Announcements in Groningen (Group for
                      students)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/groups/StudentRoomsGroningen/"
                      target="_blank"
                    >
                      Student rooms Groningen
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/groups/housingingroningen/"
                      target="_blank"
                    >
                      Groningen Housing, Rooms, Apartments
                    </a>
                  </li>
                </ul>
                {/* Facebook end */}

                <p>{t("recommendations.by_domakin_nl")}</p>
                <div className="quote-wrapper">
                  <div className="row">
                    <div className="col-xxl-10 col-xl-11 col-lg-12 col-md-9 m-auto">
                      <h5>{t("recommendations.contact_for_help")}</h5>
                    </div>
                  </div>
                  <Link href="/contact" className="btn-two" target="_blank">
                    <span>{t("header.contact")}</span>{" "}
                    <i className="fa-thin fa-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
              <div className="bottom-widget d-sm-flex align-items-center justify-content-between">
                {/* <ul className="d-flex align-items-center tags style-none pt-20">
                  <li>Tag:</li>
                  <li>
                    <Link href="#">Apartments,</Link>
                  </li>
                  <li>
                    <Link href="#">loan,</Link>
                  </li>
                  <li>
                    <Link href="#">Sale</Link>
                  </li>
                </ul> */}
                <ul className="d-flex share-icon align-items-center style-none pt-20">
                  <li>Share:</li>
                  {icons.map((icon, index) => (
                    <li key={index}>
                      <a
                        href={
                          //TODO: fix the sharing
                          // handleShare(icon.name, window.location.href) ??
                           "#"
                        }
                        target="_blank"
                      >
                        <i className={icon.className}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
