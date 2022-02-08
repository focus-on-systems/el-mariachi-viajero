import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
