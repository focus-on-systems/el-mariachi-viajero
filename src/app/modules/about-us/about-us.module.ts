import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutUsComponent} from "./about-us/about-us.component";
import {AboutUsRoutingModule} from "./about-us-routing.module";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
	declarations: [
		AboutUsComponent
	],
	imports: [
		AboutUsRoutingModule,
		CommonModule,
		MatIconModule
	]
})
export class AboutUsModule {
}
