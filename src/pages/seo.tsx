import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import { LANGUAGES } from "@/utils/defines";
import useTranslation from "next-translate/useTranslation";

const SEO = () => {
  const router = useRouter();
  // Use Next.js' built-in locale first; fall back to path prefix
  const { lang } = useTranslation();

  let currentLang = router.locale || lang || "en";

  // Ensure Bulgarian/Greek are respected both on server and client
  const path = router.asPath || "";
  if (path.startsWith('/bg')) currentLang = 'bg';
  if (path.startsWith('/gr')) currentLang = 'gr';
  // Localized structured data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.domakin.nl",
    name: [
      {
        "@language": "en",
        "@value": "Domakin - Housing from students to students"
      },
      {
        "@language": "bg",
        "@value": "Domakin - Жилища от студенти за студенти"
      },
      {
        "@language": "el", // ISO code for Greek
        "@value": "Domakin - Στέγαση από φοιτητές σε φοιτητές"
      }
    ],
    description: [
      {
        "@language": "en",
        "@value": "Platform for helping with apartment searching in Groningen, Netherlands. We offer viewings, landlord connections, and room takeovers."
      },
      {
        "@language": "bg",
        "@value": "Платформа за подпомагане при търсенето на квартири в Гронинген, Нидерландия. Предлагаме огледи, връзка с наемодател и поемане на стаи."
      },
      {
        "@language": "el", // ISO code for Greek
        "@value": "Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στο Γκρόνινγκεν, Ολλανδία. Προσφέρουμε προβολές, επαφή με ιδιοκτήτες και ανάληψη δωματίων."
      }
    ],
    image: "https://www.domakin.nl/assets/img/logo-2.png",
  };

  return (
    <Head>
      <title>Domakin</title>
      {/* Primary description and keywords based on current language */}
      {currentLang === "en" && (
        <>
          <meta
            name="keywords"
            content="Real estate, Accommodations, Properties, Netherlands, Viewings, Students, Groningen, Housing"
          />
          <meta
            name="description"
            content="Platform for helping with apartment searching the town of Groningen (the Netherlands) and the area surrounding it. We offer doing the viewings for you, directly contacting you with a landlord or finding someone to take your room/apartment. Our young agents offer fast and efficient work to all our customers!"
          />
        </>
      )}
      
      {currentLang === "bg" && (
        <>
          <meta
            name="keywords"
            content="Недвижими имоти, Квартири, Имоти, Нидерландия, Огледи, Студенти, Гронинген, Настаняване"
          />
          <meta
            name="description"
            content="Платформа за подпомагане при търсенето на квартири в Гронинген (Нидерландия) и околността. Ние можем да ви предложим да поемем огледите вместо вас, да ви свържем с наемател или да намерим човек, който да вземе вашата квартира. Нашият млад екип гарантира бърза и коректна работа с всеки клиент!"
          />
        </>
      )}
      
      {currentLang === "gr" && (
        <>
          <meta
            name="keywords"
            content="Ακίνητα, Διαμονή, Ακίνητη περιουσία, Ολλανδία, Προβολές, Φοιτητές, Γκρόνινγκεν, Στέγαση"
          />
          <meta
            name="description"
            content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στην πόλη του Γκρόνινγκεν (Ολλανδία) και την ευρύτερη περιοχή. Προσφέρουμε τη δυνατότητα να κάνουμε τις προβολές για εσάς, να επικοινωνούμε απευθείας με τον ιδιοκτήτη ή να βρίσκουμε κάποιον για να αναλάβει το δωμάτιο/διαμέρισμά σας. Οι νέοι μας πράκτορες προσφέρουν γρήγορη και αποτελεσματική εξυπηρέτηση σε όλους τους πελάτες μας!"
          />
        </>
      )}
      
      {/* Alternative language versions for SEO (hidden from most user agents) */}
      <meta name="description:en" content="Platform for helping with apartment searching the town of Groningen (the Netherlands) and the area surrounding it. We offer doing the viewings for you, directly contacting you with a landlord or finding someone to take your room/apartment." />
      <meta name="description:bg" content="Платформа за подпомагане при търсенето на квартири в Гронинген (Нидерландия) и околността. Ние можем да ви предложим да поемем огледите вместо вас, да ви свържем с наемател или да намерим човек, който да вземе вашата квартира." />
      <meta name="description:gr" content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στην πόλη του Γκρόνινγκεν (Ολλανδία) και την ευρύτερη περιοχή. Προσφέρουμε τη δυνατότητα να κάνουμε τις προβολές για εσάς, να επικοινωνούμε απευθείας με τον ιδιοκτήτη." />

      <meta name="author" content="Domakin Team" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Primary social media metadata based on current language */}
      {currentLang === "en" && (
        <>
          <meta
            name="twitter:title"
            content="Domakin - Housing from students to students"
          />
          <meta
            property="twitter:description" 
            content="Platform for helping with apartment searching in Groningen. We offer viewings, landlord connections, and room takeovers."
          />
          <meta
            name="og:title"
            content="Domakin - Housing from students to students"
          />
          <meta
            property="og:description"
            content="Platform for helping with apartment searching in Groningen. We offer viewings, landlord connections, and room takeovers."
          />
        </>
      )}
      
      {currentLang === "bg" && (
        <>
          <meta
            name="twitter:title"
            content="Domakin - Жилища от студенти за студенти"
          />
          <meta
            property="twitter:description"
            content="Платформа за подпомагане при търсенето на квартири в Гронинген. Предлагаме огледи, връзка с наемодател и поемане на стаи."
          />
          <meta
            name="og:title"
            content="Domakin - Жилища от студенти за студенти"
          />
          <meta
            property="og:description"
            content="Платформа за подпомагане при търсенето на квартири в Гронинген. Предлагаме огледи, връзка с наемодател и поемане на стаи."
          />
        </>
      )}
      
      {currentLang === "gr" && (
        <>
          <meta
            name="twitter:title"
            content="Domakin - Στέγαση από φοιτητές σε φοιτητές"
          />
          <meta
            property="twitter:description"
            content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στο Γκρόνινγκεν. Προσφέρουμε προβολές, επαφή με ιδιοκτήτες και ανάληψη δωματίων."
          />
          <meta
            name="og:title"
            content="Domakin - Στέγαση από φοιτητές σε φοιτητές"
          />
          <meta
            property="og:description"
            content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στο Γκρόνινγκεν. Προσφέρουμε προβολές, επαφή με ιδιοκτήτες και ανάληψη δωματίων."
          />
        </>
      )}

      {/* Alternative language versions (hidden from most user agents but helpful for SEO) */}
      <meta name="twitter:title:en" content="Domakin - Housing from students to students" />
      <meta name="twitter:title:bg" content="Domakin - Жилища от студенти за студенти" />
      <meta name="twitter:title:gr" content="Domakin - Στέγαση από φοιτητές σε φοιτητές" />
      
      {/* Common social media properties */}
      <meta name="twitter:image" content="./assets/img/logo-2.png" />
      <meta name="twitter:card" content="./assets/img/logo-2.png" />
      <meta property="og:image" content="./assets/img/logo-2.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.domakin.nl" />

      <meta property="al:ios:url" content="https://www.domakin.nl" />
      <meta property="al:ios:app_name" content="Domakin" />
      <meta name="apple-mobile-web-app-title" content="Domakin" />
      <link rel="apple-touch-icon" href="./assets/img/logo-2.png"></link>

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="./favicon.ico" type="image/x-icon" />
      <link rel="manifest" href="./manifest.json" />
      <link rel="robots" href="./robots.txt" />
      <link rel="alternate" type="application/rss+xml" title="Domakin Blog RSS Feed" href="/api/v1/blog/rss.xml" />
      {/* For IE  */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      {/* Chrome, Firefox OS and Opera */}
      <meta name="theme-color" content="#0D1A1C" />
      {/* Windows Phone */}
      <meta name="msapplication-navbutton-color" content="#0D1A1C" />
      {/* iOS Safari */}
      <meta name="apple-mobile-web-app-status-bar-style" content="#0D1A1C" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap"
      />

      {/* Language alternate links - dynamically generated based on current path */}
      {(() => {
        // Get current path without language prefix
        const path = router.asPath;
        const pathWithoutLang = path.replace(/^\/[a-z]{2}($|\/)/, '/');
        const canonicalPath = pathWithoutLang === '/' ? '' : pathWithoutLang;
        
        return (
          <>
            <link rel="alternate" href={`https://www.domakin.nl${canonicalPath}`} hrefLang="x-default" />
            <link rel="alternate" href={`https://www.domakin.nl${canonicalPath}`} hrefLang="en" />
            <link rel="alternate" href={`https://www.domakin.nl/bg${canonicalPath}`} hrefLang="bg" />
            <link rel="alternate" href={`https://www.domakin.nl/gr${canonicalPath}`} hrefLang="el" />
          </>
        );
      })()}
    </Head>
  );
};

export default SEO;
