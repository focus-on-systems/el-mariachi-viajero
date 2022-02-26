import {CategoryInfo} from "../../../utils/tour-categories/CategoryInfo";
import {TourCardInfo} from "../TourCardInfo";

export interface CategoryCompleteInfo {
  category: CategoryInfo;
  // promotions: [];
  tours: TourCardInfo[];
  // packs: [];
}
