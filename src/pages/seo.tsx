import Head from "next/head";
import React from "react";

const SEO = () => {
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
      {/* Bulgarian language metadata */}
      <meta
        name="keywords"
        lang="bg"
        content="Недвижими имоти, Квартири, Имоти, Нидерландия, Огледи, Студенти, Гронинген, Настаняване"
      />
      <meta
        name="description"
        lang="bg"
        content="Платформа за подпомагане при търсенето на квартири в Гронинген (Нидерландия) и околността. Ние можем да ви предложим да поемем огледите вместо вас, да ви свържем с наемател или да намерим човек, който да вземе вашата квартира. Нашият млад екип гарантира бърза и коректна работа с всеки клиент!"
      />

      {/* Greek language metadata */}
      <meta
        name="keywords"
        lang="gr"
        content="Ακίνητα, Διαμονή, Ακίνητη περιουσία, Ολλανδία, Προβολές, Φοιτητές, Γκρόνινγκεν, Στέγαση"
      />
      <meta
        name="description"
        lang="gr"
        content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στην πόλη του Γκρόνινγκεν (Ολλανδία) και την ευρύτερη περιοχή. Προσφέρουμε τη δυνατότητα να κάνουμε τις προβολές για εσάς, να επικοινωνούμε απευθείας με τον ιδιοκτήτη ή να βρίσκουμε κάποιον για να αναλάβει το δωμάτιο/διαμέρισμά σας. Οι νέοι μας πράκτορες προσφέρουν γρήγορη και αποτελεσματική εξυπηρέτηση σε όλους τους πελάτες μας!"
      />

      {/* English language metadata */}
      <meta
        name="keywords"
        lang="en"
        content="Real estate, Accommodations, Properties, Netherlands, Viewings, Students, Groningen, Housing"
      />
      <meta
        name="description"
        lang="en"
        content="Platform for helping with apartment searching the town of Groningen (the Netherlands) and the area surrounding it. We offer doing the viewings for you, directly contacting you with a landlord or finding someone to take your room/apartment. Our young agents offer fast and efficient work to all our customers!"
      />

      <meta name="author" content="Domakin Team" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* English social media metadata */}
      <meta
        name="twitter:title"
        lang="en"
        content="Domakin - Housing from students to students"
      />
      <meta
        property="twitter:description"
        lang="en"
        content="Platform for helping with apartment searching in Groningen. We offer viewings, landlord connections, and room takeovers."
      />
      <meta
        name="og:title"
        lang="en"
        content="Domakin - Housing from students to students"
      />
      <meta
        property="og:description"
        lang="en"
        content="Platform for helping with apartment searching in Groningen. We offer viewings, landlord connections, and room takeovers."
      />

      {/* Bulgarian social media metadata */}
      <meta
        name="twitter:title"
        lang="bg"
        content="Domakin - Жилища от студенти за студенти"
      />
      <meta
        property="twitter:description"
        lang="bg"
        content="Платформа за подпомагане при търсенето на квартири в Гронинген. Предлагаме огледи, връзка с наемодател и поемане на стаи."
      />
      <meta
        name="og:title"
        lang="bg"
        content="Domakin - Жилища от студенти за студенти"
      />
      <meta
        property="og:description"
        lang="bg"
        content="Платформа за подпомагане при търсенето на квартири в Гронинген. Предлагаме огледи, връзка с наемодател и поемане на стаи."
      />

      {/* Greek social media metadata */}
      <meta
        name="twitter:title"
        lang="gr"
        content="Domakin - Στέγαση από φοιτητές σε φοιτητές"
      />
      <meta
        property="twitter:description"
        lang="gr"
        content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στο Γκρόνινγκεν. Προσφέρουμε προβολές, επαφή με ιδιοκτήτες και ανάληψη δωματίων."
      />
      <meta
        name="og:title"
        lang="gr"
        content="Domakin - Στέγαση από φοιτητές σε φοιτητές"
      />
      <meta
        property="og:description"
        lang="gr"
        content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στο Γκρόνινγκεν. Προσφέρουμε προβολές, επαφή με ιδιοκτήτες και ανάληψη δωματίων."
      />

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

      {/* Ahrefs Analytics */}
      <script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="WeRz+ni4+V2fhLpfI8NdUA"
        async
      ></script>
      <meta name="ahrefs-site-verification" content="d74b891ea3ca805b070203db1f5e5ae1af10dfc42b5c611039bc4c6a0508a12b"/>
    </Head>
  );
};

export default SEO;
