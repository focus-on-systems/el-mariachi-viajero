import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit {
	@Input()
	public type: string = 'text';

	@Input()
	public name: string = 'input';

	@Input()
	public placeholder: string = '';

	@Input()
	public label: string = '';

	@Input()
	public required: boolean = false;

	@Input()
	public textColor: 'white' | 'black' = 'black';

	@Input()
	public isTextArea: boolean = false;

	constructor() {
	}

	ngOnInit(): void {
	}

}
