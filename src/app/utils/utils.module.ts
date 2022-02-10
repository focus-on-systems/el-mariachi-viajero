import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavOptionComponent} from "./nav/nav-option/nav-option.component";
import {NavComponent} from "./nav/nav.component";
import {FooterComponent} from "./footer/footer.component";
import {BgImgCardComponent} from "./bg-img-card/bg-img-card.component";
import {ContactFormComponent} from "./contact-form/contact-form.component";
import {InputComponent} from "./input/input.component";
import {DialogComponent} from "./dialog/dialog.component";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { StatesComponent } from './states/states.component';
import {ObserversModule} from '@angular/cdk/observers';
import { HeadingComponent } from './heading/heading.component';

@NgModule({
  declarations: [
    NavOptionComponent,
    NavComponent,
    FooterComponent,
    BgImgCardComponent,
    ContactFormComponent,
    InputComponent,
    DialogComponent,
    StatesComponent,
    HeadingComponent
  ],
  exports: [
    BgImgCardComponent,
    NavComponent,
    ContactFormComponent,
    FooterComponent,
    DialogComponent,
    StatesComponent,
    ObserversModule,
    HeadingComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class UtilsModule { }
