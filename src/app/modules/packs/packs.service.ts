import { Injectable } from '@angular/core';
import {LandingPack} from "./LandingPack";
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";

@Injectable({
  providedIn: 'root'
})
export class PacksService {
  private packs: LandingPack[] = [];

  constructor(private _apollo: Apollo) { }

  /**
   * Get packs from backend and populate the cache.
   *
   * @param limit limit the number of packs to return from backend. If cache is populated, this is ignored
   */
  public getPacks(limit: number): Promise<LandingPack[]> {
    return new Promise<LandingPack[]>((resolve, reject) => {
      if (this.packs.length > 0)
        return resolve(this.packs);

      if (limit <= 0)
        return resolve([]);

      const subscription = this._apollo.query<GQLPacksQuery>({
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
          limit
        }
      }).subscribe({
        next: (res: ApolloQueryResult<GQLPacksQuery>) => {
          subscription.unsubscribe();
          this.packs = res.data.packs.edges.map(node => node.node);
          return resolve(this.packs);
        },
        error: err => {
          subscription.unsubscribe();
          return reject(err);
        }
      });
    });
  }

}

interface GQLPacksQuery {
  packs: {
    edges: {
      node: LandingPack
    }[];
  }
}