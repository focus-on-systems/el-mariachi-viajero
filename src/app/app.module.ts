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
import {SwiperModule} from "swiper/angular";
import { AboutCompanyComponent } from './about-company/about-company.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import { BlogComponent } from './blog/blog.component';

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
		TourDetailsComponent,
  AboutCompanyComponent,
  BlogComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		SwiperModule,
		GraphQLModule,
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
