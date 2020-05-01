export type RecreationData = {
  recAreas: RecreationArea[],
  tags: TagData[]
};

export type RecreationArea = {
  areaName: string,
  areaDescriptionHTML?: string,
  geocoordinates: [number, number],
  tags: string[], // must be lower case
  keywords?: string  // must be lower case
};

export type TagData = {
  tag: string, // must be lower case
  displayName?: string,
  tagCategory?: "Recreation" | "Seasonal Summer Activity" | "Seasonal Winter Activity" | "Sport",
  hexColor?: string,
  iconClass?: string,
  keywords?: string // must be lower case
};


export const recMapData: RecreationData = {
  recAreas: [
    {
      areaName: "Anna Marinelli Park",
      geocoordinates: [46.521016, -84.356337],
      tags: []
    }, {
      areaName: "Anna McCrea Rink",
      geocoordinates: [46.5057029, -84.2895557],
      tags: ["outdoor-rink"]
    }, {
      areaName: "Arizona Park",
      geocoordinates: [46.515199,	-84.281224],
      tags: []
    }, {
      areaName: "Bellevue Park",
      areaDescriptionHTML: "Includes Friendship Trail, Picnic Shelter, Sensory Playground, Adventure Playground, and Splash Pad.",
      geocoordinates: [46.50053, -84.299119],
      tags: ["playground", "splash-pad"]
    }
  ],
  tags: [

    // Recreation
    {
      tag: "dog-park",
      tagCategory: "Recreation"
    }, {
      tag: "playground",
      tagCategory: "Recreation"
    },

    // Seasonal Summer Activity
    {
      tag: "outdoor-pool",
      tagCategory: "Seasonal Summer Activity",
      searchTerms: ["swimming"]
    }, {
      tag: "splash-pad",
      tagCategory: "Seasonal Summer Activity"
    },

    // Seasonal Summer Activity
    {
      tag: "outdoor-rink",
      tagCategory: "Seasonal Winter Activity",
      searchTerms: ["skating"]
    },

    // Sport
    {
      tag: "baseball",
      tagCategory: "Sport"
    }, {
      tag: "basketball",
      tagCategory: "Sport"
    }, {
      tag: "bocce",
      tagCategory: "Sport"
    }, {
      tag: "cricket",
      tagCategory: "Sport"
    }, {
      tag: "disc-golf",
      tagCategory: "Sport",
      searchTerms: ["frisbee"]
    }, {
      tag: "football",
      tagCategory: "Sport"
    }, {
      tag: "pickleball",
      tagCategory: "Sport"
    }, {
      tag: "soccer",
      tagCategory: "Sport"
    }, {
      tag: "tennis",
      tagCategory: "Sport"
    }, {
      tag: "track",
      tagCategory: "Sport"
    }, {
      tag: "ultimate-frisbee",
      tagCategory: "Sport"
    }
  ]
};
