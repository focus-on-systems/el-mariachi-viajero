import { Component } from '@angular/core';
import { CONTACT_EMAIL, CONTACT_PHONE_NUMBER } from '../../globals';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
  public readonly CONTACT_EMAIL = CONTACT_EMAIL;

  constructor() {
  }

}
