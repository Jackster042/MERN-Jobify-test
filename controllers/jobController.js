import Job from "../models/JobMOdel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";

import mongoose from "mongoose";
import day from "dayjs";

// JOBS
// let jobs = [
//   {
//     id: nanoid(),
//     company: "TechCo",
//     position: "Software Engineer",
//   },
//   {
//     id: nanoid(),
//     company: "FinanceCorp",
//     position: "Financial Analyst",
//   },
// ];

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  // console.log(req.query);

  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    // queryObject.position = req.query.search;

    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  // SORT

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // PAGINATION

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
  // console.log(jobs);
};

// CREATE A JOB
export const createJob = async (req, res) => {
  // const { company, position } = req.body;
  // const job = await Job.create({ company, position });
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// GET SINGLE JOB
export const getSingleJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  // if (!job) throw new NotFoundError(`no job with id : ${id}`);
  res.status(StatusCodes.OK).json({ job });
};

// EDIT JOB
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
  // if (!updatedJob) {
  //   throw new NotFoundError(`no job with id : ${id}`);
  // }
  res.status(StatusCodes.OK).json({ job: updatedJob });
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removedJob = await Job.findByIdAndDelete(id);
  // if (!removedJob) {
  //   throw new NotFoundError(`no job with id : ${id}`);
  // }
  res.status(StatusCodes.OK).json({ job: removedJob });
};

// STATS

// TEST EXAMPLE
// export const showStats = async (req, res) => {
// res.send("stats");
// const defaultStats = {
//   pending: 22,
//   interview: 11,
//   declined: 4,
// };

// let monthlyApplications = [
//   {
//     date: "May 23",
//     count: 12,
//   },
//   {
//     date: "Jun 23",
//     count: 9,
//   },
//   {
//     date: "Jul 23",
//     count: 3,
//   },
// ];
// res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
// };

// export const showStats = async (req, res) => {
//   let stats = await Job.aggregate([
//     { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
//   ]);
//   stats = stats.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   const defaultStats = {
//     pending: stats.pending || 0,
//     interview: stats.interview || 0,
//     declined: stats.declined || 0,
//   };

//   let monthlyApplications = await Job.aggregate([
//     { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
//     {
//       $group: {
//         _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { "_id.year": -1, "_id.month": -1 } },
//     { $limit: 6 },
//   ]);
//   monthlyApplications = monthlyApplications
//     .map((item) => {
//       const {
//         _id: { year, month },
//         count,
//       } = item;

//       const date = day()
//         .month(month - 1)
//         .year(year)
//         .format("MMM YY");
//       return { date, count };
//     })
//     .reverse();

//   res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
// };

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);

  // REDUCE = 1st parameter is accumulator(what we are returning)
  // REDUCER = 2nd parameter is current iteration
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  // console.log(typeof stats);

  // const defaultStats = {
  //   pending: 22,
  //   interview: 11,
  //   declined: 4,
  // };

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse(); // reverses the array

  // console.log(monthlyApplications);

  // let monthlyApplications = [
  //   {
  //     date: "May 23",
  //     count: 12,
  //   },
  //   {
  //     date: "Jun 23",
  //     count: 9,
  //   },
  //   {
  //     date: "Jul 23",
  //     count: 3,
  //   },
  // ];
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
