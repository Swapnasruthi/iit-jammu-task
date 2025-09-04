import React, { useEffect } from "react";
import mockData from "../data/mock_Data.json"
import VegCard from "./VegCard";

const Feed = () => {

  // console.log(mockData);


  return (
    <>
      <div className="w-full flex flex-row flex-wrap justify-center items-center mt-20">
        {mockData.map((item) => (
           
            <VegCard  key={item.id} item={item}/>
        ))}
      </div>
    </>
  );
};

export default Feed;
