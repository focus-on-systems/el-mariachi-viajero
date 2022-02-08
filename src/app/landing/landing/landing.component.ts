import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import SwiperCore, {Navigation, Pagination} from "swiper";
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {Subscription} from "rxjs";
import {SwiperComponent} from "swiper/angular";
import {CONTACT_EMAIL, CONTACT_PHONE_NUMBER} from "../../globals";
import { LandingPromotion } from '../LandingPromotion';
import {LandingPack} from "../LandingPack";


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

	public promotions: LandingPromotion[] = [];
	public packs: LandingPack[] = [];

	/**
	 * Maximum number of slides present in the carousel
	 */
	public readonly nSlides: number = 10;

	constructor(private _apollo: Apollo, private _changeDetectorRef: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		// retrieve carousel slides information
		const subscription = this._apollo.query<GQLPromotionsQuery>({
			query: gql`query($limit: Int) {
				health
				promotions(first: $limit) {
					edges {
						node {
							id
							name: promoName
							img: promoImg {
								url
							}
							description: promoDescription
							featuresIncluded: promoFeaturesIncluded
							featuresExcluded: promoFeaturesExcluded
							price: promoPrice
							validFrom: promoValidFrom
							validUntil: promoValidUntil
						}
					}
				}
			}`,
			variables: {
				limit: this.nSlides
			}
		}).subscribe((res: ApolloQueryResult<GQLPromotionsQuery>) => {
			this.isBackendReachable = !(res.error || res.errors);

			if (!this.isBackendReachable)
				return;

			this.isBackendHealthy = res.data.health;
			this.promotions = res.data.promotions.edges.map(node => node.node);

      this._changeDetectorRef.markForCheck();

      // fetch packs if there are still room
      const nAvailableSlides = this.nSlides - this.promotions.length;
      if (nAvailableSlides <= 0)
        return;

      const subscription1 = this._apollo.query<GQLPacksQuery>({
        query: gql`query($limit: Int) {
          packs(first: $limit) {
            edges {
              node {
                id
                name: packName
                img: packImg {
                  url
                }
                shortDescription: packShortDescription
                featuresIncluded: packFeaturesIncluded
                featuresExcluded: packFeaturesExcluded
                price: packPrice
              }
            }
          }
        }`,
        variables: {
          limit: nAvailableSlides
        }
      }).subscribe((res: ApolloQueryResult<GQLPacksQuery>) => {
        this.packs = res.data.packs.edges.map(node => node.node);

        this._changeDetectorRef.markForCheck();
        subscription1.unsubscribe();
      });

      this.subscriptions.push(subscription1);
      subscription.unsubscribe();
		});

		this.subscriptions.push(subscription); // subscription is still added to the array to be sure there is no leak
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
	}
}

interface GQLPacksQuery {
  packs: {
    edges: {
      node: LandingPack
    }[];
  }
}

interface GQLPromotionsQuery {
	health: boolean;
	promotions: {
		edges: {
			node: LandingPromotion
		}[];
	}
}
