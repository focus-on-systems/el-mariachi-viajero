import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionDetailsComponent } from './promotion-details/promotion-details.component';
import { PromotionsComponent } from './promotions/promotions.component';

const routes: Routes = [
  { path: '', component: PromotionsComponent },
  { path: ':promoId', component: PromotionDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsRoutingModule {
}
