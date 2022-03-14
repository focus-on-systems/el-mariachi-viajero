import { Injectable } from '@angular/core';
import {LandingPromo} from "./LandingPromo";
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {
  private promos: LandingPromo[] = [];

  constructor(private _apollo: Apollo) { }

  /**
   * Get promotions from backend and populate the cache.
   *
   * @param limit limit the number of promotions to return from backend. If cache is populated, this is ignored
   */
  public getPromos(limit: number): Promise<LandingPromo[]> {
    return new Promise<LandingPromo[]>((resolve, reject) => {
      if (this.promos.length > 0)
        return resolve(this.promos);

      if (limit <= 0)
        return resolve([]);

      const subscription = this._apollo.query<GQLPromosQuery>({
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
                shortDescription: promoShortDescription
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
          limit
        }
      }).subscribe({
        next: (res: ApolloQueryResult<GQLPromosQuery>) => {
          subscription.unsubscribe();
          this.promos = res.data.promotions.edges.map(node => node.node);
          return resolve(this.promos);
        },
        error: err => {
          subscription.unsubscribe();
          return reject(err);
        }
      });
    });
  }

}

interface GQLPromosQuery {
  health: boolean;
  promotions: {
    edges: {
      node: LandingPromo
    }[];
  }
}