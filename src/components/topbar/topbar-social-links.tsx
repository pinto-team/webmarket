import { SvgIconComponent } from "@mui/icons-material";
import X from "@mui/icons-material/X";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import Telegram from "@mui/icons-material/Telegram";
import WhatsApp from "@mui/icons-material/WhatsApp";
import LinkedIn from "@mui/icons-material/LinkedIn";
// GLOBAL CUSTOM COMPONENT
import FlexBox from "components/flex-box/flex-box";

// ==============================================================
interface Props {
  links: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
    linkedin?: string;
  };
}
// ==============================================================

export function TopbarSocialLinks({ links }: Props) {
  const { twitter, facebook, instagram, telegram, whatsapp, linkedin } = links;

  return (
    <FlexBox alignItems="center" gap={1.5}>
      {instagram && <LinkItem Icon={Instagram} url={instagram} />}
      {telegram && <LinkItem Icon={Telegram} url={telegram} />}
      {whatsapp && <LinkItem Icon={WhatsApp} url={whatsapp} />}
      {twitter && <LinkItem Icon={X} url={twitter} />}
      {linkedin && <LinkItem Icon={LinkedIn} url={linkedin} />}
      {facebook && <LinkItem Icon={Facebook} url={facebook} />}
    </FlexBox>
  );
}

function LinkItem({ Icon, url }: { url: string; Icon: SvgIconComponent }) {
  return (
    <a
      href={url}
      target="_blank"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <Icon sx={{ fontSize: Icon.name === "X" ? 12 : 16 }} />
    </a>
  );
}
