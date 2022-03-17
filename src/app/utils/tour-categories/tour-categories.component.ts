import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryInfo } from './CategoryInfo';
import { ToursService } from '../tours.service';

@Component({
  selector: 'app-tour-categories',
  templateUrl: './tour-categories.component.html',
  styleUrls: ['./tour-categories.component.scss'],
})
export class TourCategoriesComponent implements OnInit, OnDestroy {
  public categories: CategoryInfo[] = [];
  public _isState: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private toursService: ToursService, private changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    // retrieve categories information
    try {
      this.categories = await this.toursService.getCategories();
    } catch (e) {
      alert('Ocurrió un error al obtener la lista de estados. Los detalles están en la consola');
      console.error(e);
    } finally {
      this.changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
