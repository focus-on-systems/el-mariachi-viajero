export interface LandingPromotion {
	id: string;
	name?: string;
	img: {
		url: string;
	};
	description: string;
	featuresIncluded: string;
	featuresExcluded?: string;
	price: string;
	validFrom: Date;
	validUntil: Date;
}
