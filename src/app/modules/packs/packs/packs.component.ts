import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PacksService } from 'src/app/modules/packs/packs.service';
import { LandingPack } from '../LandingPack';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss'],
})
export class PacksComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public packs: LandingPack[] = [];

  constructor(private packsService: PacksService, private _changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    try {
      this.packs = await this.packsService.getPacks(10);
    } catch (e) {
      alert('Error al obtener los paquetes y promociones disponibles. Los detalles se encuentran en la consola');
      console.error(e);
    } finally {
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
