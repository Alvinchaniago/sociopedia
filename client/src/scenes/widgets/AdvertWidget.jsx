/* EXTERNAL PACKAGES */
import { Typography, useTheme } from "@mui/material";

/* PROJECT IMPORT */
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  /* COLOR SETUP */
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        heigh="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        style={{
          borderRadius: "0.75rem",
          margin: "0.75rem 0",
        }}
      />
      <FlexBetween>
        <Typography color={main}>International Cosmetics</Typography>
        <Typography color={medium}>internationalcosmetics.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Beauty at your fingertip, get yours now!
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
