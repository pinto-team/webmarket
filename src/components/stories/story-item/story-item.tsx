import LazyImage from "components/LazyImage";
import { StyledRoot } from "./styles";

// ==============================================================
interface Props {
  image: string;
  handleClick: () => void;
}
// ==============================================================

export default function StoryItem({ image, handleClick }: Props) {
  return (
    <StyledRoot onClick={handleClick}>
      <LazyImage
        src={image}
        alt="Story"
        width={197}
        height={360}
      />
    </StyledRoot>
  );
}
