/* EXTERNAL PACKAGES */
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup"; //VALIDATION LIBRARY
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone"; //DRAG AND UPLOAD

/* PROJECT IMPORT */
import { setLogin } from "state";
import FlexBetween from "components/FlexBetween";

/* YUP VALIDATION SCHEMA - DETERMINES THE SHAPE OF HOW DATA IS SAVED */
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

/* LOGIN SCHEMA */
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

/* INITIAL VALUES SETUP */
const initialValueRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValueLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  /* THE VALUES ARE RETRIEVED FROM THE FORM */
  /* FORM DATA IS REQUIRED SINCE THERE IS AN IMAGE UPLOAD */
  /* FORM DATA COMES FROM JS API */
  /* FORM DATA ALLOWS US TO SEND FORM WITH IMAGES */
  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    /* LOOP THROUGH KEY-VALUE in VALUES OBJECT */
    /* THE RESULT OF FORMDATA.APPEND SHOULD BE AN OBJECT WITH THE RELEVANT KEY-VALUE PAIRS */
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    /* IF A USER HAS BEEN CREATED, SWITCH TO LOGIN */
    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValueLogin : initialValueRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* ======================================== DROP ZONE ======================================== */}
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          /* SHOW THE NAME OF THE ADDED IMAGE */
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          {/* BUTTON SECTION */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": {
                  color: palette.primary.main,
                },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin ? "Create an Account" : "Sign in"}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;

/* ======================================== NOTES ======================================== */
/* FORMIK TAKES IN THE FUNCTION HANDLEFORMSUBMIT AND PASSES IT TO THE HTML FORM AS HANDLESUBMIT */
/* GRID IS SPLIT INTO 4 SECTIONS, MINIMUM IS 0 OTHERWISE IT'S SPLIT INTO EQUAL FRACTIONS OF 4 (1FR - FRACTIONAL UNIT) */
/* "& > div" MEANS ANYTHING BELOW THE BOX IS TREATED AS DIV AND GIVEN THE PROPERTY */
/* HANDLEBLUR HANDLES AN EVENT WHEN THE USER CLICKS OUT ON AN INPUT, HANDLECHANGE HANDLES THE TYPING*/
/* {touched.firstName && errors.firstName} IF IT HAS BEEN TOUCHED BUT THERE'S AN ERROR, SHOW THE ERROR */
/* ANYTIME THERE'S A BUTTON TYPE SUBMIT, THE HANDLE SUBMIT IS RUN */
