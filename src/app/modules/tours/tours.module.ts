import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TourDetailsComponent} from "./tour-details/tour-details.component";
import {ManageToursComponent} from "./manage-tours/manage-tours.component";
import {TourItemComponent} from "./tour-item/tour-item.component";
import {ToursRoutingModule} from "./tours-routing.module";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
	declarations: [
		TourItemComponent,
		TourDetailsComponent,
		ManageToursComponent
	],
	imports: [
		ToursRoutingModule,
		CommonModule,
		MatIconModule
	]
})
export class ToursModule {
}
