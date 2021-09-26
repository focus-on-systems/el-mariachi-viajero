import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {NavComponent} from "./nav/nav.component";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
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
}
