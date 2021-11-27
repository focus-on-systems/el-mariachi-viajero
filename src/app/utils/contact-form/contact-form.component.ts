import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from "../../globals";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
export class ContactFormComponent implements OnInit {
	public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
	public readonly CONTACT_EMAIL = CONTACT_EMAIL;

	public isOpen: boolean = false;

	constructor() {
	}

	ngOnInit(): void {
	}

	public toggle(): void {
		this.isOpen = !this.isOpen;
	}
}
