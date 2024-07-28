import React from "react";

import { useContext, createContext } from "react";
import { useLoaderData } from "react-router-dom";

import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";

import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

// TODO: request depends on params, create fn that
// TODO creates {}, and pass it in ensureQuery and useQuery()
// TODO allJobsQuery() is fn coz data is dynamic
const allJobsQuery = (params) => {
  const { search, jobStatus, jobType, sort, page } = params;
  return {
    queryKey: [
      "jobs",
      search ?? "",
      jobStatus ?? "all",
      jobType ?? "all",
      sort ?? "newest",
      page ?? 1,
    ],
    queryFn: async () => {
      const { data } = await customFetch.get("/jobs", {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    // IF THERES NO POST METHOD IN THE REQUEST, IT WILL BE A GET REQUEST TO THE SAME URL
    // try {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    // console.log(request.url);
    // console.log(params);

    // const { data } = await customFetch.get("/jobs", {
    //   params,
    // });

    await queryClient.ensureQueryData(allJobsQuery(params));

    // return SearchValues with Loader, data with ReactQuery
    return {
      // data,
      searchValues: { ...params },
    };
    // } catch (error) {
    //   toast.error(error?.response?.data?.msg);
    //   return error;
    // }
  };

// CREATE CONTEXT
const AllJobsContext = createContext();

const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allJobsQuery(searchValues));

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
