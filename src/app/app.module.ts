import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CarouselItemComponent} from './landing/carousel-item/carousel-item.component';
import {NavOptionComponent} from './utils/nav/nav-option/nav-option.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NavComponent} from './utils/nav/nav.component';
import {FooterComponent} from './utils/footer/footer.component';
import {LandingComponent} from './landing/landing/landing.component';
import {SwiperModule} from "swiper/angular";
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {BasicCardComponent} from './utils/basic-card/basic-card.component';

@NgModule({
	declarations: [
		AppComponent,
		CarouselItemComponent,
		NavOptionComponent,
		NavComponent,
		FooterComponent,
		LandingComponent,
		BasicCardComponent
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
