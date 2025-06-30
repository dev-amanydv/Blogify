export const BlogSkeleton = () => {
  return (
    <div>
      <div role="status" className=" animate-pulse">
        <div className="p-4 border-b-2 border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
          <div className="flex">
            <div className="flex justify-center items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded-full mb-2.5"></div>
          </div>
          <div className="text-xl font-semibold pt-2">
            <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
          </div>
          <div className="text-md font-thin ">
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
          </div>
          <div className="w-full text-slate-400 pt-4">
            <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
          </div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
