import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CarouselItemComponent} from './landing/carousel-item/carousel-item.component';
import {NavOptionComponent} from './nav/nav-option/nav-option.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ManageToursComponent} from './tours/manage-tours/manage-tours.component';
import {NavComponent} from './nav/nav.component';
import {FooterComponent} from './footer/footer.component';
import {LandingComponent} from './landing/landing/landing.component';
import {TourItemComponent} from './tours/tour-item/tour-item.component';
import {TourDetailsComponent} from './tours/tour-details/tour-details.component';

@NgModule({
	declarations: [
		AppComponent,
		CarouselItemComponent,
		NavOptionComponent,
		NavComponent,
		FooterComponent,
		ManageToursComponent,
		LandingComponent,
		TourItemComponent,
		TourDetailsComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
