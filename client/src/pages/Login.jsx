import React from "react";

import Wrapper from "../assets/wrappers/RegisterAndLoginPage";

import {
  Form,
  redirect,
  Link,
  useNavigate,
  useActionData,
} from "react-router-dom";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    // console.log(typeof formData);
    const data = Object.fromEntries(formData);
    const errors = { msg: "" };
    if (data.password.length < 3) {
      // console.log(errors);
      errors.msg = "password too short";
      return errors;
    }
    // console.log(data);
    try {
      await customFetch.post("/auth/login", data);
      // await axios.post("/api/v1/auth/login", data);
      queryClient.invalidateQueries();
      toast.success("Login successful");
      return redirect("/dashboard");
    } catch (error) {
      // toast.error(error?.response?.data?.msg);
      toast.error(error.response.data.msg);
      return error;
    }
  };

function Login() {
  const errors = useActionData();
  // const navigation = useNavigation();
  // const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();

  // SETING UP TEST DRIVE OPTION
  const loginDemoUser = async () => {
    const data = {
      email: "test@test.com",
      password: "secret123",
    };
    try {
      await customFetch.post("/auth/login", data);
      toast.success("take a test drive");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };
  return (
    <Wrapper>
      <Form className="form" method="post">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        {errors && <p style={{ color: "red" }}>{errors.msg}</p>}

        <SubmitBtn />

        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          Explore the App
        </button>

        <p>
          Don't have an account?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
}

// const Login = () => {
//   const navigate = useNavigate();
//   const loginDemoUser = async () => {
//     const data = {
//       email: "test@test.com",
//       password: "secret123",
//     };

//     try {
//       await customFetch.post("/auth/login", data);
//       toast.success("take a test drive");
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error?.response?.data?.msg);
//     }
//   };

//   return (
//     <Wrapper>
//       <Form className="form" method="post">
//         <Logo />
//         <h4>Login</h4>
//         <FormRow type="email" name="email" defaultValue="john@gmail.com" />
//         <FormRow type="password" name="password" defaultValue="secret123" />
//         {/* {errors && <p style={{ color: "red" }}>{errors.msg}</p>} */}

//         <SubmitBtn formBtn={true} />

//         <button type="button" className="btn btn-block" onClick={loginDemoUser}>
//           Explore the App
//         </button>

//         <p>
//           Don't have an account?
//           <Link to="/register" className="member-btn">
//             Register
//           </Link>
//         </p>
//       </Form>
//     </Wrapper>
//     //
//   );
// };

export default Login;
