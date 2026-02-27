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

interface Props {
    comments?: CommentResource[];
    productCode: string;
}

export default function ProductReviews({ comments = [], productCode }: Props) {
    // ✅ avatar ثابت (بدون بک‌اند)
    const fixedAvatar = "/assets/images/avatars/avatar.svg";

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

                    return (
                        <ReviewRoot key={ind}>
                            <div className="user-info">
                                <Avatar
                                    variant="rounded"
                                    className="user-avatar"
                                    src={fixedAvatar}
                                    alt={owner?.username || "user"}
                                    sx={{ bgcolor: "grey.100" }}
                                    imgProps={{ style: { objectFit: "cover" } }}
                                />

                                <div>
                                    <Typography variant="h5" sx={{ mb: 1 }}>
                                        {owner?.username || t("common.noData")}
                                    </Typography>

                                    <div className="user-rating">
                                        <Rating size="small" value={comment.rating} readOnly />
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