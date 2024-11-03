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

export function capitalizeFirstLetters(str:string) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
