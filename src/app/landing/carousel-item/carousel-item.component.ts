import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-carousel-item',
	templateUrl: './carousel-item.component.html',
	styleUrls: ['./carousel-item.component.scss']
})
export class CarouselItemComponent implements OnInit {
	@Input()
	public title: string = "El mariachi viajero";

	@Input()
	public category: string = "Coloniales"; // TODO it may be a better idea to use an enum or a singleton

	constructor() {
	}

	ngOnInit(): void {
	}

}
