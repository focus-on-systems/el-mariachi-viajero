import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import {LandingPack} from "../LandingPack";

@Component({
  selector: 'app-pack-card',
  templateUrl: './pack-card.component.html',
  styleUrls: ['./pack-card.component.scss']
})
export class PackCardComponent implements OnInit {

  public bgImageStyle: string = "";
	public link: string = "";

  private _pack!: LandingPack;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  @Input()
  set pack(data: LandingPack) {
    if (!data)
      return;
    this.bgImageStyle = `background-image: url(${data.img.url})`;
    this.link = `/paquetes/${data.id}`;
    this._pack = data;
    this.changeDetectorRef.markForCheck();
  }

  get pack(): LandingPack {
    return this._pack;
  }

}
