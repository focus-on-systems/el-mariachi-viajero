import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ToursService} from "../../../utils/tours.service";
import {CategoryCompleteInfo} from "./CategoryCompleteInfo";

@Component({
  selector: 'app-tour-category',
  templateUrl: './tour-category.component.html',
  styleUrls: ['./tour-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourCategoryComponent implements OnInit, OnDestroy {
  public isLoading: boolean = true;
  public categoryInfo: CategoryCompleteInfo = {
    category: {id: '', name: '', icon: '', iconType: 1, img: {url: ''}, thumb: {url: ''}},
    tours: []
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private toursService: ToursService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const subscription = this.route.paramMap.subscribe(async (params) => {
      const categoryId = params.get("categoryId") as string;
      try {
        this.categoryInfo = await this.toursService.getCategory(categoryId);
      } catch (e) {
        console.error(e);

        if (e.message.toLowerCase().includes("object not found")) {
          // TODO improve UX
          alert("La categoría no existe");
        } else {
          alert("Ocurrió un error al obtener información de la categoría. Los detalles se encuentran en la consola");
        }
      } finally {
        this.changeDetectorRef.markForCheck();
      }
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
