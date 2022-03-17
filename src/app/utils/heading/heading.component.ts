import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
  private _bgImageStyle: string = '';

  @Input()
  public isBgFixed: boolean = true;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }

  @Input()
  set bgImage(url: string) {
    this._bgImageStyle = `background-image: url(${url});`;
    this._changeDetectorRef.markForCheck();
  }

  get bgImageStyle(): string {
    return this._bgImageStyle;
  }
}
