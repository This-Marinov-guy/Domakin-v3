interface PropertyCard {
  id: number | string;
  hidden: boolean;
  status: string;
  price: number;
  statusCode: number;
  title: string;
  city: string;
  location: string;
  description: {
    property: string;
    period: string;
    bills: string;
    flatmates: string;
  };
  main_image: string;
  images: string[];
  folder?: string;
}
