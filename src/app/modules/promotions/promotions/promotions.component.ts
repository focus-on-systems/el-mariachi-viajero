import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Subscription} from "rxjs";
import { PromotionsService } from 'src/app/modules/promotions/promotions.service';
import { LandingPromo } from '../LandingPromo';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public promotions: LandingPromo[] = [];

  constructor(private promotionsService: PromotionsService, private _changeDetectorRef: ChangeDetectorRef) { }

  async ngOnInit() {
		try {
			this.promotions = await this.promotionsService.getPromos(10);
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
