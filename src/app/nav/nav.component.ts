import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
	@Input()
	public position: 'sticky' | 'fixed' = 'fixed';

	constructor(private _changeDetectorRef: ChangeDetectorRef) {
	}
}
