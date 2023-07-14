"use client";
import { useState } from "react";

export const Accordion = ({
  title = "Title",
  className = "",
  bodyClassName = "",
  children,
}: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`accordion open ${className}`}>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button
            className={`accordion-button ${open ? "" : "collapsed"}`}
            type="button"
            data-toggle="collapse"
            data-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
            onClick={() => setOpen(!open)}
          >
            {title}
          </button>
        </h2>
        <div
          id="collapseOne"
          className={`accordion-collapse collapse ${open ? "show" : ""}`}
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div className={`accordion-body ${bodyClassName}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};
