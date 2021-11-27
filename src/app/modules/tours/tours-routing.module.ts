import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ManageToursComponent} from "./manage-tours/manage-tours.component";
import {TourDetailsComponent} from "./tour-details/tour-details.component";

const routes: Routes = [
	{path: "", component: ManageToursComponent},
	{path: ":tourId", component: TourDetailsComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ToursRoutingModule {
}
