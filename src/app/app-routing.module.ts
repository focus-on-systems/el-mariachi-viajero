import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageToursComponent} from "./tours/manage-tours/manage-tours.component";
import {TourDetailsComponent} from "./tours/tour-details/tour-details.component";
import {LandingComponent} from "./landing/landing/landing.component";
import {AboutCompanyComponent} from "./about-company/about-company.component";
import {BlogComponent} from './blog-module/blog/blog.component';

const routes: Routes = [
	{path: "", redirectTo: "/inicio", pathMatch: "full"},
	{path: "inicio", component: LandingComponent},
	{path: "tours", component: ManageToursComponent},
	{path: "nosotros", component: AboutCompanyComponent},
	{path: "blog", component: BlogComponent},
	{path: ":tourId/tour-details", component: TourDetailsComponent},
	{path: "**", redirectTo: "/inicio", pathMatch: "full"}, // 404
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
