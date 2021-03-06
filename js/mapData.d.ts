export declare type RecreationData = {
    recAreas: RecreationArea[];
    tags: TagData[];
};
export declare type RecreationArea = {
    areaName: string;
    areaDescriptionHTML?: string;
    locationDescription: string;
    geocoordinates: [number, number];
    tags: string[];
    keywords?: string;
    websites?: WebsiteData[];
};
export declare type TagData = {
    tag: string;
    displayName?: string;
    tagCategory?: "Recreation" | "Seasonal Summer Activity" | "Seasonal Winter Activity" | "Sport";
    hexColor?: string;
    iconClass?: string;
    keywords?: string;
};
export declare type WebsiteData = {
    websiteTitle: string;
    websiteUrl: string;
};
export declare const recMapData: RecreationData;
