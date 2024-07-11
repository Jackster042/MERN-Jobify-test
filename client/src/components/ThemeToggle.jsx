import React from "react";

import Wrapper from "../assets/wrappers/ThemeToggle";
import { useDashboardContext } from "../pages/DashboardLayout";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
const ThemeToggle = () => {
  const { isDarkTheme, toggleIsDarkTheme } = useDashboardContext();

  return (
    <Wrapper onClick={toggleIsDarkTheme}>
      {isDarkTheme ? (
        <BsFillSunFill className="toggle-icon" />
      ) : (
        <BsFillMoonFill className="toggle-icon" />
      )}
    </Wrapper>
  );
};

export default ThemeToggle;
