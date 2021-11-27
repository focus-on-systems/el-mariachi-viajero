import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TourDetailsComponent} from "./tour-details/tour-details.component";
import {ManageToursComponent} from "./manage-tours/manage-tours.component";
import {TourItemComponent} from "./tour-item/tour-item.component";
import {ToursRoutingModule} from "./tours-routing.module";

@NgModule({
	declarations: [
		TourItemComponent,
		TourDetailsComponent,
		ManageToursComponent
	],
	imports: [
		ToursRoutingModule,
		CommonModule
	]
})
export class ToursModule {
}
