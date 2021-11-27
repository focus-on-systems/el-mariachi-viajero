import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BgImgCardComponent} from './bg-img-card.component';

describe('BasicCardComponent', () => {
	let component: BgImgCardComponent;
	let fixture: ComponentFixture<BgImgCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BgImgCardComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BgImgCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
