import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import {TourCardInfo} from "../TourCardInfo";

@Component({
  selector: 'app-tour-item',
  templateUrl: './tour-item.component.html',
  styleUrls: ['./tour-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourItemComponent implements OnInit {
  private _data!: TourCardInfo;

  public bgImageStyle: string = "";
  public link: string = "";

  public tourCategories: TourCategory[] = [{name: "Aventura", id: "hdsiohfiosd"}, {name: "Romance", id: "hsdifohsd"}, {name: "Cultural", id: "dhfiosdhoiwe"}];

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

/**
 * TODO: moverlo de aquí y meter los campos correctos
 */
interface TourCategory {
  name: string;
  id: string;
}
