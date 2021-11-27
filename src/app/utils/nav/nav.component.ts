import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from '../../globals';
import {isPlatformBrowser} from "@angular/common";

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
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

	constructor(private _changeDetectorRef: ChangeDetectorRef, @Inject(PLATFORM_ID) private _platformId: Object) {
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this._platformId))
			this.isOnline = navigator.onLine;
		this._changeDetectorRef.markForCheck();
	}
}
