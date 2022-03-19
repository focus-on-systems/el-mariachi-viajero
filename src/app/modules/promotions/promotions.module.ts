import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsRoutingModule } from './promotions.routing.module';
import { PromotionCardComponent } from './promotion-card/promotion-card.component';
import { PromotionDetailsComponent } from './promotion-details/promotion-details.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { UtilsModule } from '../../utils/utils.module';


@NgModule({
  declarations: [
    PromotionCardComponent,
    PromotionDetailsComponent,
    PromotionsComponent,
  ],
  exports: [
    PromotionCardComponent,
  ],
  imports: [
    CommonModule,
    PromotionsRoutingModule,
    UtilsModule,
  ],
})
export class PromotionsModule {
}
