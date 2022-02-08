import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LocationsRoutingModule} from "./locations-routing.module";
import { PlaceComponent } from './place/place.component';
import { StateComponent } from './state/state.component';
import {UtilsModule} from "../../utils/utils.module";
import {LocationsComponent} from "./locations/locations.component";

@NgModule({
  declarations: [
    PlaceComponent,
    StateComponent,
    LocationsComponent
  ],
  imports: [
    LocationsRoutingModule,
    CommonModule,
    UtilsModule,
  ]
})
export class LocationsModule { }
