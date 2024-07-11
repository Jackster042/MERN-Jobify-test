import { FaSuitcaseRolling, FaCalendarCheck } from "react-icons/fa";

import { useLoaderData, redirect } from "react-router-dom";
import { StatItem } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/Job";

export const loader = async () => {
  try {
    const response = await customFetch.get("/users/admin/app-stats");
    return response.data;
  } catch (error) {
    toast.error("You are not authorized to view this page");
    return error;
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData();
  return (
    <Wrapper>
      <StatItem
        title="current users"
        count={users}
        icon={<FaCalendarCheck />}
        bcg="#fcefc7"
        color="#e9b949"
      />
      <StatItem
        title="total jobs"
        count={jobs}
        color="#647acb"
        bcg="#e0e8f9"
        icon={<FaCalendarCheck />}
      />
    </Wrapper>
  );
};

export default Admin;
