import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
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
	@ViewChild('topBar')
	public topBar: ElementRef | undefined;

	@ViewChild('nav')
	// @ts-ignore
	public nav: NavComponent;

	/**
	 * After this height the nav should be shown
	 * Height is in px
	 */
	public minHeight2ShowNav: number = 10;

	public isNavShowing: boolean = false;

	public _navAnimationState: NavAnimationState = 'show';

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngAfterViewInit(): void {
		this.minHeight2ShowNav = this.topBar?.nativeElement.clientHeight + 10;
	}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		console.log(window.pageYOffset, this.minHeight2ShowNav);
		if (window.pageYOffset > this.minHeight2ShowNav) { // nav should be shown
			if (this.isNavShowing)
				return;

			this.isNavShowing = true;
			this.nav.navAnimationState = 'show';
		} else { // nav should be hidden
			if (!this.isNavShowing)
				return;

			this.isNavShowing = false;
			this.nav.navAnimationState = 'hide';
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
