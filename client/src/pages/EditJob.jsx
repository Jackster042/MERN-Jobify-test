import React from "react";
import { FormRow, FormRowSelect } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData, Form, redirect, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import SubmitBtn from "../components/SubmitBtn";
import { useQuery } from "@tanstack/react-query";

// SETUP LOADER AND ACTION

const singleQuery = (id) => {
  return {
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/jobs/${id}`);
      return data;
    },
  };
};

// LOADER
export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(singleQuery(params.id));
      return params.id;
    } catch (error) {
      toast.error(error.response.data.msg);
      return redirect("/dashboard/all-jobs");
    }
  };
// ACTION
export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.patch(`/jobs/${params.id}`, data);
      queryClient.invalidateQueries(["jobs"]);
      toast.success("Job updated successfully");
      return redirect("/dashboard/all-jobs");
    } catch (error) {
      toast.error(error.response.data.msg);
      return error;
    }
  };
const EditJob = () => {
  // const params = useParams();
  // console.log(params);

  // const { job } = useLoaderData();
  const id = useLoaderData();
  const {
    data: { job },
  } = useQuery(singleQuery(id));

  // const navigation = useNavigation();
  // const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Edit Job</h4>
        <div className="form-center">
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={job.jobLocation}
          />
          <FormRowSelect
            labelText="job status"
            list={Object.values(JOB_STATUS)}
            name="jobStatus"
            defaultValue={job.jobStatus}
          />
          <FormRowSelect
            labelText="job type"
            list={Object.values(JOB_TYPE)}
            name="jobType"
            defaultValue={job.jobType}
          />
          <SubmitBtn formBtn={true} />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditJob;
