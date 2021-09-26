import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageToursComponent} from "./tours/manage-tours/manage-tours.component";

const routes: Routes = [
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
