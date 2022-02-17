import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LandingPromo} from "../LandingPromo";
import {LandingPack} from "../LandingPack";

@Component({
	selector: 'app-carousel-item',
	templateUrl: './carousel-item.component.html',
	styleUrls: ['./carousel-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselItemComponent implements OnInit {
	bgImageStyle: string = "";
	link: string = "";

  private _commonData!: LandingPack | LandingPromo;

  // bot can be falsy but assertion was added so typescript and angular don't complain
	private _promotion!: LandingPromo;
	private _pack!: LandingPack;

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
	}

	@Input()
	set promotion(data: LandingPromo) {
    if (!data)
      return;

    if (!!this._pack)
      throw new Error("This carousel item is a pack but you tried to set it as promotion");

		this.bgImageStyle = `background-image: url(${data.img.url})`;
		this.link = `/promo/${data.id}`;
		this._promotion = data;
		this._changeDetectorRef.markForCheck();

    this._commonData = data;
	}

	get promotion(): LandingPromo {
		return this._promotion;
	}

  @Input()
  set pack(data: LandingPack) {
    if (!data)
      return;

    if (!!this._promotion)
      throw new Error("This carousel item is a promotion but you tried to set it as pack");

    this.bgImageStyle = `background-image: url(${data.img.url})`;
    this.link = `/pack/${data.id}`;
    this._pack = data;
    this._changeDetectorRef.markForCheck();

    this._commonData = data;
  }

  get pack(): LandingPack {
    return this._pack;
  }

  get commonData(): LandingPack | LandingPromo {
    return this._commonData;
  }

  isPromotion(): boolean {
    return !!this._promotion;
  }
}
