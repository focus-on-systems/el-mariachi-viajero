import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-carousel-item',
	templateUrl: './carousel-item.component.html',
	styleUrls: ['./carousel-item.component.scss']
})
export class CarouselItemComponent implements OnInit {
	@Input()
	public title: string = "Super Tour";

	@Input()
	public category: string = "Categoría"; // TODO it may be a better idea to use an enum or a singleton

	constructor() {
	}

	ngOnInit(): void {
	}

}
