import { LISTING_REFERENCE_ID } from "@/utils/defines";
import { isEmpty } from "lodash";
import { action, makeAutoObservable, observable, toJS } from "mobx";

const defaultFormData = {
  personalData: {
    name: "",
    surname: "",
    email: "",
    phone: "",
  },

  propertyData: {
    type: "",
    city: "",
    address: "",
    postcode: "",
    size: undefined as number | undefined,
    period: "",
    rent: undefined as number | undefined,
    bills: undefined as number | undefined,
    flatmates: "",
    bathrooms: 1,
    toilets: 1,
    registration: true,
    description: "",
    petsAllowed: false,
    smokingAllowed: false,
    deposit: undefined as number | undefined,
  },
  referralCode: "",

  terms: {
    contact: false,
    legals: false,
  },

  images: [],
};

const ADD_LISTING_DISPLAY_DEFAULTS = {
  personalData: { name: "Alex", surname: "Johnson", email: "alex.johnson@example.com", phone: "+31 6 12345678" },
  propertyData: {
    type: "room",
    city: "Amsterdam",
    address: "Jordaan 42",
    postcode: "1015 CG",
    size: 18,
    period: "6 months",
    rent: 850,
    bills: undefined as number | undefined,
    deposit: undefined as number | undefined,
    flatmates: "2",
    flatmatesMale: "1",
    flatmatesFemale: "1",
    bathrooms: "1",
    toilets: "1",
    furnishedType: 1,
    description: "Bright Room in a shared property in the heart of Jordaan.",
  },
};

const PROPERTY_TYPE_LABELS: Record<number, string> = {
  1: "Room in a shared property",
  2: "Studio",
  3: "Entire place",
  4: "Student house",
};

const FURNISHED_TYPE_LABELS: Record<number, string> = {
  1: "Fully furnished",
  2: "Semi-furnished",
  3: "None",
};

export const ADD_LISTING_PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400/e2e8f0/64748b?text=Listing+Preview";

export default class PropertyStore {
  rootStore;

  @observable propertiesListFilters: any = {};

  @observable properties: any[] = [];
  @observable userProperties: any[] = [];

  @observable propertiesLoading: boolean = false;
  @observable userPropertiesLoading: boolean = false;

  @observable addListingData: any = { ...defaultFormData };
  @observable errorFields: string[] = [];
  @observable referenceId: string | null = null;

  @observable showListRoomModal = false;
  @observable showReminderModal = false;

  /** Add-listing wizard: steps 1–6, 0-based index */
  @observable addListingCurrentStepIndex = 0;
  get addListingSteps(): number[] {
    return [1, 2, 3, 4, 5, 6];
  }
  get addListingCurrentStep(): number {
    return this.addListingSteps[this.addListingCurrentStepIndex] ?? 1;
  }
  get addListingIsLast(): boolean {
    return this.addListingCurrentStepIndex >= this.addListingSteps.length - 1;
  }

  /** Add-listing images: strings (URLs from backend) and/or File. Backend can send comma-separated string. */
  get addListingImages(): (string | File)[] {
    const raw = this.addListingData?.images;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      return raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }

  /** Plain personal data for add-listing review, with display fallbacks. */
  get addListingDisplayPersonalData(): { name: string; surname: string; email: string; phone: string } {
    const def = ADD_LISTING_DISPLAY_DEFAULTS.personalData;
    const pd = this.addListingData?.personalData;
    return {
      name: (pd?.name ?? def.name) as string,
      surname: (pd?.surname ?? def.surname) as string,
      email: (pd?.email ?? def.email) as string,
      phone: (pd?.phone ?? def.phone) as string,
    };
  }

  /** Plain property data for add-listing review. Reads each field so MobX tracks. */
  get addListingDisplayPropertyData(): Record<string, unknown> {
    const def = ADD_LISTING_DISPLAY_DEFAULTS.propertyData as Record<string, unknown>;
    const raw = this.addListingData?.propertyData;
    if (!raw) return { ...def };
    const keys = [
      "type", "city", "address", "postcode", "size", "period", "rent", "bills",
      "registration", "description", "flatmatesMale", "flatmatesFemale",
      "bathrooms", "toilets", "furnishedType", "property_type", "deposit",
    ];
    const pd: Record<string, unknown> = { ...def };
    for (const k of keys) {
      const v = (raw as Record<string, unknown>)[k];
      if (v !== undefined) pd[k] = v;
    }
    return pd;
  }

  /** Step summary strings for add-listing review (contact, basics, details). */
  get addListingStepSummaries(): { contact: string; basics: string; details: string } {
    const personal = this.addListingDisplayPersonalData;
    const pd = this.addListingDisplayPropertyData;

    const contact = [
      [personal.name, personal.surname].filter(Boolean).join(" ") || "—",
      personal.email || "—",
      personal.phone || "—",
    ].join(" · ");
    const typeNum = Number(pd.type ?? pd.property_type ?? 0);
    const typeLabel =
      typeNum && PROPERTY_TYPE_LABELS[typeNum]
        ? PROPERTY_TYPE_LABELS[typeNum]
        : pd.type != null && pd.type !== "" ? String(pd.type) : "—";
    const basics = [
      typeLabel,
      (pd.city ?? "").toString().trim() || "—",
      [pd.address, pd.postcode].filter((v) => v != null && String(v).trim() !== "").join(", ") || "—",
      pd.registration === true || pd.registration === "yes" ? "Registration possible" : "No registration",
    ].filter(Boolean).join(" · ");
    const flatmatesMale = Math.max(0, parseInt(String(pd.flatmatesMale ?? "0"), 10) || 0);
    const flatmatesFemale = Math.max(0, parseInt(String(pd.flatmatesFemale ?? "0"), 10) || 0);
    const bathrooms = Math.max(1, parseInt(String(pd.bathrooms ?? "1"), 10) || 1);
    const toilets = Math.max(1, parseInt(String(pd.toilets ?? "1"), 10) || 1);
    const depositNum = pd.deposit != null && typeof pd.deposit === "number" ? pd.deposit : (typeof pd.deposit === "string" && pd.deposit !== "" ? Math.max(0, parseInt(String(pd.deposit), 10) || 0) : undefined);
    const billsNum = pd.bills != null && typeof pd.bills === "number" ? pd.bills : (typeof pd.bills === "string" && pd.bills !== "" ? Math.max(0, parseInt(String(pd.bills), 10) || 0) : undefined);
    const details = [
      pd.rent ? `€${pd.rent}/m` : null,
      billsNum != null && billsNum >= 0 ? `Bills: €${billsNum}` : null,
      depositNum != null && depositNum >= 0 ? `Deposit in euro: €${depositNum}` : null,
      pd.size ? `${pd.size} m²` : null,
      flatmatesMale + flatmatesFemale > 0 ? `${flatmatesMale} male, ${flatmatesFemale} female flatmate(s)` : null,
      `${bathrooms} bathroom(s), ${toilets} toilet(s)`,
      pd.furnishedType != null ? (FURNISHED_TYPE_LABELS[Number(pd.furnishedType)] ?? String(pd.furnishedType)) : null,
      pd.description ? String(pd.description).slice(0, 60) + (String(pd.description).length > 60 ? "…" : "") : null,
    ].filter(Boolean).join(" · ");
    return { contact, basics, details };
  }

  /** Step panels for add-listing review (step 2–5). Pass imageUrls from component (strings + blob URLs for Files). */
  getAddListingStepPanels = (imageUrls: string[]) => {
    const summaries = this.addListingStepSummaries;
    return [
      { step: 2, title: "Contact details", summary: summaries.contact },
      { step: 3, title: "Basics", summary: summaries.basics },
      { step: 4, title: "Details", summary: summaries.details },
      { step: 5, title: "Photos", summary: "", imageUrls },
    ];
  };

  /** Preview property object for add-listing card. Pass imageUrls from component. */
  getAddListingPreviewProperty = (imageUrls: string[]) => {
    const pd = this.addListingDisplayPropertyData;
    const main = imageUrls[0] || ADD_LISTING_PLACEHOLDER_IMAGE;
    const rest = imageUrls.length > 1 ? imageUrls.slice(1) : [];
    return {
      id: 9999,
      hidden: false,
      status: "Rent",
      statusCode: 2,
      price: parseInt(String(pd?.rent ?? "0"), 10) || 0,
      title: pd?.address ? `${pd.address}${pd.city ? `, ${pd.city}` : ""}` : (pd?.city as string) || "Your listing",
      city: (pd?.city as string) || "",
      location: [pd?.address, pd?.postcode, pd?.city].filter(Boolean).join(", ") || "—",
      description: {
        property: String(pd?.description ?? "").slice(0, 120) || "—",
        period: "",
        bills: "",
        flatmates: "",
      },
      main_image: main,
      images: rest,
      folder: "",
    };
  };

  @observable editPropertyData: any = { ...defaultFormData };
  @observable editErrorFields: string[] = [];

  @observable hasNewImages: boolean = true;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;

    // if (typeof window !== "undefined" && window.localStorage) {
    //   this.loadListingData();
    // }
  }

  @action
  setHasNewImages = (hasNewImages: boolean) => {
    this.hasNewImages = hasNewImages;
  };

  @action
  setPropertiesListFilters = (filters: any) => {
    this.propertiesListFilters = filters;
  };

  @action
  loadPropertyDataForEdit = (id: any) => {
    const property = this.properties.find((property) => property.id === id);

    if (!property) return;

    this.editPropertyData = property;
  };

  @action
  setPropertyDataForEdit = (property: any) => {
    if (isEmpty(property)) return;

    const pd = property.property_data ?? {};
    const camel = (snakeKey: string, camelKey: string) => pd[camelKey] ?? pd[snakeKey];

    this.editPropertyData = {
      id: property.id,
      approved: property.approved,
      status: property.status,
      releaseTimestamp: property.release_timestamp,
      referralCode: property.referral_code,
      is_signal: property.is_signal,
      propertyData: {
        ...pd,
        type: camel("property_type", "type"),
        postcode: pd.postcode,
        size: Number(pd.size),
        rent: Number(pd.rent),
        bathrooms: pd.bathrooms,
        toilets: pd.toilets,
        furnishedType: camel("furnished_type", "furnishedType"),
        availableFrom: camel("available_from", "availableFrom"),
        availableTo: camel("available_to", "availableTo"),
        petsAllowed: pd.petsAllowed ?? pd.pets_allowed,
        smokingAllowed: pd.smokingAllowed ?? pd.smoking_allowed,
        bills: Number(pd.bills),
        deposit: Number(pd.deposit),
        flatmates: typeof pd.flatmates === "string" ? JSON.parse(pd.flatmates) : pd.flatmates,
        description: typeof pd.description === "string" ? JSON.parse(pd.description) : pd.description,
        period: typeof pd.period === "string" ? JSON.parse(pd.period) : pd.period,
        title: pd?.title != null
          ? (typeof pd.title === "string" ? JSON.parse(pd.title) : pd.title)
          : pd.title,
        images: Array.isArray(pd?.images) ? pd.images : pd?.images ? [pd.images] : [],
        amenities: (() => {
          const raw = pd.amenities;
          if (Array.isArray(raw)) return raw.map((n: unknown) => Number(n)).filter((n) => !Number.isNaN(n));
          if (typeof raw === "string") return raw.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));
          return [];
        })(),
      },
      newImages: [],
    };
  };

  @action
  loadListingData = () => {
    // TODO:Needs to be implemented but improved / divide the 2 forms to use different local storage keys and read from different objects
    // const data = localStorage.getItem("addListingData");

    // if (data) {
    //   this.addListingData = { ...defaultFormData, ...JSON.parse(data) };
    // } else {
    //   this.addListingData = { ...defaultFormData };
    // }
  };

  @action
  setProperties = (properties: any[]) => {
    this.properties = toJS(properties);
  };

  @action
  setSSRProperties = (properties: any[]) => {
    // For SSR data, set properties and ensure loading state is false
    this.properties = toJS(properties);
    this.propertiesLoading = false;
  };

  @action
  updateListingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      this.addListingData[key][nestedKey] = value;
    } else {
      this.addListingData[key] = value;
    }

    if (typeof window !== "undefined" && window.localStorage && key !== 'images') {
      localStorage.setItem(
        "addListingData",
        JSON.stringify(this.addListingData)
      );
    }
  };

  @action
  updateEditListingData = (key: string, nestedKey: string, value: any) => {
    if (nestedKey) {
      // if (!this.editPropertyData[key]) {
      //   this.editPropertyData[key] = {};
      // }

      this.editPropertyData[key][nestedKey] = value;
    } else {
      this.editPropertyData[key] = value;
    }
  };

  @action
  updateMainImage = (index: number) => {
    const mainImage = this.editPropertyData.propertyData.images[index];
    this.editPropertyData.propertyData.images = [
      mainImage,
      ...this.editPropertyData.propertyData.images.slice(0, index),
      ...this.editPropertyData.propertyData.images.slice(index + 1),
    ];
  };

  @action
  removeImage = (index: number) => {
    this.editPropertyData.propertyData.images = [
      ...this.editPropertyData.propertyData.images.slice(0, index),
      ...this.editPropertyData.propertyData.images.slice(index + 1),
    ];
  };

  @action
  addErrorFields = (fields: string[]) => {
    this.errorFields = fields;
  };

  @action
  addEditErrorFields = (fields: string[]) => {
    this.editErrorFields = fields;
  };

  @action
  resetListingData = () => {
    const globalData = {
      name: this.addListingData.personalData.name,
      surname: this.addListingData.personalData.surname,
      email: this.addListingData.personalData.email,
      phone: this.addListingData.personalData.phone,
      referralCode: this.addListingData.referralCode,
    };

    this.addListingData = { ...defaultFormData, ...globalData };
    this.addListingCurrentStepIndex = 0;

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("addListingData");
    }
  };

  @action
  setListingLoading = (loading: boolean) => {
    this.propertiesLoading = loading;
  };

  @action
  setReferralCode = (code: string) => {
    this.addListingData.referralCode = code;
  };

  @action
  setReferenceId = (id: string | null) => {
    this.referenceId = id;

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(LISTING_REFERENCE_ID, id ?? "");
    }
  };

  @action
  setShowListRoomModal = (show: boolean) => {
    this.showListRoomModal = show;
  };

  @action
  setShowReminderModal = (show: boolean) => {
    this.showReminderModal = show;
  };

  @action
  nextAddListingStep = () => {
    if (this.addListingCurrentStepIndex < this.addListingSteps.length - 1) {
      this.addListingCurrentStepIndex += 1;
    }
  };

  @action
  backAddListingStep = () => {
    if (this.addListingCurrentStepIndex > 0) {
      this.addListingCurrentStepIndex -= 1;
    }
  };

  @action
  goToAddListingStep = (index: number) => {
    if (index >= 0 && index < this.addListingSteps.length) {
      this.addListingCurrentStepIndex = index;
    }
  };

  /**
   * Reset list-room modal to start over: clear form data, set step to 1, clear reference and errors.
   */
  resetListRoomModal = (withReferenceId: boolean = true) => {
    this.addListingData = { ...defaultFormData };
    this.addListingCurrentStepIndex = 0;
    this.errorFields = [];
    this.referenceId = null;
    this.showListRoomModal = false;

    if (withReferenceId && typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(LISTING_REFERENCE_ID);
    }
  };

  /**
   * Build payload for listing-application API (validate or save).
   * Uses current addListingData and referenceId; optional overrides (e.g. step, email) are merged in.
   */
  getListingApplicationPayload = (overrides: { step?: number; email?: string } = {}) => {
    const { personalData, propertyData, terms, referralCode, images } = this.addListingData ?? {};
    const rawImages = images ?? [];
    const existingOrdered = rawImages.filter((item: unknown) => typeof item === "string") as string[];
    const newImages = rawImages.filter((item: unknown) => item instanceof File) as File[];
    const amenitiesStr =
      Array.isArray(propertyData?.amenities)
        ? (propertyData.amenities as number[]).join(",")
        : (propertyData?.amenities != null ? String(propertyData.amenities) : "");
    const sharedSpaceStr =
      Array.isArray(propertyData?.sharedSpace)
        ? (propertyData.sharedSpace as number[]).join(",")
        : (propertyData?.sharedSpace != null ? String(propertyData.sharedSpace) : "");
    const males = Math.max(0, parseInt(String(propertyData?.flatmatesMale ?? "0"), 10) || 0);
    const females = Math.max(0, parseInt(String(propertyData?.flatmatesFemale ?? "0"), 10) || 0);
    const flatmatesStr = `${males},${females}`;

    const deposit = Number(propertyData?.deposit) || 0;
    const bills = Number(propertyData?.bills) || 0;
    const size = Number(propertyData?.size) || 0;
    const rent = Number(propertyData?.rent) || 0;

    const payload: Record<string, unknown> = {
      ...(personalData ?? {}),
      ...(propertyData ?? {}),
      flatmates: flatmatesStr,
      amenities: amenitiesStr,
      sharedSpace: sharedSpaceStr,
      terms: terms ?? { contact: false, legals: false },
      referralCode: referralCode ?? "",
      images: existingOrdered.join(","),
      new_images: newImages,
      deposit: deposit,
      bills: bills,
      size: size,
      rent: rent,
      ...(this.referenceId ? { referenceId: this.referenceId } : {}),
      ...overrides,
    };
    delete payload.independent;
    return payload;
  };

  /**
   * Hydrate add-listing form from API response. Supports flat data shape:
   * { name, surname, email, phone, city, address, postcode, size, rent, bills, flatmates, type, images, ... }
   * Also accepts nested personalData / propertyData if present.
   */
  @action
  setAddListingDataFromApplication = (data: any) => {
    if (!data || typeof data !== "object") return;

    const flat = data;
    const nestedPersonal = data.personalData ?? data.personal_data;
    const nestedProperty = data.propertyData ?? data.property_data;

    this.addListingData.personalData = {
      ...this.addListingData.personalData,
      ...(nestedPersonal ?? {}),
      name: flat.name ?? nestedPersonal?.name ?? this.addListingData.personalData.name,
      surname: flat.surname ?? nestedPersonal?.surname ?? this.addListingData.personalData.surname,
      email: flat.email ?? nestedPersonal?.email ?? this.addListingData.personalData.email,
      phone: flat.phone ?? nestedPersonal?.phone ?? this.addListingData.personalData.phone,
    };

    const flatmatesStr = flat.flatmates ?? nestedProperty?.flatmates;
    const flatmatesParts =
      typeof flatmatesStr === "string"
        ? flatmatesStr.split(",").map((s) => String(parseInt(s.trim(), 10) || 0))
        : [];
    const flatmatesMale = flatmatesParts[0] ?? nestedProperty?.flatmatesMale ?? "";
    const flatmatesFemale = flatmatesParts[1] ?? nestedProperty?.flatmatesFemale ?? "";
    const amenitiesVal = flat.amenities ?? nestedProperty?.amenities;
    const amenitiesArr =
      typeof amenitiesVal === "string"
        ? amenitiesVal.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n))
        : Array.isArray(amenitiesVal)
          ? amenitiesVal
          : nestedProperty?.amenities;
    const sharedSpaceVal = flat.shared_space ?? nestedProperty?.sharedSpace ?? nestedProperty?.shared_space;
    const sharedSpaceArr =
      typeof sharedSpaceVal === "string"
        ? sharedSpaceVal.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n))
        : Array.isArray(sharedSpaceVal)
          ? sharedSpaceVal
          : nestedProperty?.sharedSpace;

    this.addListingData.propertyData = {
      ...this.addListingData.propertyData,
      ...(nestedProperty ?? {}),
      type: flat.type ?? nestedProperty?.type ?? this.addListingData.propertyData.type,
      city: flat.city ?? nestedProperty?.city ?? this.addListingData.propertyData.city,
      address: flat.address ?? nestedProperty?.address ?? this.addListingData.propertyData.address,
      postcode: flat.postcode ?? nestedProperty?.postcode ?? this.addListingData.propertyData.postcode,
      size: Number(flat.size ?? nestedProperty?.size ?? this.addListingData.propertyData.size),
      period: flat.period ?? nestedProperty?.period ?? this.addListingData.propertyData.period,
      rent: Number(flat.rent ?? nestedProperty?.rent ?? this.addListingData.propertyData.rent),
      bills: Number(flat.bills ?? nestedProperty?.bills ?? this.addListingData.propertyData.bills),
      deposit: Number(flat.deposit ?? nestedProperty?.deposit ?? this.addListingData.propertyData.deposit),
      registration: flat.registration ?? nestedProperty?.registration ?? this.addListingData.propertyData.registration,
      description: flat.description ?? nestedProperty?.description ?? this.addListingData.propertyData.description,
      flatmatesMale: flatmatesMale !== undefined && flatmatesMale !== "" ? flatmatesMale : (nestedProperty?.flatmatesMale ?? this.addListingData.propertyData.flatmatesMale ?? ""),
      flatmatesFemale: flatmatesFemale !== undefined && flatmatesFemale !== "" ? flatmatesFemale : (nestedProperty?.flatmatesFemale ?? this.addListingData.propertyData.flatmatesFemale ?? ""),
      bathrooms: flat.bathrooms ?? nestedProperty?.bathrooms ?? this.addListingData.propertyData.bathrooms,
      toilets: flat.toilets ?? nestedProperty?.toilets ?? this.addListingData.propertyData.toilets,
      furnishedType: flat.furnished_type ?? nestedProperty?.furnishedType ?? nestedProperty?.furnished_type ?? this.addListingData.propertyData.furnishedType,
      availableFrom: flat.available_from ?? nestedProperty?.availableFrom ?? nestedProperty?.available_from ?? this.addListingData.propertyData.availableFrom,
      availableTo: flat.available_to ?? nestedProperty?.availableTo ?? nestedProperty?.available_to ?? this.addListingData.propertyData.availableTo,
      petsAllowed: flat.pets_allowed ?? nestedProperty?.petsAllowed ?? nestedProperty?.pets_allowed ?? this.addListingData.propertyData.petsAllowed,
      smokingAllowed: flat.smoking_allowed ?? nestedProperty?.smokingAllowed ?? nestedProperty?.smoking_allowed ?? this.addListingData.propertyData.smokingAllowed,
      ...(amenitiesArr != null ? { amenities: amenitiesArr } : {}),
      ...(sharedSpaceArr != null ? { sharedSpace: sharedSpaceArr } : {}),
    };

    if (data.terms) this.addListingData.terms = { ...this.addListingData.terms, ...data.terms };
    if (data.referralCode !== undefined || data.referral_code !== undefined) {
      this.addListingData.referralCode = data.referralCode ?? data.referral_code ?? "";
    }

    const images = flat.images;
    if (images !== undefined) {
      this.addListingData.images = Array.isArray(images)
        ? images
        : typeof images === "string"
          ? images.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
    }

    if (flat.reference_id != null) this.setReferenceId(flat.reference_id);

    const stepFromApi = flat.current_step ?? flat.step;
    if (stepFromApi != null) {
      const stepIndex = Math.max(0, Math.min(Number(stepFromApi) - 1, this.addListingSteps.length - 1));
      this.addListingCurrentStepIndex = stepIndex;
    }
  };

  @action
  setUserProperties = (properties: any[]) => {
    this.userProperties = properties;
  };

  @action
  setUserPropertiesLoading = (loading: boolean) => {
    this.userPropertiesLoading = loading;
  };

  @action
  statusLabel = (statusCode: Number) => {
    switch (statusCode) {
      case 1:
        return "Pending";
      case 2:
        return "Active";
      case 3:
        return "Taken";
      case 4:
        return "Declined";
      // TODO: think of better name for this status
      default:
        return "Pending";
    }
  };
}
