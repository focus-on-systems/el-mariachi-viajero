import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsRoutingModule } from './promotions.routing.module';
import { PromotionCardComponent } from './promotion-card/promotion-card.component';
import { PromotionDetailsComponent } from './promotion-details/promotion-details.component';



@NgModule({
  declarations: [
    PromotionCardComponent,
    PromotionDetailsComponent
  ],
  exports: [
    PromotionCardComponent
  ],
  imports: [
    CommonModule,
    PromotionsRoutingModule
  ]
})
export class PromotionsModule { }
