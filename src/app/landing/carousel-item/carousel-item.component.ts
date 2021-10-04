import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-carousel-item',
	templateUrl: './carousel-item.component.html',
	styleUrls: ['./carousel-item.component.scss']
})
export class CarouselItemComponent implements OnInit {
	@Input()
	public category: string = "";

	@Input()
	public description: string = "";

	private _bgImageStyle: string = "";

	@Input()
	public link: string = "";

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
	}

	@Input()
	set bgImageStyle(bgImage: string) {
		this._bgImageStyle = `background-image: url(${bgImage})`;
		this._changeDetectorRef.markForCheck();
	}

	get bgImageStyle(): string {
		return this._bgImageStyle;
	}
}
