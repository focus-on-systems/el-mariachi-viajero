import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult, gql } from '@apollo/client/core';
import { StateInfo } from './states/StateInfo';
import { TourCardInfo } from '../modules/tours/tour-card/TourCardInfo';
import { StateCompleteInfo } from '../modules/locations/state/StateCompleteInfo';
import { ToursService } from './tours.service';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  public static stateInfoProjection = `
    id: objectId
    name: stateName
    abbr: stateAbbr
    img: stateImg {
      url
    }
    thumb: stateThumb {
      url
    }
  `;

  private states: StateInfo[] = [];

  constructor(private _apollo: Apollo) {
  }

  /**
   * Get state cards from cache or from backend (in this case cache will be populated)
   *
   * The returned promise will be rejected on error
   */
  public getStates(): Promise<StateInfo[]> {
    return new Promise<StateInfo[]>((resolve, reject) => {
      if (this.states.length > 0)
        return resolve(this.states);

      const subscription = this._apollo.query<GQLStatesQuery>({
        query: gql`query {
          states {
            edges {
              node {
                id: objectId
                name: stateName
                abbr: stateAbbr
                img: stateImg {
                  url
                }
                thumb: stateThumb {
                  url
                }
              }
            }
          }
        }`,
      }).subscribe({
        next: (res: ApolloQueryResult<GQLStatesQuery>) => {
          subscription.unsubscribe();
          this.states = res.data.states.edges.map(node => node.node);
          return resolve(this.states);
        },
        error: err => {
          subscription.unsubscribe();
          reject(err);
        },
      });
    });
  }

  /**
   * Get all the state information directly from backend
   * @param stateId id of the state
   */
  public getState(stateId: string): Promise<StateCompleteInfo> {
    return new Promise<StateCompleteInfo>((resolve, reject) => {
      const subscription = this._apollo.query<GQLStateCompleteQuery>({
        query: gql`query($stateId: ID!) {
          state(id: $stateId) {
            name: stateName
            abbr: stateAbbr
            img: stateImg {
              url
            }
          }
          tourPlaces(where: {placeId: {have: {stateId: {have: {objectId: {equalTo: $stateId}}}}}}) {
            edges {
              node {
                tourId {
                  edges {
                    node {
                      ${ToursService.tourCardProjection}
                    }
                  }
                }
                # placeId
              }
            }
          }
        }`,
        variables: {
          stateId,
        },
      }).subscribe({
        next: (res: ApolloQueryResult<GQLStateCompleteQuery>) => {
          subscription.unsubscribe();

          const uniqueTours: { [tourId: string]: TourCardInfo } = {};
          for (const tourPlace of res.data.tourPlaces.edges) {
            for (const tour of tourPlace.node.tourId.edges) { // a place can be related to several tours
              const tourId = tour.node.id;
              if (!(tourId in uniqueTours))
                uniqueTours[tourId] = tour.node;
            }
          }

          const state: StateCompleteInfo = {
            state: res.data.state,
            tours: Object.values(uniqueTours),
          };

          return resolve(state);
        },
        error: err => {
          subscription.unsubscribe();
          reject(err);
        },
      });
    });
  }
}

interface GQLStateCompleteQuery {
  state: StateInfo;
  tourPlaces: {
    edges: {
      node: {
        tourId: {
          edges: {
            node: TourCardInfo;
          }[];
        }
      };
    }[];
  };
}

interface GQLStatesQuery {
  states: {
    edges: {
      node: StateInfo
    }[];
  };
}
