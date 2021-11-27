import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import SwiperCore, {Navigation, Pagination} from "swiper";
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {Subscription} from "rxjs";
import {SwiperComponent} from "swiper/angular";
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from "../../globals";


SwiperCore.use([Pagination, Navigation]);

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	public readonly CONTACT_PHONE_NUMBER = CONTACT_PHONE_NUMBER;
	public readonly CONTACT_EMAIL = CONTACT_EMAIL;

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

	@ViewChild('carousel')
	public carousel?: SwiperComponent;

	public tourCategories: LandingTourCategory[] = [];

	constructor(private _apollo: Apollo, private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		// retrieve carousel slides information
		const subscription = this._apollo.query<GQLTourCategoriesQuery>({
			query: gql`{
				health
				tourCategories {
					edges {
						node {
							id
							name
							bgImage {
								url
							}
							summary
						}
					}
				}
			}`
		}).subscribe((res: ApolloQueryResult<GQLTourCategoriesQuery>) => {
			this.isBackendReachable = !(res.error || res.errors);

			if (!this.isBackendReachable)
				return;

			this.isBackendHealthy = res.data.health;
			this.tourCategories = res.data.tourCategories.edges.map(node => node.node);
			// console.log(this.tourCategories);
			this._changeDetectorRef.markForCheck();
		});
		this.subscriptions.push(subscription);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
	}
}

interface LandingTourCategory {
	id: string;
	name: string;
	bgImage: {
		url: string;
	};
	summary: string;
}

interface GQLTourCategoriesQuery {
	health: boolean;
	tourCategories: {
		edges: {
			node: LandingTourCategory
		}[];
	}
}
