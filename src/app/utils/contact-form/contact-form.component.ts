import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CONTACT_EMAIL, CONTACT_PHONE_NUMBER } from '../../globals';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        opacity: 0,
        width: 0,
        height: 0,
      })),
      transition('open => closed', [
        animate('250ms ease-in'),
      ]),
      transition('closed => open', [
        animate('250ms ease-out'),
      ]),
    ]),
  ],
})
export class ContactFormComponent implements OnInit, OnDestroy {
  public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
  public readonly CONTACT_EMAIL = CONTACT_EMAIL;

  /**
   * Whatsapp default text message
   * This is the text set by default when the user clicks the wa button
   *
   * This should be URI-encoded
   */
  public readonly WA_MESSAGE = encodeURIComponent('Hola, me interesa un viaje turístico...');

  @ViewChild('successDialog')
  // @ts-ignore
  public successDialog: DialogComponent;

  public isOpen: boolean = false;

  public formControls = {
    name: new FormControl(!environment.production ? 'Benjamín Guzmán' : undefined),
    email: new FormControl(!environment.production ? 'example@example.com' : undefined),
    message: new FormControl(!environment.production ? 'Quiero salir con mi novia' : undefined),
    phone: new FormControl(!environment.production ? '+52 5555 5555' : undefined),
    'contact-via': new FormControl('Whatsapp'),
    'form-name': new FormControl('contact'), // form name. Required for netlify forms
    honey: new FormControl(), // honeypot field
  };
  public form: FormGroup;
  public isContactViaEnabled: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient, private changeDetectionRef: ChangeDetectorRef, private contactService: ContactService) {
    this.form = new FormGroup(this.formControls);
    this.isContactViaEnabled = !!this.formControls.phone.value;
    if (!this.isContactViaEnabled)
      this.formControls['contact-via'].disable(); // it'll be enabled as soon as the user enters a phone number

    const subscription = this.contactService.formOpenStateEmitter.subscribe(shouldOpen => {
      if (shouldOpen && !this.isOpen) { // if it should be open but it's actually closed
        this.toggle();
        this.changeDetectionRef.markForCheck();
      } else if (!shouldOpen && this.isOpen) { // if it should be closed but it's actually open
        this.toggle();
        this.changeDetectionRef.markForCheck();
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    const subscription = this.formControls.phone.valueChanges.subscribe((value: string) => {
      if (!value) { // if there is no phone number, contact via select should be disabled
        if (!this.isContactViaEnabled) // if it is already disabled, do nothing
          return;
        this.isContactViaEnabled = false;
        this.formControls['contact-via'].disable();
      } else { // if there is a phone number, contact via select should be enabled
        if (this.isContactViaEnabled) // if it is already enabled, do nothing
          return;
        this.isContactViaEnabled = true;
        this.formControls['contact-via'].enable();
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public onSubmit(): void {
    if (this.form.invalid) { // technically this should never happen
      alert(`Ocurrió un error en el formulario. Por favor repórtelo a ${CONTACT_EMAIL}/${CONTACT_PHONE_NUMBER}`);
      return;
    }

    let body = new HttpParams();
    for (const [key, value] of Object.entries(this.form.value))
      body = body.set(key, value as string || '');

    this.http.post('/', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      responseType: 'text',
    }).subscribe({
      next: (response) => {
        // console.log(response);
        this.toggle(); // close the form
        this.successDialog.open(); // show the success dialog
      },
      error: (error) => {
        console.error(
          `Ocurrió un error en el formulario. Por favor reporte a ${CONTACT_EMAIL}/${CONTACT_PHONE_NUMBER} la siguiente información`,
          error,
        );
      },
    });
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
