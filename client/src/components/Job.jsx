import React from "react";
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo";
import { Form, Link } from "react-router-dom";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

day.extend(advancedFormat);

const Job = ({
  _id,
  position,
  company,
  jobStatus,
  jobLocation,
  jobType,
  createdAt,
}) => {
  const date = day(createdAt).format("MMMM Do, YYYY");

  return (
    <Wrapper>
      {/* HEADER */}
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      {/* CONTENT */}
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${jobStatus}`}>{jobStatus}</div>
        </div>
      </div>
      {/* FOOTER */}
      <footer className="actions">
        <Link to={`../edit-job/${_id}`} className=" btn edit-btn">
          Edit
        </Link>
        <Form method="post" action={`../delete-job/${_id}`}>
          <button type="submit" className="btn delete-btn">
            Delete
          </button>
        </Form>
      </footer>
    </Wrapper>
  );
};

export default Job;
