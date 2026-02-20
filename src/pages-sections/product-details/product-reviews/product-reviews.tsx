"use client";

import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

// LOCAL CUSTOM COMPONENT
import ReviewForm from "./review-form";

// TYPES
import { CommentResource } from "@/types/product.types";

// STYLED COMPONENTS
import { ReviewRoot } from "./styles";

import { t } from "@/i18n/t";
import { formatPersianDate, toPersianNumber } from "@/utils/persian";

import ProductImage from "@/components/common/ProductImage";
import { getServerImageUrl, isPlaceholderProductImage } from "@/utils/imageUtils";

interface Props {
    comments?: CommentResource[];
    productCode: string;
}

export default function ProductReviews({ comments = [], productCode }: Props) {
    const fallbackAvatar = "/assets/images/avatars/001-man.svg";

    return (
        <div>
            {/* REVIEW LIST */}
            {comments.length === 0 ? (
                <Typography variant="body1" sx={{ color: "grey.600", mb: 4 }}>
                    {t("productDetail.noReviewsYet")}
                </Typography>
            ) : (
                comments.map((comment, ind) => {
                    const owner = comment.ownerable;

                    // proxy-only candidate (optional local fallback if missing)
                    const candidate = getServerImageUrl(owner, "120x120", 75);
                    const hasProxy = candidate && !isPlaceholderProductImage(candidate);

                    return (
                        <ReviewRoot key={ind}>
                            <div className="user-info">
                                <Avatar variant="rounded" className="user-avatar" sx={{ bgcolor: "grey.100" }}>
                                    {hasProxy ? (
                                        <ProductImage
                                            src={candidate}
                                            alt={owner.username}
                                            size="120x120"
                                            quality={75}
                                            fallback="placeholder"
                                            noWrapper
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                    ) : (
                                        // deterministic local fallback
                                        <img
                                            src={fallbackAvatar}
                                            alt={owner.username}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                            loading="lazy"
                                        />
                                    )}
                                </Avatar>

                                <div>
                                    <Typography variant="h5" sx={{ mb: 1 }}>
                                        {owner.username}
                                    </Typography>

                                    <div className="user-rating">
                                        <Rating size="small" value={comment.rating} color="warn" readOnly />
                                        <Typography variant="h6">{toPersianNumber(comment.rating)}</Typography>
                                        <Typography component="span">{formatPersianDate(comment.created_at)}</Typography>
                                    </div>
                                </div>
                            </div>

                            <Typography variant="body1" sx={{ color: "grey.700" }}>
                                {comment.description}
                            </Typography>
                        </ReviewRoot>
                    );
                })
            )}

            {/* REVIEW FORM */}
            <Typography variant="h3" sx={{ mt: 7, mb: 2.5 }}>
                {t("productDetail.writeReview")}
            </Typography>

            <ReviewForm productCode={productCode} />
        </div>
    );
}