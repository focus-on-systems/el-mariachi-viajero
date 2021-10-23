import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {
	@Input()
	public position: 'sticky' | 'fixed' = 'fixed';

	/**
	 * Tells if the device is connected to the internet
	 */
	public isOnline: boolean = true;

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		this.isOnline = navigator.onLine;
		this._changeDetectorRef.markForCheck();
	}
}
