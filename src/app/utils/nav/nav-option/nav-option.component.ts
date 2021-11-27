import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnInit,
	Renderer2,
	ViewChild
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RouterLinkWithHref} from "@angular/router";

@Component({
	selector: 'app-nav-option',
	templateUrl: './nav-option.component.html',
	styleUrls: ['./nav-option.component.scss'],
	animations: [
		trigger('openClose', [
			state('open', style({
				opacity: 1,
				display: 'block',
				// height: '{{height}}px'
			}), {
				params: {
					height: 1 // this height will eventually change to the real component's height
				}
			}),
			state('closed', style({
				opacity: 0,
				display: 'none',
				// height: '0'
			})),
			transition('open => closed', [
				animate('200ms ease-out')
			]),
			transition('closed => open', [
				style({
					display: 'block'
				}),
				animate('300ms ease-in-out')
			]),
		]),
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavOptionComponent implements OnInit, AfterViewInit {
	@Input()
	public iconClasses: string = '';

	@Input()
	public optionTxtClasses: string = '';

	@Input()
	public optionTxt: string = '';

	@Input()
	public icon: string = '';

	@Input()
	public iconPosition: 'left' | 'right' | 'fill' = 'right';

	@Input()
	public dropdownPosition: DropdownPosition = 'bottom-right';

	/**
	 * Same parameter as given to {@link RouterLinkWithHref#routerLink}
	 */
	@Input()
	public link: any[] | string | null = null;

	@ViewChild('menu')
	public menuEl: ElementRef | undefined;

	/**
	 * Height in px for the menu div height
	 */
	public menuHeight: number = 0;

	public isOpen: boolean = false;

	/**
	 * Set of classes to achieve the desired position in {@link dropdownPosition}
	 */
	public positionClasses: string = '';

	/**
	 * True when the touchstart event has been produced, but the touchend hasn't been produced yet
	 * @private
	 */
	private _touchStarted: boolean = false;

	constructor(private _changeDetectorRef: ChangeDetectorRef, private _renderer: Renderer2) {
	}

	ngOnInit(): void {
		switch (this.dropdownPosition) {
			case 'left':
				this.positionClasses = '-top-0 -left-36 md:-left-40';
				break;
			case 'right':
				this.positionClasses = '-top-0 -right-36 md:-right-40';
				break;
			case 'bottom-left':
				this.positionClasses = 'left-0';
				break;
			case 'bottom-right':
				this.positionClasses = 'right-0';
				break;
		}
	}

	ngAfterViewInit() {
		// remove the menu div if there are no menu options
		const contentWrapper = this.menuEl?.nativeElement.children[0];
		if (contentWrapper.children.length === 0) {
			this._renderer.removeChild(this.menuEl?.nativeElement.parentElement, this.menuEl?.nativeElement);
			this._changeDetectorRef.detectChanges();
			return;
		}

		this.menuHeight = this.menuEl?.nativeElement.clientHeight;
		this._changeDetectorRef.detectChanges();
	}

	public toggle(e: Event): void {
		switch (e.type) {
			case 'focusin':
			case 'mouseenter':
				// if focus was produced because user touched the button, do nothing, let touch handlers do their work
				if (this._touchStarted)
					break;

				this.isOpen = true;
				break;
			case 'focusout':
			case 'mouseleave':
				this.isOpen = false;
				break;
			case 'touchstart':
				this._touchStarted = true;
				break;
			case 'touchend': // for mobile devices
				this._touchStarted = false;
				this.isOpen = !this.isOpen;
				break;
			default:
				console.log('Weird event occurred on nav option', e);
		}
	}
}

export type DropdownPosition = 'left' | 'right' | 'bottom-right' | 'bottom-left';
