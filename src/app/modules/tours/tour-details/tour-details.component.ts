import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public details: TourDetails = {} as TourDetails;
  public categories: TourCategory[] = [];
  public places: TourPlace[] = [];
  public images: TourImage[] = [];

  public bgImage: string = "";

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const tourId: string = this.route.snapshot.params.tourId;

    const subscription = this.apollo.query<GQLTourDetailsQuery & GQLTourMetadataQuery>({
      query: gql`query($tourId: ID!) {
        tour(id: $tourId) {
          id: objectId
          name: tourName
          description: tourDescription
          shortDescription: tourShortDescription
          featuresIncluded: tourFeaturesIncluded
          featuresExcluded: tourFeaturesExcluded
          price: tourPrice
          isActive: tourIsActive
        }
        tourCategories(where: {tourId: {have: {
          objectId: {equalTo: $tourId},
          tourIsActive: {equalTo: true}}
        }}) {
          edges {
            node {
              categoryId {
                edges {
                  node {
                    id: objectId
                    name: categoryName
                    img: categoryImg {
                      url
                    }
                  }
                }
              }
            }
          }
        }
        tourPlaces(where: {tourId: {have: {
          objectId: {equalTo: $tourId},
          tourIsActive: {equalTo: true}}
        }}) {
          edges {
            node {
              placeId {
                edges {
                  node {
                    id: objectId
                    name: placeName
                    stateId {
                      edges {
                        node {
                          id: objectId
                          name: stateName
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        tourImages(where: {tourId: {have: {
          objectId: {equalTo: $tourId},
          tourIsActive: {equalTo: true}}
        }}) {
          edges {
            node {
              img: tourImg {
                url
              }
              thumb: tourThumb {
                url
              }
            }
          }
        }
      }`,
      variables: {
        tourId
      }
    }).subscribe((res: ApolloQueryResult<GQLTourDetailsQuery & GQLTourMetadataQuery>) => {
      if (!res.data.tour) {
        // TODO improve UX
        alert("El tour con id " + tourId + " no existe");
        return;
      }

      // show tour details
      this.details = {
        ...res.data.tour,
        featuresExcluded: (res.data.tour.featuresExcluded as string | undefined || undefined)?.trim().split('\n'),
        featuresIncluded: (res.data.tour.featuresIncluded as string | undefined || undefined)?.trim().split('\n')
      };
      this.changeDetectorRef.markForCheck();

      this.categories = res.data.tourCategories.edges.map(tourCategory => tourCategory.node.categoryId.edges[0].node);
      this.images = res.data.tourImages.edges.map(tourImg => tourImg.node);
      this.places = res.data.tourPlaces.edges.map(tourPlace => {
        const place = tourPlace.node.placeId.edges[0].node;
        return {
          id: place.id,
          name: place.name,
          state: {
            id: place.stateId.edges[0].node.id,
            name: place.stateId.edges[0].node.name
          }
        };
      });

      this.bgImage = this.images[0].img.url;
      this.changeDetectorRef.markForCheck();

      subscription.unsubscribe();
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}

interface TourDetails {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  featuresIncluded?: string[];
  featuresExcluded?: string[];
  price: string;
  isActive: boolean;
}

interface TourCategory {
  id: string;
  name: string;
  img: {url: string};
}

interface TourPlace {
  id: string;
  name: string;
  state: {
    id: string;
    name: string;
  }
}

interface TourImage {
  thumb: {url: string};
  img: {url: string};
}

interface GQLTourMetadataQuery {
  tourCategories: {
    edges: {
      node: {
        categoryId: {
          edges: {
            node: TourCategory
          }[];
        }
      }
    }[];
  };
  tourPlaces: {
    edges: {
      node: {
        placeId: {
          edges: {
            node: {
              id: string;
              name: string;
              stateId: {
                edges: {
                  node: {
                    id: string;
                    name: string;
                  }
                }[];
              }
            }
          }[];
        }
      }
    }[];
  };
  tourImages: {
    edges: {
      node: TourImage
    }[];
  }
}

interface GQLTourDetailsQuery {
  tour: TourDetails
}
