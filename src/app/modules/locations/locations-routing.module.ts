import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LocationsComponent} from "./locations/locations.component";
import {StateComponent} from "./state/state.component";
import {PlaceComponent} from "./place/place.component";

const routes: Routes = [
  {path: "", component: LocationsComponent},
  {path: ":stateId", component: StateComponent},
  {path: ":stateId/:placeId", component: PlaceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {
}
