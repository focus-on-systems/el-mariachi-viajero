import { CategoryInfo } from '../../../utils/tour-categories/CategoryInfo';
import { TourCardInfo } from '../tour-card/TourCardInfo';

export interface CategoryCompleteInfo {
  category: CategoryInfo;
  // promotions: [];
  tours: TourCardInfo[];
  // packs: [];
}
