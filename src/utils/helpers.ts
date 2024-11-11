import axios from "axios";

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
