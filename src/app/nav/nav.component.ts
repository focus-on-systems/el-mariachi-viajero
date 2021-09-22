import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	animations: [
		trigger('hideShow', [
			state('hide', style({
				opacity: 0,
				height: '0px',
				display: 'none'
			})),
			state('show', style({
				opacity: 1,
				height: '3rem',
				display: 'flex'
			})),
			transition('hide => show', [
				style({
					display: 'flex'
				}),
				animate('500ms ease-out')
			]),
			transition('show => hide', [
				animate('100ms ease-out')
			])
		]),
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
	public _navAnimationState: NavAnimationState = 'hide';

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}

	set navAnimationState(state: NavAnimationState) {
		if (state === this._navAnimationState) // do nothing if the new state is the current one
			return;

		this._navAnimationState = state;
		this._changeDetectorRef.markForCheck();
	}

	get navAnimationState() {
		return this._navAnimationState;
	}
}

export type NavAnimationState = 'show' | 'hide';
