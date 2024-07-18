import React, { useState } from "react";

export interface Tab {
  title: string;
  content: React.ReactNode;
  color: string | undefined;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    console.log(index);
  };

  return (
    <div className="pt-3 flex gap-10">
      <div className="scrollbar-hide -mx-5 mb-12  pl-5">
        <ul className="m-auto flex max-w-4xl gap-2 font-semibold uppercase lg:flex-wrap lg:justify-start">
          {tabs.map((tab, index) => (
            <li key={index}>
              {" "}
              <button
                type="button"
                onClick={() => handleTabClick(index)}
                className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-sm text-white transition-all hover:text-white hover:opacity-80 hover:text-opacity-70 ${
                  activeTabIndex === index
                    ? "opacity-100 text-opacity-100"
                    : "opacity-30 text-opacity-60"
                }`}
                style={{ borderColor: tab.color }}
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* <div>{tabs[activeTabIndex].content}</div> */}
    </div>
  );
};
