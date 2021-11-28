import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('openClose', [
			state('open', style({
				opacity: 1,
				transform: 'scaleY(100%)'
			})),
			state('closed', style({
				opacity: 0,
				transform: 'scaleY(0%)'
			})),
			transition('open => closed', [
				animate('250ms ease-in')
			]),
			transition('closed => open', [
				animate('200ms ease-out')
			]),
		])
	]
})
export class DialogComponent implements OnInit {
	public isOpen: boolean = false;

	@Input()
	public title: string = '';

	@Output()
	public closeEvent = new EventEmitter<CLOSE_REASON>();

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
	}

	toggle(closeReason?: 'OK' | 'CLOSE' | 'OUTSIDE'): void {
		this.isOpen = !this.isOpen;

		if (!this.isOpen && closeReason)
			this.closeEvent.emit(CLOSE_REASON[closeReason]);
	}

	/**
	 * Open the dialog
	 */
	open(): void {
		this.isOpen = true;
		this._changeDetectorRef.markForCheck();
	}

	/**
	 * Close the dialog
	 */
	close(): void {
		this.isOpen = false;
		this._changeDetectorRef.markForCheck();
	}
}

export enum CLOSE_REASON {
	/**
	 * The user clicked OK button
	 */
	OK = 'OK',

	/**
	 * The user clicked CLOSE button
	 */
	CLOSE = 'CLOSE',

	/**
	 * The user clicked outside the dialog
	 */
	OUTSIDE = 'OUTSIDE'
}
