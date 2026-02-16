"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
// STYLED COMPONENTS
import { RatingGroup } from "./styles";
// HOOKS
import { useComments } from "@/hooks/useComments";
import { t } from "@/utils/translate";

const validationSchema = yup.object().shape({
  rating: yup.number().required(t("Rating is required!")),
  comment: yup.string().required(t("Comment is required!"))
});

interface Props {
  productCode: string;
}

export default function ReviewForm({ productCode }: Props) {
  const { addComment } = useComments([], productCode);
  const initialValues = {
    rating: 0,
    comment: "",
    date: new Date().toISOString()
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(async (values) => {
    try {
      await addComment(values.comment, values.rating);
      methods.reset();
      alert(t("Review submitted successfully!"));
    } catch (error) {
      alert(t("Failed to submit review"));
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <RatingGroup>
        <Typography
          variant="h6"
          sx={{ color: "grey.700", span: { color: "error.main" } }}
          color="grey.700">
          {t("Your Rating")} <span>*</span>
        </Typography>

        <Rating
          color="warn"
          size="medium"
          name="rating"
          value={watch("rating")}
          onChange={(_, value) => setValue("rating", value!, { shouldValidate: true })}
        />
      </RatingGroup>

      <Box mb={3}>
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "grey.700", span: { color: "error.main" } }}
          color="grey.700">
          {t("Your Review")} <span>*</span>
        </Typography>

        <TextField
          rows={8}
          multiline
          fullWidth
          name="comment"
          variant="outlined"
          placeholder={t("Write a review here...")}
        />
      </Box>

      <Button loading={isSubmitting} variant="contained" color="primary" type="submit">
        {t("Submit")}
      </Button>
    </FormProvider>
  );
}
