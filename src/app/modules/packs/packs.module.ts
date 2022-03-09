import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacksRoutingModule } from './packs.routing.module';
import { PackCardComponent } from './pack-card/pack-card.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';



@NgModule({
  declarations: [
    PackCardComponent,
    PackDetailsComponent
  ],
  exports: [
    PackCardComponent
  ],
  imports: [
    CommonModule,
    PacksRoutingModule
  ]
})
export class PacksModule { }
