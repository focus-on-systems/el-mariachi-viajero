import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CarouselItemComponent} from './landing/carousel-item/carousel-item.component';
import {NavOptionComponent} from './landing/nav-option/nav-option.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
	declarations: [
		AppComponent,
		CarouselItemComponent,
		NavOptionComponent
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
