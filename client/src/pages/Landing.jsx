import React from "react";
import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import { Logo } from "../components";

function Landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job <span>Tracking</span> App
          </h1>
          <p>
            "Discover your next career move with ease. Our job search platform
            streamlines the process, connecting you with opportunities tailored
            to your skills and aspirations. Whether you're seeking your dream
            job or exploring new possibilities, we've got you covered. With
            intuitive search filters and personalized recommendations, finding
            the perfect job has never been simpler. Join thousands of satisfied
            users who've unlocked their potential with our platform. Start your
            journey towards professional fulfillment today."
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login / Demo User
          </Link>
        </div>
        <img src={main} className="img main-img" alt="job hunt" />
      </div>
    </Wrapper>
  );
}

export default Landing;
