import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {TourCardInfo} from "../../tours/TourCardInfo";
import {ToursService} from "../../../utils/tours.service";
import {LocationsService} from "../../../utils/locations.service";
import {StateCompleteInfo} from "./StateCompleteInfo";

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateComponent implements OnInit, OnDestroy {
  public tours: TourCardInfo[] = [];
  public stateInfo: StateCompleteInfo = {
    state: {name: '', abbr: '', img: {url: ''}, id: '', thumb: {url: ''}},
    tours: []
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _locationsService: LocationsService,
    private _toursService: ToursService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const subscription = this._route.paramMap.subscribe(async (params) => {
      const stateId = params.get("stateId") as string;
      try {
        this.stateInfo = await this._locationsService.getState(stateId);
      } catch (e) {
        console.error(e);

        if (e.message.toLowerCase().includes("object not found")) {
          // TODO improve UX
          alert("El estado no existe");
        } else {
          alert("Ocurrió un error al obtener información del estado. Los detalles se encuentran en la consola");
        }
      } finally {
        this._changeDetectorRef.markForCheck();
      }
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
