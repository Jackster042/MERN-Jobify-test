import { QueryClient, useQuery } from "@tanstack/react-query";
import { ChartsContainer, StatsContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";

// TODO Query fn

const statsQuery = {
  queryKey: ["stats"],
  queryFn: async () => {
    const response = await customFetch.get("/jobs/stats");
    console.log(response);
    return response.data;
  },
};

// TODO Loader is not a hook, you can only call hook inside a component
// Loader becomes fn that returns a promise
// we can also return null coz data is coming from the statsQuery fn
export const loader = (queryClient) => async () => {
  const data = await queryClient.ensureQueryData(statsQuery);
  return data;
};

// export const loader = (queryClient = async () => {
//   const data = await queryClient.ensureQueryData(statsQuery);
//   return data;
//   return null;
//   // try {
//   const response = await customFetch.get("/jobs/stats");
//   return response.data;
//   //   } catch (error) {
//   //     return error;
//   //   }
// });

const Stats = () => {
  // initialy data is undefined
  const { data } = useQuery(statsQuery);
  const { isLoading, isError } = useQuery(statsQuery);

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <h3>Error...</h3>;
  // after loading/error or ?.
  const { defaultStats, monthlyApplications } = data;

  // const response = useQuery({
  //   // unique identifier for query
  //   queryKey: ["stats"],
  //   // expects a fn that returns a promise
  //   queryFn: () => customFetch.get("/jobs/stats"),
  // });
  // console.log(response);
  // if (response.isLoading) {
  //   return <h3>Loading...</h3>;
  // } else {
  //   return <h3>React Query</h3>;
  // }
  // const { defaultStats, monthlyApplications } = useLoaderData();

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 0 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};

export default Stats;
