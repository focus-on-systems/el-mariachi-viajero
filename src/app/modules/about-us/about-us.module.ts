import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us/about-us.component';
import { AboutUsRoutingModule } from './about-us-routing.module';

@NgModule({
  declarations: [
    AboutUsComponent,
  ],
  imports: [
    AboutUsRoutingModule,
    CommonModule,
  ],
})
export class AboutUsModule {
}
