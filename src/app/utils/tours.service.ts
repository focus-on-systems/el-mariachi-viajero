import { Injectable } from '@angular/core';
import {Apollo} from "apollo-angular";
import {ApolloQueryResult, gql} from "@apollo/client/core";
import {TourCardInfo} from "../modules/tours/TourCardInfo";
import {Subscription} from "rxjs";
import {CategoryInfo} from "./tour-categories/CategoryInfo";
import {CategoryCompleteInfo} from "../modules/tours/tour-category/CategoryCompleteInfo";

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
    # featuresIncluded: tourFeaturesIncluded
    # featuresExcluded: tourFeaturesExcluded
    price: tourPrice
  `;

  private categories: CategoryInfo[] = [];

  constructor(private _apollo: Apollo) {
  }

  /**
   * Get all the category information directly from backend
   * @param categoryId id of the state
   */
  public getCategory(categoryId: string): Promise<CategoryCompleteInfo> {
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
          tourCategories(where: {categoryId: {have: {objectId: {equalTo: $categoryId}}}}) {
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
        next: (res: ApolloQueryResult<GQLCategoryCompleteQuery>) => {
          subscription.unsubscribe();

          const uniqueTours: {[tourId: string]: TourCardInfo} = {};
          for (const tourCategory of res.data.tourCategories.edges) {
            for (const tour of tourCategory.node.tourId.edges) { // a category can be related to several tours
              const tourId = tour.node.id;
              if (!(tourId in uniqueTours))
                uniqueTours[tourId] = tour.node;
            }
          }

          const category: CategoryCompleteInfo = {
            category: res.data.category,
            tours: Object.values(uniqueTours)
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
            toursIdIdxMap[tours[i].id] = i; // WARNING: this has a race condition. What if the array was updated while the subscription received the event?

          // assign each thumb to the corresponding tour object
          for (const thumb of res.data.tourImages.edges)
            tours[toursIdIdxMap[thumb.node.tourId.edges[0].node.id]].thumbs.push(thumb.node.thumb);

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
