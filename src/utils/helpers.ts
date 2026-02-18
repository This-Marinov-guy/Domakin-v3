import axios from "axios";
// import { clarity } from "react-microsoft-clarity";
import Resizer from "react-image-file-resizer";
import { ENV_PROD, LANGUAGES } from "./defines";
import { LOCAL_STORAGE_LOCATION } from "./localstorage";
import { toast, ToastContent, ToastOptions } from "react-toastify";
import { SERVER_ENDPOINT } from "./config";

export const getGeoInfo = async () => {
  if (!ENV_PROD) {
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

export const turnDecimalToInteger = (value: number | string | null) => {
  if (value && !Number.isInteger(Number(value))) {
    return Math.round(Number(value));
  }

  return value;
};

export function capitalizeFirstLetter(str: string) {
  if (!str) {
    return '-';
  } 

  const words = str.toString().split(" ");
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();

  return words.join(" ");
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

export const resizeFile = async (
  file: File,
  width = 800,
  height = 800,
  format = "JPG",
  withOriginalName = true
): Promise<File> => {
  // Only run in the browser
  if (typeof window === "undefined") {
    return file;
  }

  // Normalize extension and mimetype for detection
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  const isHeicOrHeif =
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif") ||
    fileName.endsWith(".HEIF") ||
    fileName.endsWith(".HEIC");

  if (isHeicOrHeif) {
    try {
      const heic2any = (await import("heic2any")).default;
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      const jpegBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      const jpegFile = new File(
        [jpegBlob],
        (file.name.replace(/\.(heic|heif)$/i, "") || "converted") + ".jpg",
        { type: "image/jpeg" }
      );
      return await resizeFile(jpegFile, width, height, format, withOriginalName);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      Resizer.imageFileResizer(
        file,
        width,
        height,
        format,
        100,
        0,
        (blob) => {
          resolve(
            new File(
              // @ts-expect-error
              [blob],
              withOriginalName ? file.name.slice(0, 20) : "resized-image.jpg",
              { type: "image/jpg" }
            )
          );
        },
        "blob"
      );
    } else {
      resolve(file);
    }
  });
};

export const getGeoLocation = () => {
  let location = "";

  if (typeof window !== "undefined" && window.localStorage) {
    location = localStorage.getItem(LOCAL_STORAGE_LOCATION) ?? "";
  }

  if (location) {
    return location;
  }

  fetch(`https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_GEO_TOKEN}`)
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

/**
 * Converts a camelCase or PascalCase string to snake_case
 */
const toSnakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
};

/**
 * Recursively converts nested keys in an object to snake_case, but keeps top-level keys unchanged
 */
const convertNestedKeysToSnakeCase = (obj: any, isTopLevel: boolean = true): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof File) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertNestedKeysToSnakeCase(item, false));
  }

  if (typeof obj === "object") {
    const converted: any = {};
    for (const key in obj) {
      // Only convert keys if we're not at the top level
      const finalKey = isTopLevel ? key : toSnakeCase(key);
      converted[finalKey] = convertNestedKeysToSnakeCase(obj[key], false);
    }
    return converted;
  }

  return obj;
};

export const transformToFormData = (data: any, options?: { toSnakeCase?: boolean }) => {
  const formData = new FormData();
  const shouldConvertToSnakeCase = options?.toSnakeCase ?? false;

  // Convert nested keys to snake_case if option is enabled
  const processedData = shouldConvertToSnakeCase ? convertNestedKeysToSnakeCase(data, true) : data;

  for (const key in processedData) {
    if (processedData[key] instanceof File) {
      formData.append(key, processedData[key]);
    } else if (Array.isArray(processedData[key])) {
      processedData[key].forEach((element: any, index) => {
        formData.append(`${key}[${index}]`, element);
      });
    } else if (typeof processedData[key] === "object" && processedData[key] !== null) {
      formData.append(key, JSON.stringify(processedData[key]));
    } else {
      formData.append(key, processedData[key]);
    }
  }

  return formData;
};

export const getCookie = (name: any) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();

    if (part) {
      return part.split(";").shift();
    }
  }
  return null;
};

export const csrf = async () => {
  const sessionCookie = getCookie(process.env.NEXT_PUBLIC_SESSION_ID);  

  if (sessionCookie) {
    return sessionCookie;
  }

  try {
    await axios.get(SERVER_ENDPOINT + "/sanctum/csrf-cookie");
    const sessionCookie = getCookie(process.env.NEXT_PUBLIC_SESSION_ID);
    return sessionCookie;
  } catch (err) {
    //do nothing;
  }
};

export const replaceSpacesWithNewlines = (inputString: string) => {
  return inputString.replace(/\n/g, " ");
};

export function isTodayInRange(start: string, end: string) {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Parse the start and end dates
  const [startMonth, startDay] = start.split("-").map(Number);
  const [endMonth, endDay] = end.split("-").map(Number);

  // Create Date objects for the start and end dates
  const startDate = new Date(currentYear, startMonth - 1, startDay); // Months are 0-based
  let endDate = new Date(currentYear, endMonth - 1, endDay);

  // If the end date is in the next year, adjust it
  if (endMonth < startMonth || (endMonth === startMonth && endDay < startDay)) {
    endDate = new Date(currentYear + 1, endMonth - 1, endDay);
  }

  // Adjust today's date if it's in the range crossing year boundary
  const adjustedToday =
    today >= startDate
      ? today
      : new Date(currentYear + 1, today.getMonth(), today.getDate());

  // Check if today's date is within the range
  return adjustedToday >= startDate && adjustedToday <= endDate;
}

export const showGeneralError = (error = "Something went wrong!") => {
  toast.error(error as ToastContent, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const showGeneralSuccess = (message = "Operation was successful") => {
  toast.success(message as ToastContent, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

type ToastType = "info" | "success" | "warning" | "error" | "default";

export const showStandardNotification = (
  type: ToastType,
  message: ToastContent,
  options: ToastOptions = {}
) => {
  (toast as any)[type](message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: options?.theme ?? "colored",
    ...options,
  } as ToastOptions);
};

export const prefillUserInfo = (callback: Function, user: any | null) => {
  if (!user) {
    return;
  }

  callback("name", "", user.name.split(" ")[0] ?? "");
  callback("surname", "", user.name.split(" ")[1] ?? "-");
  callback("email", "", user.email ?? "");

  // or else we will set the code to null
  if (user.phone) {
    callback("phone", "", user.phone ?? "");
  }
};

export const prefillNestedUserInfo = (
  key: string,
  callback: Function,
  user: any | null
) => {
  if (!user) {
    return;
  }

  callback(key, "name", user.name.split(" ")[0] ?? "");
  callback(key, "surname", user.name.split(" ")[1] ?? "");
  callback(key, "email", user.email ?? "");

  // or else we will set the code to null
  if (user.phone) {
    callback(key, "phone", user.phone ?? "");
  }
};

export const snakeToCamelCase = (str: string) => {
  return str
    .toLowerCase() // Convert the string to lowercase
    .replace(/_./g, (match) => match.charAt(1).toUpperCase()); // Capitalize characters after underscores
};

export const convertKeysToCamelCase = (obj: any) => {
  const newObj: { [key: string]: any } = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = snakeToCamelCase(key);
      newObj[camelKey] = obj[key];
    }
  }

  return newObj;
};

export const removeProtocolFromLink = (link: string) => {
  return link.replace(/^https?:\/\//, "");
};

export const formatJsonKeyValuePairs = (jsonString: string, onlyValues: string[] | undefined = undefined): string => {
  if (!jsonString) {
    return "-";
  }

  const json = JSON.parse(jsonString);

  const filteredJson = Object.entries(json)
    .filter(([key]) => onlyValues ? onlyValues.includes(key) : true);

    if (filteredJson.length === 1) {
      return String(filteredJson[0][1] ?? "-"); // return the value only if 1 key is provided
    }

  return filteredJson.map(([key, value]) => `${key}: ${value}`).join(" | ");
};

export const parsePropertyPreviewData = (property: any) => {
  return {
    ...property.personal_data,
    ...property.property_data,
  };
};