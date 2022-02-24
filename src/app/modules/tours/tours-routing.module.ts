import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TourDetailsComponent} from "./tour-details/tour-details.component";
import {ToursComponent} from "./tours/tours.component";

const routes: Routes = [
	{path: "", component: ToursComponent},
	{path: ":tourId", component: TourDetailsComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ToursRoutingModule {
}
