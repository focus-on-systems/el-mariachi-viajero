import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from '../../globals';
import {isPlatformBrowser} from "@angular/common";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('smallOpenClose', [
			state('open', style({
				height: 'calc(100vh - 3.5rem)',
				opacity: 1
			})),
			state('closed', style({
				height: '0px',
				opacity: 0
			})),
			transition('open => closed', [
				animate('250ms ease-in')
			]),
			transition('closed => open', [
				animate('200ms ease-out')
			])
		])
	]
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

  private subscriptions: Subscription[] = [];

	constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _apollo: Apollo,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this._platformId)) {
      this.isOnline = navigator.onLine;
      this._changeDetectorRef.markForCheck();
    }

    // load locations (states)
    const subscription = this._apollo.query<GQLStatesQuery>({
      query: gql`query {
        states {
          edges {
            node {
              id
              name: stateName
            }
          }
        }
      }`
    }).subscribe((res: ApolloQueryResult<GQLStatesQuery>) => {
      this.states = res.data.states.edges.map(node => node.node);

      this._changeDetectorRef.markForCheck();

      subscription.unsubscribe();
    });

    this.subscriptions.push(subscription);
	}

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

interface StateInfo {
  id: string;
  name: string;
}

interface GQLStatesQuery {
  states: {
    edges: {
      node: StateInfo
    }[];
  }
}
