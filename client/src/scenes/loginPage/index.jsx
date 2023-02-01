/* EXTERNAL PACKAGES */
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { DarkMode, LightMode, Help } from "@mui/icons-material";
import { useDispatch } from "react-redux";

/* PROJECT IMPORT */
import Form from "./Form";
import { setMode } from "state";
import FlexBetween from "components/FlexBetween";

const LoginPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      {/* ======================================== LOGO ======================================== */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <FlexBetween>
          <Typography fontWeight="bold" fontSize="32px" color="primary">
            Sociopedia
          </Typography>
          <FlexBetween
            gap="1rem"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Help />
          </FlexBetween>
        </FlexBetween>
      </Box>

      {/* ======================================== FORM ======================================== */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Sociopedia
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
