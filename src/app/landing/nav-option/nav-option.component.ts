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
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-nav-option',
	templateUrl: './nav-option.component.html',
	styleUrls: ['./nav-option.component.scss'],
	animations: [
		trigger('openClose', [
			state('open', style({
				opacity: 1,
				display: 'flex',
				height: '{{height}}px'
			}), {
				params: {
					height: 1 // this height will eventually  change to the real component's height
				}
			}),
			state('closed', style({
				opacity: 0,
				display: 'none',
				height: '0'
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
	public isOpen: boolean = false;

	@Input()
	public optionTxtClasses: string = '';

	@Input()
	public optionTxt: string = '';

	@ViewChild('menu')
	public menuEl: ElementRef | undefined;

	/**
	 * Height in px for the menu div height
	 */
	public menuHeight: number = 0;

	constructor(private _changeDetectorRef: ChangeDetectorRef, private _renderer: Renderer2) {
	}

	ngOnInit(): void {
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

	public toggle(): void {
		this.isOpen = !this.isOpen;
	}
}
