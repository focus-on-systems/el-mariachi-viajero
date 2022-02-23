import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToursComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
