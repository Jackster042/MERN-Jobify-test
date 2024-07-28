// CSS STYLED COMPONENTS
import Wrapper from "../assets/wrappers/DashboardFormPage";

// COMPONENTS
import { FormRow, SubmitBtn } from "../components";
import { FormRowSelect } from "../components";

//  REACT ROUTER DOM IMPORT
import { useOutletContext } from "react-router-dom";
import { Form, redirect } from "react-router-dom";

// REACT TOASTIFY IMPORT
import { toast } from "react-toastify";

// CUSTOM FETCH
import customFetch from "../utils/customFetch";

// SERVER IMPORT
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post("/jobs", data);
      queryClient.invalidateQueries(["jobs"]);
      toast.success("Job created successfully");
      return redirect("all-jobs");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const AddJob = () => {
  const { user } = useOutletContext();
  // const navigation = useNavigation();
  // const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add job</h4>
        <div className="form-center">
          <FormRow type="text" name="company" />
          <FormRow type="text" name="position" />
          <FormRow
            type="text"
            name="jobLocation"
            labelText="job location"
            defaultValue={user.location}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            defaultValue={JOB_STATUS.PENDING}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            defaultValue={JOB_TYPE.PENDING}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn={true} />
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddJob;

//  HARDCODED SELECT OPTION
/*
 <div className="form-row">
            <label htmlFor="jobStatus" className="form-label">
              job status
            </label>
            <select
              name="jobStatus"
              id="jobStatus"
              className="form-select"
              defaultValue={JOB_TYPE.FULL_TIME}
            >
              {Object.values(JOB_TYPE).map((itemValue) => {
                return (
                  <option value={itemValue} key={itemValue}>
                    {itemValue}
                  </option>
                );
              })}
            </select>
          </div>
*/
