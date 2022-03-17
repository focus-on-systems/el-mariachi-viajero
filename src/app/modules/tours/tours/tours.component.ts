import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TourCardInfo } from '../tour-card/TourCardInfo';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { ToursService } from '../../../utils/tours.service';
import { ApolloQueryResult, gql } from '@apollo/client/core';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToursComponent implements OnInit, OnDestroy {
  public tours: TourCardInfo[] = [];

  private subscriptions: Subscription[] = [];

  private readonly pageSize: number = 10;
  private lastQueriedId: string = '';

  constructor(
    private _apollo: Apollo,
    private _changeDetectorRef: ChangeDetectorRef,
    private _toursService: ToursService,
  ) {
  }

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
              ${ToursService.tourCardProjection}
            }
          }
        }
      }`,
      variables: {
        limit: this.pageSize,
        lastQueriedId: this.lastQueriedId,
      },
    }).subscribe(async (res: ApolloQueryResult<GQLToursCardQuery>) => {
      subscription.unsubscribe();

      this.tours = res.data.tours.edges.map(node => ({ ...node.node, thumbs: [] }));

      // get images for each tour
      this.tours = await this._toursService.fillToursThumbs(this.tours);

      this._changeDetectorRef.markForCheck();
    });

    this.subscriptions.push(subscription);
  }
}

interface GQLToursCardQuery {
  tours: {
    edges: {
      node: TourCardInfo;
    }[];
  };
}
