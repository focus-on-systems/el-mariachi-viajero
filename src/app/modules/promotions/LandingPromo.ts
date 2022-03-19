export interface LandingPromo {
  id: string;
  name?: string;
  img: {
    url: string;
  };
  description: string;
  shortDescription: string;
  featuresIncluded: string;
  featuresExcluded?: string;
  price: string;
  validFrom: Date;
  validUntil: Date;
}
