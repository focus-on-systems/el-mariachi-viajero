import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import {TourCardInfo} from "./TourCardInfo";

@Component({
  selector: 'app-tour-card',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourCardComponent implements OnInit {
  private _data!: TourCardInfo;

  public bgImageStyle: string = "";
  public link: string = "";

  constructor(private _apollo: Apollo, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  @Input()
  set data(data: TourCardInfo) {
    if (data.thumbs && data.thumbs[0])
      this.bgImageStyle = `background-image: url(${data.thumbs[0].url})`;
    this.link = `/tours/${data.id}`;
    this._data = data;
  }

  get data(): TourCardInfo {
    return this._data;
  }

}
