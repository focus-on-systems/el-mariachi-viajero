import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import SwiperCore, {Navigation, Pagination} from "swiper";
import {Subscription} from "rxjs";
import {SwiperComponent} from "swiper/angular";
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from "../../globals";
import {LandingPromo} from '../LandingPromo';
import {LandingPack} from "../LandingPack";
import {LandingPacksNPromosService} from "../landing-packs-n-promos.service";


SwiperCore.use([Pagination, Navigation]);

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
	public readonly CONTACT_EMAIL = CONTACT_EMAIL;

	/**
	 * Tells if the backend health check succeeded
	 */
	public isBackendHealthy: boolean = true;

	/**
	 * Tells if the backend could be reached when performing the health check
	 *
	 * Let's be optimistic and start with a true value
	 */
	public isBackendReachable: boolean = true;

	@ViewChild('carousel')
	public carousel?: SwiperComponent;

	public promotions: LandingPromo[] = [];
	public packs: LandingPack[] = [];

	/**
	 * Maximum number of slides present in the carousel
	 */
	public readonly nSlides: number = 10;

	constructor(private landingPacksNPromos: LandingPacksNPromosService, private _changeDetectorRef: ChangeDetectorRef) {
	}

	async ngOnInit() {
    try {
      this.promotions = await this.landingPacksNPromos.getPromos(this.nSlides);
      this.packs = await this.landingPacksNPromos.getPacks(this.nSlides - this.promotions.length);
    } catch (e) {
      alert("Error al obtener los paquetes y promociones disponibles. Los detalles se encuentran en la consola");
      console.error(e);
    } finally {
      this._changeDetectorRef.markForCheck();
    }
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
	}
}
