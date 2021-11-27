import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from "./landing/landing/landing.component";

const routes: Routes = [
	{path: "", redirectTo: "/inicio", pathMatch: "full"},
	{path: "inicio", component: LandingComponent},
	{
		path: "nosotros",
		loadChildren: () => import("./modules/about-us/about-us.module").then(loaded => loaded.AboutUsModule)
	},
	{
		path: "tours",
		loadChildren: () => import("./modules/tours/tours.module").then(loaded => loaded.ToursModule)
	},
	{
		path: "blog",
		loadChildren: () => import("./modules/blog/blog.module").then(loaded => loaded.BlogModule)
	},
	{path: "**", redirectTo: "/inicio", pathMatch: "full"}, // 404
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		initialNavigation: 'enabled'
	})],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
