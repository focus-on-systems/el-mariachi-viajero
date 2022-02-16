import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {Apollo} from "apollo-angular";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatesComponent implements OnInit, OnDestroy {
  public states: StateCardInfo[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private _apollo: Apollo, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    // retrieve carousel slides information
    // TODO use a service to fetch and cache this stuff
    const subscription = this._apollo.query<GQLStatesQuery>({
      query: gql`query {
        states {
          edges {
            node {
              id
              name: stateName
              thumb: stateThumb {
                url
              }
            }
          }
        }
      }`
    }).subscribe((res: ApolloQueryResult<GQLStatesQuery>) => {
      this.states = res.data.states.edges.map(node => node.node);

      this._changeDetectorRef.markForCheck();

      subscription.unsubscribe();
    });
    this.subscriptions.push(subscription); // subscription is still added to the array to be sure there is no leak
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

interface StateCardInfo {
  id: string;
  name: string;
  thumb: {url: string};
}

interface GQLStatesQuery {
  states: {
    edges: {
      node: StateCardInfo
    }[];
  }
}
