import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ApolloQueryResult, gql } from '@apollo/client/core';

@Component({
  selector: 'app-promotion-details',
  templateUrl: './promotion-details.component.html',
  styleUrls: ['./promotion-details.component.scss'],
})
export class PromotionDetailsComponent {
  private subscriptions: Subscription[] = [];

  public details: PromotionDetails = {} as PromotionDetails;
  //public categories: TourCategory[] = [];
  public places: PromotionPlace[] = [];
  public images: PromotionImage[] = [];

  public bgImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }
  ngOnInit(): void {
    const promoId: string = this.route.snapshot.params.promoId;
    const subscription = this.apollo.query<GQLPromotionDetailsQuery & GQLPromotionMetadataQuery>({
      query: gql`query($promoId: ID!) {
        promo: promotion(id: $promoId) {
          id: objectId
          name: promoName
          description: promoDescription
          shortDescription: promoShortDescription
          featuresIncluded: promoFeaturesIncluded
          featuresExcluded: promoFeaturesExcluded
          price: promoPrice
          img: promoImg {
            url
          }
        }
        promoPlaces: promotionPlaces(where: {promoId: {have: {
          OR: [{id: {equalTo: $promoId}, objectId: {equalTo: $promoId}}]}
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
        promoImages: promotionImages(where: {promotionId: {have: {
          OR: [{id: {equalTo: $promoId}, objectId: {equalTo: $promoId}}]}
        }}) {
          edges {
            node {
              img: promotionImg {
                url
              }
              thumb: promotionThumb {
                url
              }
            }
          }
        }
      }`,
      variables: {
        promoId,
      },
    }).subscribe((res: ApolloQueryResult<GQLPromotionDetailsQuery & GQLPromotionMetadataQuery>) => {
      //console.log(res.data.promo);
      if (!res.data.promo) {
        // TODO improve UX
        alert('La promoción con id ' + promoId + ' no existe');
        return;
      }

      // show promotion details
      this.details = {
        ...res.data.promo,
        featuresExcluded: (res.data.promo.featuresExcluded as string | undefined || undefined)?.trim().split('\n'),
        featuresIncluded: (res.data.promo.featuresIncluded as string | undefined || undefined)?.trim().split('\n'),
      };
      this.changeDetectorRef.markForCheck();

      

      this.images = res.data.promoImages.edges.map(promotionImg => promotionImg.node);
      this.places = res.data.promoPlaces.edges.map(promoPlace => {
        const place = promoPlace.node.placeId.edges[0].node;
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

interface PromotionDetails {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  featuresIncluded?: string[];
  featuresExcluded?: string[];
  price: string;
  img: {url: string};
}

interface PromotionPlace {
  id: string;
  name: string;
  state: {
    id: string;
    name: string;
  };
}

interface PromotionImage {
  thumb: { url: string };
  img: { url: string };
}

interface GQLPromotionMetadataQuery {
  promoPlaces: {
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
  promoImages: {
    edges: {
      node: PromotionImage
    }[];
  };
}

interface GQLPromotionDetailsQuery {
  promo: PromotionDetails;
}
