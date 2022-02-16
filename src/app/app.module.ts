import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CarouselItemComponent} from './landing/carousel-item/carousel-item.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LandingComponent} from './landing/landing/landing.component';
import {SwiperModule} from "swiper/angular";
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {registerLocaleData} from "@angular/common";
import localeEs from "@angular/common/locales/es";
import {UtilsModule} from "./utils/utils.module";


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    CarouselItemComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    AppRoutingModule,
    SwiperModule,
    GraphQLModule,
    HttpClientModule,
    UtilsModule,
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es-MX'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
