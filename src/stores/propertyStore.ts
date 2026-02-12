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
    size: "",
    period: "",
    rent: "",
    bills: "",
    flatmates: "",
    bathrooms: 1,
    toilets: 1,
    registration: true,
    description: "",
    petsAllowed: false,
    smokingAllowed: false,
  },
  referralCode: "",

  terms: {
    contact: false,
    legals: false,
  },

  images: [],
};

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

  @observable editPropertyData: any = { ...defaultFormData };
  @observable editErrorFields: string[] = [];

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;

    // if (typeof window !== "undefined" && window.localStorage) {
    //   this.loadListingData();
    // }
  }

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

    this.editPropertyData = {
      id: property.id,
      approved: property.approved,
      status: property.status,
      releaseTimestamp: property.release_timestamp,
      referralCode: property.referral_code,
      is_signal: property.is_signal,
      propertyData: {
        ...property.property_data,
        bills: JSON.parse(property.property_data.bills),
        flatmates: JSON.parse(property.property_data.flatmates),
        description: JSON.parse(property.property_data.description),
        period: JSON.parse(property.property_data.period),
        title: property?.property_data?.title
          ? JSON.parse(property.property_data.title ?? "")
          : property.property_data.title,
        images: property?.property_data?.images,
      },
      newImages: [],
    };
  };

  @action
  loadListingData = () => {
    const data = localStorage.getItem("addListingData");

    if (data) {
      this.addListingData = JSON.parse(data);
    } else {
      this.addListingData = { ...defaultFormData };
    }
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

    // if (typeof window !== "undefined" && window.localStorage && key !== 'images') {
    //   localStorage.setItem(
    //     "addListingData",
    //     JSON.stringify(this.addListingData)
    //   );
    // }
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
    return {
      ...(personalData ?? {}),
      ...(propertyData ?? {}),
      flatmates: flatmatesStr,
      amenities: amenitiesStr,
      sharedSpace: sharedSpaceStr,
      terms: terms ?? { contact: false, legals: false },
      referralCode: referralCode ?? "",
      images: existingOrdered.join(","),
      new_images: newImages,
      ...(this.referenceId ? { referenceId: this.referenceId } : {}),
      ...overrides,
    };
  };

  @action
  setAddListingDataFromApplication = (data: any) => {
    if (!data || typeof data !== "object") return;
    const personalData = data.personalData ?? data.personal_data;
    const propertyData = data.propertyData ?? data.property_data;
    const terms = data.terms;
    const referralCode = data.referralCode ?? data.referral_code;
    const images = data.images;
    if (personalData) this.addListingData.personalData = { ...this.addListingData.personalData, ...personalData };
    if (propertyData) this.addListingData.propertyData = { ...this.addListingData.propertyData, ...propertyData };
    if (terms) this.addListingData.terms = { ...this.addListingData.terms, ...terms };
    if (referralCode !== undefined) this.addListingData.referralCode = referralCode;
    if (images !== undefined) this.addListingData.images = Array.isArray(images) ? images : [];
    const stepFromApi = data.current_step ?? data.step;
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
