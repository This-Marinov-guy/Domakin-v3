import Head from "next/head";
import React from "react";

const SEO = () => {
  // TODO: make it localized
  
  return (
    <Head>
      <title>Domakin</title>
      <meta
        name="keywords"
        content="Real estate, Accommodations, Properties, Netherlands, Viewings, Students"
      />
      <meta
        name="description"
        lang="bg"
        content="Платформа за подпомагане при търсенето на квартири в Гронинген (Нидерландия) и околността. Ние можем да ви предложим да поемем огледите вместо вас, да ви свържем с наемател или да намерим човек, който да вземе вашата квартира. Нашият млад екип гарантира бърза и коректна работа с всеки клиент!"
      />
      <meta
        name="description"
        lang="gr"
        content="Πλατφόρμα για βοήθεια στην αναζήτηση διαμερισμάτων στην πόλη του Γκρόνινγκεν (Ολλανδία) και την ευρύτερη περιοχή. Προσφέρουμε τη δυνατότητα να κάνουμε τις προβολές για εσάς, να επικοινωνούμε απευθείας με τον ιδιοκτήτη ή να βρίσκουμε κάποιον για να αναλάβει το δωμάτιο/διαμέρισμά σας. Οι νέοι μας πράκτορες προσφέρουν γρήγορη και αποτελεσματική εξυπηρέτηση σε όλους τους πελάτες μας!"
      />
      <meta
        name="description"
        lang="en"
        content="Platform for helping with apartment searching the town of Groningen (the Netherlands) and the area surrounding it. We offer doing the viewings for you, directly contacting you with a landlord or finding someone to take your room/apartment. Our young agents offer fast and efficient work to all our customers!"
      />
      <meta property="og:image" content="/img/logo-2.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="robots" href="/robots.txt" />
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
    </Head>
  );
};

export default SEO;
