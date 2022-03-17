import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {

  constructor() {
  }

}
