import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ApolloQueryResult, gql } from '@apollo/client/core';

@Component({
  selector: 'app-pack-details',
  templateUrl: './pack-details.component.html',
  styleUrls: ['./pack-details.component.scss'],
})
export class PackDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public details: PackDetails = {} as PackDetails;
  //public categories: TourCategory[] = [];
  public places: PackPlace[] = [];
  public images: PackImage[] = [];

  public bgImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    const packId: string = this.route.snapshot.params.packId;
    const subscription = this.apollo.query<GQLPackDetailsQuery & GQLPackMetadataQuery>({
      query: gql`query($packId: ID!) {
        pack(id: $packId) {
          id: objectId
          name: packName
          description: packDescription
          shortDescription: packShortDescription
          featuresIncluded: packFeaturesIncluded
          featuresExcluded: packFeaturesExcluded
          price: packPrice
          isActive: packIsActive
          img: packImg {
            url
          }
        }
        packPlaces(where: {packId: {have: {
          OR: [{id: {equalTo: $packId}, objectId: {equalTo: $packId}}],
          packIsActive: {equalTo: true}}
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
        packImages(where: {packId: {have: {
          OR: [{id: {equalTo: $packId}, objectId: {equalTo: $packId}}],
          packIsActive: {equalTo: true}}
        }}) {
          edges {
            node {
              img: packImg {
                url
              }
              thumb: packThumb {
                url
              }
            }
          }
        }
      }`,
      variables: {
        packId,
      },
    }).subscribe((res: ApolloQueryResult<GQLPackDetailsQuery & GQLPackMetadataQuery>) => {
      if (!res.data.pack) {
        // TODO improve UX
        alert('El paquete con id ' + packId + ' no existe');
        return;
      }

      // show pack details
      this.details = {
        ...res.data.pack,
        featuresExcluded: (res.data.pack.featuresExcluded as string | undefined || undefined)?.trim().split('\n'),
        featuresIncluded: (res.data.pack.featuresIncluded as string | undefined || undefined)?.trim().split('\n'),
      };
      this.changeDetectorRef.markForCheck();

      this.images = res.data.packImages.edges.map(packImg => packImg.node);
      this.places = res.data.packPlaces.edges.map(packPlace => {
        const place = packPlace.node.placeId.edges[0].node;
        return {
          id: place.id,
          name: place.name,
          state: {
            id: place.stateId.edges[0].node.id,
            name: place.stateId.edges[0].node.name,
          },
        };
      });

      this.bgImage = this.details.img.url;
      this.changeDetectorRef.markForCheck();

      subscription.unsubscribe();
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}

interface PackDetails {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  featuresIncluded?: string[];
  featuresExcluded?: string[];
  price: string;
  isActive: boolean;
  img: {url: string};
}

interface PackPlace {
  id: string;
  name: string;
  state: {
    id: string;
    name: string;
  };
}

interface PackImage {
  thumb: { url: string };
  img: { url: string };
}

interface GQLPackMetadataQuery {
  packPlaces: {
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
  packImages: {
    edges: {
      node: PackImage
    }[];
  };
}

interface GQLPackDetailsQuery {
  pack: PackDetails;
}
