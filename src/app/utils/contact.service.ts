import {EventEmitter, Injectable} from '@angular/core';

/**
 * Service to allow other components to control the open/closed state of the contact form and other things
 */
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  public readonly formOpenStateEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  /**
   * Opens the contact form
   */
  public openContactForm() {
    this.formOpenStateEmitter.emit(true);
  }

  /**
   * Closes the contact form
   */
  public closeContactForm() {
    this.formOpenStateEmitter.emit(false);
  }
}
