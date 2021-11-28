import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from "../../globals";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DialogComponent} from "../dialog/dialog.component";
import {Subscription} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
	selector: 'app-contact-form',
	templateUrl: './contact-form.component.html',
	styleUrls: ['./contact-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('openClose', [
			state('open', style({
				opacity: 1
			})),
			state('closed', style({
				opacity: 0,
				width: 0,
				height: 0
			})),
			transition('open => closed', [
				animate('250ms ease-in')
			]),
			transition('closed => open', [
				animate('250ms ease-out')
			]),
		])
	]
})
export class ContactFormComponent implements OnInit, OnDestroy {
	public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
	public readonly CONTACT_EMAIL = CONTACT_EMAIL;

	@ViewChild('successDialog')
	// @ts-ignore
	public successDialog: DialogComponent;

	public isOpen: boolean = false;

	public formControls = {
		name: new FormControl(!environment.production ? 'Benjamín Guzmán' : undefined),
		email: new FormControl(!environment.production ? 'example@example.com' : undefined),
		message: new FormControl(!environment.production ? 'Quiero salir con mi novia' : undefined),
		phone: new FormControl(!environment.production ? '+52 5555 5555' : undefined),
		contactVia: new FormControl(!environment.production ? 'Whatsapp' : undefined),
		honey: new FormControl() // honeypot field
	};
	public form: FormGroup;
	public isContactViaEnabled: boolean;

	private _subscriptions: Subscription[] = [];

	constructor(private _http: HttpClient, private _changeDetectionRef: ChangeDetectorRef) {
		this.form = new FormGroup(this.formControls);
		this.isContactViaEnabled = !!this.formControls.phone.value;
	}

	ngOnInit(): void {
		const subscription = this.formControls.phone.valueChanges.subscribe((value: string) => {
			if (!value) { // if there is no phone number, contact via select should be disabled
				if (!this.isContactViaEnabled) // if it is already disabled, do nothing
					return;
				this.isContactViaEnabled = false;
				this._changeDetectionRef.markForCheck();
			} else { // if there is a phone number, contact via select should be enabled
				if (this.isContactViaEnabled) // if it is already enabled, do nothing
					return;
				this.isContactViaEnabled = true;
				this._changeDetectionRef.markForCheck();
			}
		});
		this._subscriptions.push(subscription);
	}

	ngOnDestroy() {
		for (const subscription of this._subscriptions)
			subscription.unsubscribe();
	}

	public onSubmit(): void {
		if (this.form.invalid) { // technically this should never happen
			alert(`Ocurrió un error en el formulario. Por favor repórtelo a ${CONTACT_EMAIL}/${CONTACT_PHONE_NUMBER}`);
			return;
		}

		let body = new HttpParams();
		for (const [key, value] of Object.entries(this.form.value))
			body = body.set(key, value as string || '');

		this._http.post("/", body, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).subscribe({
			next: (response) => {
				console.log(response);
				this.toggle(); // close the form
				this.successDialog.open(); // show the success dialog
			},
			error: (error) => {
				alert(`Ocurrió un error en el formulario. Por favor reporte a ${CONTACT_EMAIL}/${CONTACT_PHONE_NUMBER} la siguiente información: ${JSON.stringify(error)}`);
			}
		});
	}

	public toggle(): void {
		this.isOpen = !this.isOpen;
	}
}
