import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {Subscription} from "rxjs";
import { TourCardInfo } from '../TourCardInfo';

@Component({
  selector: 'app-manage-tours',
  templateUrl: './manage-tours.component.html',
  styleUrls: ['./manage-tours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageToursComponent implements OnInit, OnDestroy {

  public tours: TourCardInfo[] = [];

  private subscriptions: Subscription[] = [];

  private readonly pageSize: number = 10;
  private lastQueriedId: string = '';

  constructor(private _apollo: Apollo, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadTours();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Loads (more) tours from the backend
   */
  public loadTours(): void {
    const subscription = this._apollo.query<GQLToursCardQuery>({
      query: gql`query($limit: Int!, $lastQueriedId: String!) {
        tours(first: $limit, after: $lastQueriedId, where: {tourIsActive: {equalTo: true}}) {
          edges {
            node {
              id: objectId
              name: tourName
              shortDescription: tourShortDescription
#              featuresIncluded: tourFeaturesIncluded
#              featuresExcluded: tourFeaturesExcluded
              price: tourPrice
            }
          }
        }
      }`,
      variables: {
        limit: this.pageSize,
        lastQueriedId: this.lastQueriedId
      }
    }).subscribe((res: ApolloQueryResult<GQLToursCardQuery>) => {
      this.tours = res.data.tours.edges.map(node => ({...node.node, thumbs: []}));

      // once tour information has been fetched for each node, fetch their images
      const subscription1 = this._apollo.query<GQLToursThumbsQuery>({
        query: gql`query {
          tourImages(where: {
            OR: [${this.tours.map(t => `{tourId: {have: {objectId: {equalTo: "${t.id}"}}}}`).join(',')}]
          }) {
            edges {
              node {
                tourId {
                  edges {
                    node {
                      id: objectId
                    }
                  }
                }
                thumb: tourThumb {
                  url
                }
              }
            }
          }
        }`
      }).subscribe((res: ApolloQueryResult<GQLToursThumbsQuery>) => {
        // map the id of the tour with its index inside the tours array
        const toursIdIdxMap: {[id: string]: number} = {};
        for (let i = 0; i < this.tours.length; ++i)
          toursIdIdxMap[this.tours[i].id] = i;

        // assign each thumb to the corresponding tour object
        for (const thumb of res.data.tourImages.edges) {
          const tour = this.tours[toursIdIdxMap[thumb.node.tourId.edges[0].node.id]];
          tour.thumbs = tour.thumbs.concat(thumb.node.thumb);
        }

        // update the last queried index and notify angular the array has been updated, so it renders the tour cards
        this.lastQueriedId = this.tours[this.tours.length - 1].id;
        this._changeDetectorRef.markForCheck();

        subscription1.unsubscribe();
      });

      this.subscriptions.push(subscription1);
      subscription.unsubscribe();
    });

    this.subscriptions.push(subscription);
  }
}

interface GQLToursCardQuery {
  tours: {
    edges: {
      node: TourCardInfo;
    }[];
  }
}

interface GQLToursThumbsQuery {
  tourImages: {
    edges: {
      node: {
        tourId: {
          edges: {
            node: {
              id: string;
            }
          }[]
        };
        thumb: {url: string}[];
      };
    }[];
  }
}
