import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-basic-card',
	templateUrl: './bg-img-card.component.html',
	styleUrls: ['./bg-img-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgImgCardComponent implements OnInit {
	private _bgImage: string = '';

	/**
	 * Same parameter as given to {@link RouterLinkWithHref#routerLink}
	 */
	@Input()
	public link: any[] | string | null = null;

	/**
	 * Text to show in the link
	 */
	@Input()
	public linkTxt: string = '';

	@Input()
	public linkTitle: string = '';

	constructor() {
	}

	ngOnInit(): void {
	}

	@Input()
	set bgImage(value: string) {
		this._bgImage = `url('${encodeURI(value)}')`;
	}

	get bgImage(): string {
		return this._bgImage;
	}
}