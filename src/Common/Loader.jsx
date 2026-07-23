import React from "react";
import { Spin } from "antd";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
      <Spin size="large" />
    </div>
  );
};

export default Loader;
