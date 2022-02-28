import {StateInfo} from "../../../utils/states/StateInfo";
import {TourCardInfo} from "../../tours/tour-card/TourCardInfo";

export interface StateCompleteInfo {
  state: StateInfo;
  // promotions: [];
  tours: TourCardInfo[];
  // packs: [];
}
