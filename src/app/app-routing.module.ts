import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageToursComponent} from "./tours/manage-tours/manage-tours.component";
import {TourDetailsComponent} from "./tours/tour-details/tour-details.component";
import {LandingComponent} from "./landing/landing/landing.component";

const routes: Routes = [
	{path: "", redirectTo: "/home", pathMatch: "full"},
	{
		path: "home",
		component: LandingComponent
	},
	
	{
		path: "tours", component: ManageToursComponent
	},
	{
		path: ":tourId/tour-details",
		component: TourDetailsComponent
	},
	{
		path: "tours", component: ManageToursComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
