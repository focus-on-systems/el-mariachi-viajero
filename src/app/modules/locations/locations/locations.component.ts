import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsComponent {
  constructor(private _apollo: Apollo, private _changeDetectorRef: ChangeDetectorRef) {
  }

}
