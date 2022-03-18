import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacksRoutingModule } from './packs.routing.module';
import { PackCardComponent } from './pack-card/pack-card.component';
import { PackDetailsComponent } from './pack-details/pack-details.component';
import { PacksComponent } from './packs/packs.component';
import { UtilsModule } from '../../utils/utils.module';


@NgModule({
  declarations: [
    PackCardComponent,
    PackDetailsComponent,
    PacksComponent,
  ],
  exports: [
    PackCardComponent,
    PacksComponent,
  ],
  imports: [
    CommonModule,
    PacksRoutingModule,
    UtilsModule,
  ],
})
export class PacksModule {
}
