import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "./types";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Artikel
 *
 *
 */
export interface Post extends SanityDocument {
  _type: "post";

  /**
   * Titel — `string`
   *
   *
   */
  title: string;

  /**
   * Link-Name — `slug`
   *
   * Titel eingeben, dann einfach auf "Generate" clicken ;)
   */
  slug: { _type: "slug"; current: string };

  /**
   * Titelbild — `image`
   *
   *
   */
  mainImage?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Kategorien — `array`
   *
   *
   */
  categories?: Array<SanityKeyedReference<Category>>;

  /**
   * Datum — `date`
   *
   *
   */
  publishedAt?: string;

  /**
   * Inhalt — `blockContent`
   *
   *
   */
  body?: BlockContent;
}

/**
 * Kategorie
 *
 *
 */
export interface Category extends SanityDocument {
  _type: "category";

  /**
   * Name — `string`
   *
   *
   */
  title: string;

  /**
   * Beschreibung — `text`
   *
   *
   */
  description?: string;
}

export type BlockContent = Array<
  | SanityKeyed<SanityBlock>
  | SanityKeyed<{
      _type: "image";
      asset: SanityReference<SanityImageAsset>;
      crop?: SanityImageCrop;
      hotspot?: SanityImageHotspot;
    }>
>;

export type Documents = Post | Category;
