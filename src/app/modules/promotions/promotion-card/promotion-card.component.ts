import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import {LandingPromo} from "../LandingPromo";

@Component({
  selector: 'app-promotion-card',
  templateUrl: './promotion-card.component.html',
  styleUrls: ['./promotion-card.component.scss']
})
export class PromotionCardComponent implements OnInit {

  public bgImageStyle: string = "";
	public link: string = "";

  private _promotion!: LandingPromo;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  @Input()
	set promotion(data: LandingPromo) {
    if (!data)
      return;

		this.bgImageStyle = `background-image: url(${data.img.url})`;
		this.link = `/promociones/${data.id}`;
		this._promotion = data;
		this.changeDetectorRef.markForCheck();
	}

	get promotion(): LandingPromo {
		return this._promotion;
	}
}
