import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CarouselItemComponent} from './landing/carousel-item/carousel-item.component';
import {NavOptionComponent} from './landing/nav-option/nav-option.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ManageToursComponent } from './tours/manage-tours/manage-tours.component';

@NgModule({
	declarations: [
		AppComponent,
		CarouselItemComponent,
		NavOptionComponent,
  		ManageToursComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		MatCardModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
