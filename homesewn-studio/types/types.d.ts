/**
 * Represents a reference in Sanity to another entity. Note that the
 * generic type is strictly for TypeScript meta programming.
 */
export declare type SanityReference<_T> = {
    _type: 'reference';
    _ref: string;
};
/**
 * Represents a reference in Sanity to another entity with a key. Note that the
 * generic type is strictly for TypeScript meta programming.
 */
export declare type SanityKeyedReference<_T> = {
    _type: 'reference';
    _key: string;
    _ref: string;
};
/**
 * This was an incorrect type. See here:
 * https://github.com/ricokahler/sanity-codegen/issues/165
 *
 * @deprecated
 */
export declare type SanityAsset = SanityReference<any>;
/**
 * @deprecated
 */
export interface SanityImage {
    asset: SanityAsset;
}
/**
 * @deprecated
 */
export interface SanityFile {
    asset: SanityAsset;
}
export interface SanityGeoPoint {
    _type: 'geopoint';
    lat: number;
    lng: number;
    alt: number;
}
export interface SanityBlock {
    _type: 'block';
    [key: string]: any;
}
export interface SanityDocument {
    _id: string;
    _createdAt: string;
    _rev: string;
    _updatedAt: string;
}
export interface SanityImageCrop {
    _type: 'sanity.imageCrop';
    bottom: number;
    left: number;
    right: number;
    top: number;
}
export interface SanityImageHotspot {
    _type: 'sanity.imageHotspot';
    height: number;
    width: number;
    x: number;
    y: number;
}
export declare type SanityKeyed<T> = T extends object ? T & {
    _key: string;
} : T;
export interface SanityImageAsset extends SanityDocument {
    _type: 'sanity.imageAsset';
    assetId: string;
    extension: string;
    metadata: SanityImageMetadata;
    mimeType: string;
    originalFilename: string;
    path: string;
    sha1hash: string;
    size: number;
    uploadId: string;
    url: string;
}
export interface SanityImageMetadata {
    _type: 'sanity.imageMetadata';
    dimensions: SanityImageDimensions;
    hasAlpha: boolean;
    isOpaque: boolean;
    lqip: string;
    palette: SanityImagePalette;
}
export interface SanityImageDimensions {
    _type: 'sanity.imageDimensions';
    aspectRatio: number;
    height: number;
    width: number;
}
export interface SanityImagePalette {
    _type: 'sanity.imagePalette';
    darkMuted: SanityImagePaletteSwatch;
    darkVibrant: SanityImagePaletteSwatch;
    dominant: SanityImagePaletteSwatch;
    lightMuted: SanityImagePaletteSwatch;
    lightVibrant: SanityImagePaletteSwatch;
    muted: SanityImagePaletteSwatch;
    vibrant: SanityImagePaletteSwatch;
}
export interface SanityImagePaletteSwatch {
    _type: 'sanity.imagePaletteSwatch';
    background: string;
    foreground: string;
    population: number;
    title: string;
}
