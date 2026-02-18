"use client";

import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// STYLED COMPONENT
import { Wrapper, StyledButton } from "./styles";

export default function OrderConfirmationPageView() {
    return (
        <Container className="mt-2 mb-5">
            <Wrapper>
                <Box
                    component="img"
                    width={116}
                    height={116}
                    alt="complete"
                    src="/assets/images/illustrations/party-popper.svg"
                    sx={{ display: "block" }}
                />

                <Typography variant="h1" fontWeight={700}>
                    Thank you for your purchase!
                </Typography>

                <Typography
                    fontSize={16}
                    variant="body1"
                    color="text.secondary"
                    sx={{ padding: ".5rem 2rem" }}
                >
                    We have received your order and you will be receiving confirmation email with order
                    details.
                </Typography>

                <Typography fontSize={16} variant="body1" color="text.secondary">
                    Your order number is <strong>#1234567890</strong>.
                </Typography>

                <StyledButton
                    color="primary"
                    disableElevation
                    variant="contained"
                    className="button-link"
                    LinkComponent={Link}
                    href="/market-1"
                >
                    Browse products
                </StyledButton>
            </Wrapper>
        </Container>
    );
}
