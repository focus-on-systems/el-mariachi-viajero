import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from "../../globals";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DialogComponent} from "../dialog/dialog.component";

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
export class ContactFormComponent implements OnInit, AfterViewInit {
	public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
	public readonly CONTACT_EMAIL = CONTACT_EMAIL;

	@ViewChild('successDialog')
	// @ts-ignore
	public successDialog: DialogComponent;

	public isOpen: boolean = false;

	public form: FormGroup = new FormGroup({
		name: new FormControl('Benjamín Guzmán'),
		email: new FormControl('example@example.com'),
		message: new FormControl('Quiero salir con mi novia'),
		phone: new FormControl('+52 5555 5555'),
		honey: new FormControl() // honeypot field
	});

	constructor(private _http: HttpClient) {
	}

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.successDialog.open();
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
				console.log(response)
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
