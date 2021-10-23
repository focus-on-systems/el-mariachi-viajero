import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import SwiperCore, {Navigation, Pagination} from "swiper";
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {Subscription} from "rxjs";

SwiperCore.use([Pagination, Navigation]);

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	/**
	 * Tells if the backend health check succeeded
	 */
	public isBackendHealthy: boolean = true;

	/**
	 * Tells if the backend could be reached when performing the health check
	 *
	 * Let's be optimistic and start with a true value
	 */
	public isBackendReachable: boolean = true;

	constructor(private _apollo: Apollo, private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		const healthSubscription = this._apollo.query<{ health: boolean }>({
			query: gql`{
				health
			}`
		}).subscribe((res: ApolloQueryResult<{ health: boolean }>) => {
			this.isBackendReachable = !!(res.error || res.errors);

			if (!this.isBackendReachable)
				return;

			this.isBackendHealthy = res.data.health;
		});

		this.subscriptions.push(healthSubscription);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
	}
}
