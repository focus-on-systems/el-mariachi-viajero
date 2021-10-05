import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, ViewChild} from '@angular/core';
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
				opacity: 0.9,
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
	@ViewChild('nav')
	// @ts-ignore
	public nav: NavComponent;

	/**
	 * After this height the nav should be shown
	 * Height is in px
	 */
	public minHeight2ShowNav: number = 50;

	public isNavShowing: boolean = false;

	public _navAnimationState: NavAnimationState = 'hide';

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		if (window.pageYOffset > this.minHeight2ShowNav) { // nav should be shown
			if (this.isNavShowing)
				return;

			this.isNavShowing = true;
			this.navAnimationState = 'show';
		} else { // nav should be hidden
			if (!this.isNavShowing)
				return;

			this.isNavShowing = false;
			this.navAnimationState = 'hide';
		}
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
