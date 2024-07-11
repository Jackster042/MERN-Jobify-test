import React from "react";

import Wrapper from "../assets/wrappers/RegisterAndLoginPage";

import { Form, redirect, Link } from "react-router-dom";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

// ACTION GIVES US ACCESS TO REQUEST PROPERTY
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful");
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

function Register() {
  // const navigation = useNavigation();
  // const isSubmitting = navigation.state === "submitting";
  return (
    <Wrapper>
      <Form className="form" method="post">
        <Logo />
        <h4>Register</h4>
        {/* <div className="form-row">
          <label htmlFor="name" className="form-label">
            name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            defaultValue="John"
            required
          />
        </div> */}
        <FormRow type="text" name="name" />
        <FormRow type="text" name="lastName" labelText="last name" />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />

        {/* TODO : CHECK WHY ITS NOT NEEDED TO FORMBTN IN REGISTER */}
        <SubmitBtn />

        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
}

export default Register;
