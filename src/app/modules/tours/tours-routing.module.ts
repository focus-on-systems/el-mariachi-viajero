import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { ToursComponent } from './tours/tours.component';
import { TourCategoryComponent } from './tour-category/tour-category.component';

const routes: Routes = [
  { path: '', component: ToursComponent },
  { path: 'categoria/:categoryId', component: TourCategoryComponent },
  { path: ':tourId', component: TourDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToursRoutingModule {
}
