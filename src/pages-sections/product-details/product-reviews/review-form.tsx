"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { FormProvider, TextField } from "components/form-hook";
import { RatingGroup } from "./styles";
import { useComments } from "@/hooks/useComments";
import { t } from "@/i18n/t";

const validationSchema = yup.object().shape({
    rating: yup.number().required(t("productDetail.ratingRequired")),
    comment: yup.string().required(t("productDetail.commentRequired")),
});

interface Props {
    productCode: string;
}

export default function ReviewForm({ productCode }: Props) {
    const { addComment } = useComments([], productCode);

    const initialValues = {
        rating: 0,
        comment: "",
        date: new Date().toISOString(),
    };

    const methods = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
    });

    const {
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const handleSubmitForm = handleSubmit(async (values) => {
        try {
            await addComment(values.comment, values.rating);
            methods.reset();

            // showSnackbar(t("productDetail.reviewSubmitted"), "success");
        } catch (err) {
            console.error(err);

            // showSnackbar(t("productDetail.reviewFailed"), "error");
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
            <RatingGroup>
                <Typography
                    variant="h6"
                    sx={{ color: "grey.700", span: { color: "error.main" } }}
                    color="grey.700"
                >
                    {t("productDetail.yourRating")} <span>*</span>
                </Typography>

                <Rating
                    color="warn"
                    size="medium"
                    name="rating"
                    value={watch("rating")}
                    onChange={(_, value) => setValue("rating", value ?? 0, { shouldValidate: true })}
                />
            </RatingGroup>

            <Box mb={3}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}
                    color="grey.700"
                >
                    {t("productDetail.yourReview")} <span>*</span>
                </Typography>

                <TextField
                    rows={8}
                    multiline
                    fullWidth
                    name="comment"
                    variant="outlined"
                    placeholder={t("productDetail.writeHere")}
                />
            </Box>

            <Button disabled={isSubmitting} variant="contained" color="primary" type="submit">
                {t("productDetail.submitReview")}
            </Button>
        </FormProvider>
    );
}
