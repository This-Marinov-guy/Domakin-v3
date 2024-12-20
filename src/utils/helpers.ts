import axios from "axios";
// import { clarity } from "react-microsoft-clarity";
import Resizer from "react-image-file-resizer";
import { LANGUAGES } from "./defines";
import setLanguage from "next-translate/setLanguage";
import { LOCAL_STORAGE_LOCATION } from "./localstorage";

export const isProd = () => {
  return process.env.NODE_ENV === "production";
};

export const getGeoInfo = async () => {
  if (!isProd()) {
    return;
  }

  try {
    const response = await axios.get("https://ipapi.co/json/");
    return response.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export function capitalizeFirstLetters(str: string) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export const handleShare = (
  platform: string,
  shareUrl: string = "domakin.nl",
  shareText: string = "Check out this page!"
) => {
  let url = "";
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  switch (platform) {
    case "WhatsApp":
      url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
      break;
    case "Facebook":
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case "LinkedIn":
      url = `https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedText}`;
      break;
    case "Instagram":
      return;
    default:
      return;
  }

  return url;
};

export const cleanFileName = (file: File) => {
  return file.name.length > 15
    ? file.name.slice(0, 15) + "..." + file.type.split("/")[1]
    : file.name;
};

export const createFileName = (index: Number) => {
  return `${index}.jpg`;
};

export const resizeFile = (file: File, width = 800, height = 800, format = "JPG") =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      format,
      100,
      0,
      (blob) => {
        // @ts-expect-error
        resolve(new File([blob], "resized-image.jpg", { type: "image/jpg" }));
      },
      "blob"
    );
  });

  export const getGeoLocation = () => {
    let location = localStorage.getItem(LOCAL_STORAGE_LOCATION) || "";

    if (location) {
      return location;
    }

    fetch(`https://ipinfo.io/json?token=${process.env.REACT_APP_GEO_TOKEN}`)
      .then((response) => response.json())
      .then((data) => {
        location = data.country;
        localStorage.setItem(LOCAL_STORAGE_LOCATION, location);
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });

    return location;
  };
