import Container from "components/Container";
import LazyImage from "components/LazyImage";
// STYLED COMPONENTS
import { RootStyle, StyledLink } from "./styles";

export default function Section3() {
    const imageUrl = "/placeholder.png"; // فقط string

    return (
        <Container sx={{ mt: { xs: 6, sm: 14 } }}>
            <RootStyle>
                <div className="content">
                    <p>Apple Watch Series 9</p>

                    <h2>
                        Magic. At your <br /> fingertips.
                    </h2>

                    <StyledLink href="/">Shop Now</StyledLink>
                </div>

                <div className="img-wrapper">
                    <LazyImage
                        src={imageUrl}
                        alt="Watch"
                        width={400}
                        height={400}
                    />
                </div>
            </RootStyle>
        </Container>
    );
}
