import { Injectable } from '@angular/core';
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {TourCardInfo} from "../modules/tours/tour-card/TourCardInfo";
import {Subscription} from "rxjs";
import {CategoryInfo} from "./tour-categories/CategoryInfo";
import {CategoryCompleteInfo} from "../modules/tours/tour-category/CategoryCompleteInfo";
import {LocationsService} from "./locations.service";
import {StateInfo} from "./states/StateInfo";

@Injectable({
  providedIn: 'root'
})
export class ToursService {
  /**
   * GraphQL fields to get from the tour (as card)
   *
   * If you update this -> REMEMBER to also update the interfaces and code depending on this
   */
  public static tourCardProjection = `
    id: objectId
    name: tourName
    shortDescription: tourShortDescription
    featuresIncluded: tourFeaturesIncluded
    featuresExcluded: tourFeaturesExcluded
    price: tourPrice
  `;

  public static categoryInfoProjection = `
    id: objectId
    name: categoryName
    icon: categoryIcon
    iconType: categoryIconType
    img: categoryImg {
      url
    }
    thumb: categoryThumb {
      url
    }
  `;

  private categories: CategoryInfo[] = [];

  constructor(private _apollo: Apollo) {
  }

  /**
   * Get all the category information directly from backend
   * @param categoryId id of the state
   * @param withToursMeta if true, metadata for each tour will be queried with {@link fillToursMetadata} (one single query)
   */
  public getCategory(categoryId: string, withToursMeta: boolean = true): Promise<CategoryCompleteInfo> {
    return new Promise<CategoryCompleteInfo>((resolve, reject) => {
      // fetch all data for category from backend
      const subscription: Subscription = this._apollo.query<GQLCategoryCompleteQuery>({
        query: gql`query($categoryId: ID!) {
          category(id: $categoryId) {
            id: objectId
            name: categoryName
            icon: categoryIcon
            iconType: categoryIconType
            img: categoryImg {
              url
            }
            thumb: categoryThumb {
              url
            }
          }
          tourCategories(where: {
            categoryId: {have: {objectId: {equalTo: $categoryId}}},
            tourId: {have: {tourIsActive: {equalTo: true}}}
          }) {
            edges {
              node {
                tourId {
                  edges {
                    node {
                      ${ToursService.tourCardProjection}
                    }
                  }
                }
              }
            }
          }
        }`,
        variables: {
          categoryId
        }
      }).subscribe({
        next: async (res: ApolloQueryResult<GQLCategoryCompleteQuery>) => {
          subscription.unsubscribe();

          const uniqueTours: {[tourId: string]: TourCardInfo} = {};
          for (const tourCategory of res.data.tourCategories.edges) {
            for (const tour of tourCategory.node.tourId.edges) { // a category can be related to several tours
              const tourId = tour.node.id;
              if (!(tourId in uniqueTours)) {
                // create a new object to not mess up the cache
                uniqueTours[tourId] = {
                  ...tour.node,

                  // features come separated by line spaces
                  // think carefully, and you'll see the code covers the case when there is an empty string ("" || undefined)
                  featuresExcluded: (tour.node.featuresExcluded as string | undefined || undefined)?.trim().split('\n'),
                  featuresIncluded: (tour.node.featuresIncluded as string | undefined || undefined)?.trim().split('\n'),

                  categories: withToursMeta ? [] /*fillToursMetadata should fill the array*/ : [res.data.category]
                };
              }
            }
          }

          const uniqueToursArr: TourCardInfo[] = Object.values(uniqueTours);

          if (withToursMeta)
            await this.fillToursMetadata(uniqueToursArr); // 🤞 let's hope there is no error here

          const category: CategoryCompleteInfo = {
            category: res.data.category,
            tours: uniqueToursArr
          };

          return resolve(category);
        },
        error: err => {
          subscription.unsubscribe();
          reject(err);
        }
      });
    });
  }

  /**
   * Get state cards from cache or from backend (in this case cache will be populated)
   *
   * The returned promise will be rejected on error
   */
  public getCategories(): Promise<CategoryInfo[]> {
    return new Promise<CategoryInfo[]>((resolve, reject) => {
      if (this.categories.length > 0)
        return resolve(this.categories);

      // fetch categories from backend
      const subscription: Subscription = this._apollo.query<GQLCategoriesQuery>({
        query: gql`query {
          categories {
            edges {
              node {
                id: objectId
                name: categoryName
                icon: categoryIcon
                iconType: categoryIconType
                img: categoryImg {
                  url
                }
                thumb: categoryThumb {
                  url
                }
              }
            }
          }
        }`
      }).subscribe({
        next: (res: ApolloQueryResult<GQLCategoriesQuery>) => {
          subscription.unsubscribe();
          this.categories = res.data.categories.edges.map(c => c.node);
          return resolve(this.categories);
        },
        error: err => {
          subscription.unsubscribe();
          reject(err);
        }
      });
    });
  }

  /**
   * Query the server to get the corresponding image for each tour
   *
   * To prevent side effects, don't update the array until the promise returned is resolved or rejected
   *
   * @param tours array of tours just with tour's text information, without images. This array will be updated
   * @see fillToursMetadata
   * @return the same array received after the update
   */
  public fillToursThumbs(tours: TourCardInfo[]): Promise<TourCardInfo[]> {
    return new Promise<TourCardInfo[]>((resolve, reject) => {
      const subscription: Subscription = this._apollo.query<GQLToursThumbsQuery>({
        query: gql`query {
          tourImages(where: {
            OR: [${tours.map(t => `{tourId: {have: {objectId: {equalTo: "${t.id}"}}}}`).join(',')}]
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
      }).subscribe({
        next: (res: ApolloQueryResult<GQLToursThumbsQuery>) => {
          subscription.unsubscribe();

          // map the id of the tour with its index inside the tours array
          const toursIdIdxMap: {[id: string]: number} = {};
          for (let i = 0; i < tours.length; ++i)
            toursIdIdxMap[tours[i].id] = i;

          // assign each thumb to the corresponding tour object
          for (const thumb of res.data.tourImages.edges) {
            const tour = tours[toursIdIdxMap[thumb.node.tourId.edges[0].node.id]];
            if (tour.thumbs)
              tour.thumbs.push(thumb.node.thumb);
            else
              tour.thumbs = [thumb.node.thumb];
          }

          return resolve(tours);
        },
        error: err => {
          subscription.unsubscribe();
          reject(err);
        }
      });
    });
  }

  /**
   * Query the server to get the corresponding metadata for each tour
   *
   * Metadata includes:
   * - tour categories
   * - tour places and states
   * - tour thumb images (similar to {@link fillToursThumbs})
   *
   * To prevent side effects, don't update the array until the promise returned is resolved or rejected
   *
   * @param tours array of tours just with tour's text information, without images. This array will be updated
   * @see fillToursThumbs
   * @return the same array received after the update
   */
  public fillToursMetadata(tours: TourCardInfo[]): Promise<TourCardInfo[]> {
    const query = `[${tours.map(t => `{tourId: {have: {objectId: {equalTo: "${t.id}"}}}}`).join(',')}]`
    return new Promise<TourCardInfo[]>((resolve, reject) => {
      const subscription: Subscription = this._apollo.query<GQLToursMetadataQuery>({
        query: gql`query {
          tourCategories(where: {OR: ${query}}) {
            edges {
              node {
                tourId {
                  edges {
                    node {
                      id: objectId
                    }
                  }
                }
                categoryId {
                  edges {
                    node {
                      ${ToursService.categoryInfoProjection}
                    }
                  }
                }
              }
            }
          }
          tourPlaces(where: {OR: ${query}}) {
            edges {
              node {
                tourId {
                  edges {
                    node {
                      id: objectId
                    }
                  }
                }
                placeId {
                  edges {
                    node {
                      id: objectId
                      name: placeName
                      stateId {
                        edges {
                          node {
                            ${LocationsService.stateInfoProjection}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          tourImages(where: {OR: ${query}}) {
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
      }).subscribe({
        next: (res: ApolloQueryResult<GQLToursMetadataQuery>) => {
          subscription.unsubscribe();

          // map the id of the tour with its index inside the tours array
          const toursIdIdxMap: {[id: string]: number} = {};
          for (let i = 0; i < tours.length; ++i)
            toursIdIdxMap[tours[i].id] = i;

          // assign each thumb to the corresponding tour object
          for (const thumb of res.data.tourImages.edges) {
            const tour = tours[toursIdIdxMap[thumb.node.tourId.edges[0].node.id]];
            if (tour.thumbs)
              tour.thumbs.push(thumb.node.thumb);
            else
              tour.thumbs = [thumb.node.thumb];
          }

          // assign states
          for (const place of res.data.tourPlaces.edges) {
            const tour = tours[toursIdIdxMap[place.node.tourId.edges[0].node.id]];
            tour.state = place.node.placeId.edges[0].node.stateId.edges[0].node;
            // it is possible that this assignment is made more than once for the same tour
            // (in case the same tour relates to multiple places)
            // but that doesn't matter
          }

          // assign categories
          for (const category of res.data.tourCategories.edges) {
            const tour = tours[toursIdIdxMap[category.node.tourId.edges[0].node.id]];
            if (tour.categories)
              tour.categories.push(category.node.categoryId.edges[0].node);
            else
              tour.categories = [category.node.categoryId.edges[0].node];
          }

          return resolve(tours);
        },
        error: err => {
          subscription.unsubscribe();
          reject(err);
        }
      });
    });
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
        thumb: {url: string};
      };
    }[];
  }
}

interface GQLCategoriesQuery {
  categories: {
    edges: {
      node: CategoryInfo;
    }[];
  }
}

interface GQLCategoryCompleteQuery {
  category: CategoryInfo;
  tourCategories: {
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

interface GQLToursMetadataQuery {
  tourCategories: {
    edges: {
      node: {
        tourId: {
          edges: {
            node: {
              id: string;
            }
          }[];
        };
        categoryId: {
          edges: {
            node: CategoryInfo
          }[];
        }
      }
    }[];
  };
  tourPlaces: {
    edges: {
      node: {
        tourId: {
          edges: {
            node: {
              id: string;
            }
          }[];
        };
        placeId: {
          edges: {
            node: {
              id: string;
              name: string;
              stateId: {
                edges: {
                  node: StateInfo
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
      node: {
        tourId: {
          edges: {
            node: {
              id: string;
            }
          }[]
        };
        thumb: {url: string};
      }
    }[];
  }
}
