import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingComponent } from './landing/landing/landing.component';
import { SwiperModule } from 'swiper/angular';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { UtilsModule } from './utils/utils.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { PacksModule } from './modules/packs/packs.module';


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    SwiperModule,
    GraphQLModule,
    HttpClientModule,
    UtilsModule,
    PromotionsModule,
    PacksModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
