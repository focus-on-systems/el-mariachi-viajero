import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
