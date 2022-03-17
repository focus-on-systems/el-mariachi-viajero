import { CategoryInfo } from '../../../utils/tour-categories/CategoryInfo';
import { StateInfo } from '../../../utils/states/StateInfo';

export interface TourCardInfo {
  id: string;
  name: string;
  shortDescription: string;
  featuresIncluded?: string[];
  featuresExcluded?: string[];
  price: string;
  thumbs: { url: string }[];
  categories?: CategoryInfo[];
  state?: StateInfo;
}
