import Image from "next/image";
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
    return (
        <div>
            {/* REVIEW LIST */}
            {comments.length === 0 ? (
                <Typography variant="body1" sx={{ color: "grey.600", mb: 4 }}>
                    {t("productDetail.noReviewsYet")}
                </Typography>
            ) : (
                comments.map((comment, ind) => (
                    <ReviewRoot key={ind}>
                        <div className="user-info">
                            <Avatar variant="rounded" className="user-avatar">
                                {comment.ownerable.upload?.main_url && (
                                    <Image
                                        src={comment.ownerable.upload.main_url}
                                        alt={comment.ownerable.username}
                                        fill
                                        sizes="(48px 48px)"
                                    />
                                )}
                            </Avatar>

                            <div>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    {comment.ownerable.username}
                                </Typography>

                                <div className="user-rating">
                                    <Rating size="small" value={comment.rating} color="warn" readOnly />
                                    <Typography variant="h6">{toPersianNumber(comment.rating)}</Typography>
                                    <Typography component="span">
                                        {formatPersianDate(comment.created_at)}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <Typography variant="body1" sx={{ color: "grey.700" }}>
                            {comment.description}
                        </Typography>
                    </ReviewRoot>
                ))
            )}

            {/* REVIEW FORM */}
            <Typography variant="h3" sx={{ mt: 7, mb: 2.5 }}>
                {t("productDetail.writeReview")}
            </Typography>

            <ReviewForm productCode={productCode} />
        </div>
    );
}
