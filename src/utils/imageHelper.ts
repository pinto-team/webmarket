// file:/D:/taavoni-online-backup/src/utils/imageHelper.ts

import { ImageResource } from "@/types/product.types";
import { getProductImageUrl } from "@/utils/imageUtils";

export const getProductThumbnail = (upload?: ImageResource | null): string => {
    return getProductImageUrl({ upload }, "150x150");
};

export const getProductMainImage = (upload?: ImageResource | null): string => {
    return getProductImageUrl({ upload }, "800x800");
};
