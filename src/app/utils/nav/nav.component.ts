import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from '../../globals';
import {isPlatformBrowser} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('smallOpenClose', [
			state('open', style({
				height: 'calc(100vh - 3.5rem)',
				opacity: 1
			})),
			state('closed', style({
				height: '0px',
				opacity: 0
			})),
			transition('open => closed', [
				animate('250ms ease-in')
			]),
			transition('closed => open', [
				animate('200ms ease-out')
			])
		])
	]
})
export class NavComponent implements OnInit {
	public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
	public readonly CONTACT_EMAIL = CONTACT_EMAIL;

	@Input()
	public type: 'contact-bar' | 'normal' = 'normal';

	/**
	 * Tells if the device is connected to the internet
	 */
	public isOnline: boolean = true;

	public isSmallNavOpen: boolean = false;

	constructor(private _changeDetectorRef: ChangeDetectorRef, @Inject(PLATFORM_ID) private _platformId: Object) {
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this._platformId))
			this.isOnline = navigator.onLine;
		this._changeDetectorRef.markForCheck();
	}
}
