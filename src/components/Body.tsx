import React from "react";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative ml-20 min-h-screen  max-w-full border-r border-gray-100 py-4 lg:max-w-2xl  xl:ml-80 ">
      {children}
    </main>
  );
};

export default Body;
