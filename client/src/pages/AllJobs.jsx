import React from "react";

import { useContext, createContext } from "react";
import { useLoaderData } from "react-router-dom";

import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";

import { toast } from "react-toastify";

export const loader = async ({ request }) => {
  // IF THERES NO POST METHOD IN THE REQUEST, IT WILL BE A GET REQUEST TO THE SAME URL
  try {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    console.log(request.url);
    console.log(params);

    const { data } = await customFetch.get("/jobs", {
      params,
    });
    return {
      data,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

// CREATE CONTEXT
const AllJobsContext = createContext();

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
