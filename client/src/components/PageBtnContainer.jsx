import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAllJobsContext } from "../pages/AllJobs";

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext();

  // console.log(numOfPages, currentPage);
  // console.log(numOfPages);

  const { search, pathname } = useLocation();

  const navigate = useNavigate();

  const pages = Array.from({ length: numOfPages }, (_, index) => index + 1);
  // console.log(pages);

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", pageNumber);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  //  CREATE FUNCTION TO ADD BUTTON/S
  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`btn page-btn ${activeClass && "active"}`}
        key={pageNumber}
        onClick={() => {
          handlePageChange(pageNumber);
        }}
      >
        {pageNumber}
      </button>
    );
  };

  // CREATE FUNCTION TO RENDER BUTTONS
  const renderPageButtons = () => {
    const pageButtons = [];

    //  ADD THE FIRST PAGE BUTTON
    pageButtons.push(
      addPageButton({
        pageNumber: 1,
        activeClass: currentPage === 1,
      })
    );

    // ADD DOTS BEFORE THE CURRENT PAGE IF THERE ARE MORE THAN 3
    if (currentPage > 3) {
      pageButtons.push(
        <span className="page-btn dots" key="dots-1">
          ...
        </span>
      );
    }

    // ADD ONE PAGE BEFORE CURRENT PAGE
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage - 1,
          activeClass: false,
        })
      );
    }

    // ADD CURRENT PAGE BUTTON
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage,
          activeClass: true,
        })
      );
    }

    // ADD ONE PAGE AFTER CURRENT PAGE
    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage + 1,
          activeClass: false,
        })
      );
    }

    // ADD DOTS AFTER THE CURRENT PAGE IF THERE ARE MORE THAN 3
    if (currentPage < numOfPages - 2) {
      pageButtons.push(
        <span className="page-btn dots" key="dots+1">
          ...
        </span>
      );
    }

    // ADD THE LAST PAGE BUTTON
    pageButtons.push(
      addPageButton({
        pageNumber: numOfPages,
        activeClass: currentPage === numOfPages,
      })
    );

    return pageButtons;
  };

  // DONE_TODO: BTN WITCH RETURN TO THE FIRST AND LAST PAGE
  // TODO: FIX URL FOR FIRST PAGE
  return (
    <Wrapper>
      {/*  PREV BTN */}
      <button
        className="btn prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = 1;
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>

      {/* TEST BTN */}
      <button
        className="btn prev-btn"
        onClick={() => {
          let firstPage = numOfPages - (numOfPages - 1);
          // let firstPage = numOfPages[0];
          handlePageChange(firstPage);
          // console.log(typeof firstPage);
        }}
      >
        <HiChevronDoubleLeft />
        <HiChevronDoubleLeft />
      </button>

      {/* BTN CONTAINER */}
      <div className="btn-container">
        {/* MAP THROUGH PAGES */}

        {/* {pages.map((pageNumber) => (
          <button
            className={`btn page-btn ${pageNumber === currentPage && "active"}`}
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))} */}

        {/* COMPLEX WAY PAGINATION */}
        {renderPageButtons()}
      </div>

      {/* TEST BTN */}
      <button
        className="btn next-btn"
        onClick={() => {
          let lastPage = numOfPages;
          handlePageChange(lastPage);
        }}
      >
        <HiChevronDoubleRight />
        <HiChevronDoubleRight />
      </button>

      {/* NEXT BTN */}
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numOfPages) nextPage = numOfPages;
          handlePageChange(nextPage);
        }}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
