"use client";

import { Fragment, ReactNode, SyntheticEvent, useMemo, useState } from "react";
// MUI
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

const StyledTabs = styled(Tabs)(({ theme }) => ({
    minHeight: 0,
    marginTop: 80,
    marginBottom: 24,
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& .inner-tab": {
        minHeight: 40,
        fontWeight: 500,
        textTransform: "capitalize",
    },
}));

interface Props {
    reviews: ReactNode;
    description: ReactNode;
    reviewCount?: number;
}

export default function ProductTabs({ reviews, description, reviewCount = 0 }: Props) {
    const [selectedOption, setSelectedOption] = useState(0);
    const handleChangeTab = (_: SyntheticEvent, value: number) => setSelectedOption(value);

    const descriptionLabel = useMemo(
        () => toPersianNumber(t("productDetail.description")),
        []
    );

    const reviewsLabel = useMemo(
        () => toPersianNumber(`${t("productDetail.reviews")} (${reviewCount})`),
        [reviewCount]
    );

    return (
        <Fragment>
            <StyledTabs
                textColor="primary"
                value={selectedOption}
                indicatorColor="primary"
                onChange={handleChangeTab}
            >
                <Tab className="inner-tab" label={descriptionLabel} />
                <Tab className="inner-tab" label={reviewsLabel} />
            </StyledTabs>

            <div className="mb-3">
                {selectedOption === 0 && description}
                {selectedOption === 1 && reviews}
            </div>
        </Fragment>
    );
}