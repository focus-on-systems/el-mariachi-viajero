import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import { PromotionDetailsComponent } from "./promotion-details/promotion-details.component";

const routes: Routes = [
	{path: ":promoId", component: PromotionDetailsComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PromotionsRoutingModule {
}