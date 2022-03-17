import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CONTACT_EMAIL, CONTACT_PHONE_NUMBER } from '../../globals';
import { isPlatformBrowser, Location } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { LocationsService } from '../locations.service';
import { StateInfo } from '../states/StateInfo';
import { ToursService } from '../tours.service';
import { CategoryInfo } from '../tour-categories/CategoryInfo';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('smallOpenClose', [
      state('open', style({
        height: 'calc(100vh - 3.5rem)',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('250ms ease-in'),
      ]),
      transition('closed => open', [
        animate('200ms ease-out'),
      ]),
    ]),
  ],
})
export class NavComponent implements OnInit, OnDestroy {
  public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
  public readonly CONTACT_EMAIL = CONTACT_EMAIL;

  @Input()
  public type: 'contact-bar' | 'normal' = 'normal';

  /**
   * Tells if the device is connected to the internet
   */
  public isOnline: boolean = true;

  public isSmallNavOpen: boolean = false;

  public states: StateInfo[] = [];
  public categories: CategoryInfo[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private locationsService: LocationsService,
    private toursService: ToursService,
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  isRootUrl(): boolean {
    return this.router.url.trim() === '/inicio' || this.router.url.trim() === '/';
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = navigator.onLine;
      this.changeDetectorRef.markForCheck();
    }

    // TODO group all this in a single query
    this.locationsService.getStates()
      .then((states: StateInfo[]) => {
        this.states = states;
      }, err => {
        alert('Ocurrió un error al obtener la lista de estados. Los detalles están en la consola');
        console.error(err);
      })
      .finally(() => this.changeDetectorRef.markForCheck());

    this.toursService.getCategories()
      .then((categories: CategoryInfo[]) => {
        this.categories = categories;
      }, err => {
        alert('Ocurrió un error al obtener las categorías de tours. Los detalles están en la consola');
        console.error(err);
      })
      .finally(() => this.changeDetectorRef.markForCheck());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

