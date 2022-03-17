import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { LandingPromo } from '../LandingPromo';

@Component({
  selector: 'app-promotion-card',
  templateUrl: './promotion-card.component.html',
  styleUrls: ['./promotion-card.component.scss'],
})
export class PromotionCardComponent {

  public bgImageStyle: string = '';
  public link: string = '';

  private _promotion!: LandingPromo;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
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
