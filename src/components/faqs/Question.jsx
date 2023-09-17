import React, { useState } from "react";
import { LiaPlusSolid, LiaMinusSolid } from "react-icons/lia";
import { TfiPlus } from "react-icons/tfi";

const ExpandableComponent = ({ title, content }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="flex flex-col mx-3 md:mx-5 ">
      <header className="flex justify-between py-4  font-[700] text-xl ">
        <h4
          onClick={() => setExpanded(!expanded)}
          className="question-title text-base md:text-[1rem] pr-6 md:pr-72"
        >
          {title}
        </h4>
        <button
          className="text-black/60"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <LiaMinusSolid size={25} /> : <TfiPlus size={25} />}
        </button>
      </header>

      {content && content.length > 0 && (
        <div
          className={`border-b-[1px] border-black/20 transition-all overflow-hidden ${
            expanded ? "duration-1000 max-h-[1000px]" : "max-h-0 duration-100 "
          }`}
        >
          <p className="md:text-lg text-[#777] font-medium py-2">
            {content.map((item, index) => (
              <span key={index}>
                {item.info}
                <br />
              </span>
            ))}
          </p>
        </div>
      )}
    </article>
  );
};

export default ExpandableComponent;
