import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {LocationsService} from "../locations.service";
import {StateInfo} from "./StateInfo";

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatesComponent implements OnInit, OnDestroy {
  public states: StateInfo[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private _locationsService: LocationsService, private _changeDetectorRef: ChangeDetectorRef) { }

  async ngOnInit() {
    // retrieve states information
    try {
      this.states = await this._locationsService.getStates();
    } catch (e) {
      alert("Ocurrió un error al obtener la lista de estados. Los detalles están en la consola");
      console.error(e);
    } finally {
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

