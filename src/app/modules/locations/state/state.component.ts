import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ApolloError, ApolloQueryResult, gql} from "@apollo/client/core";
import {Apollo} from "apollo-angular";
import {TourCardInfo} from "../../tours/TourCardInfo";
import {ToursService} from "../../tours/tours.service";

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateComponent implements OnInit, OnDestroy {
  public tours: TourCardInfo[] = [];
  public stateInfo: StateInfo = {name: '', abbr: '', img: {url: ''}} as StateInfo;

  private subscriptions: Subscription[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _apollo: Apollo,
    private _toursService: ToursService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const subscription = this._route.paramMap.subscribe(params => {
      this.fetchData(params.get("stateId") as string);
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private fetchData(stateId: string) {
    const subscription = this._apollo.query<GQLQuery>({
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
                    ${this._toursService.tourCardProjection}
                  }
                }
              }
              # placeId
            }
          }
        }
      }`,
      variables: {
        stateId
      }
    }).subscribe({
      next: (res: ApolloQueryResult<GQLQuery>) => {
        subscription.unsubscribe();

        this.stateInfo = res.data.state;

        this._changeDetectorRef.markForCheck();
        // this.tours = res.data.tourPlaces.edges.map(node => ({...node.node, thumbs: []}));

        this.subscriptions.push(subscription);
      },
      error: (err: ApolloError) => {
        subscription.unsubscribe();

        console.error(err);

        if (err.message.toLowerCase().includes("object not found")) {
          // TODO improve UX
          alert("El estado no existe");
        }
      }
    });

    this.subscriptions.push(subscription);
  }

}

interface StateInfo {
  name: string;
  abbr: string;
  img: {url: string};
}

interface GQLQuery {
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
  }
}
