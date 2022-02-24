export interface Category {
  id: string;
  name: string;
  icon: string;
  iconType: IconType;
  img: {
    url: string;
  };
  thumb: {
    url: string;
  };
}

enum IconType {
  class = 1,
  img = 2,
  emoji = 3
}
