import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="Heart" className="h-6 w-6 text-white animate-bounce" />
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <div className="mt-2 flex space-x-1">
        <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce"></div>
        <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-2 w-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default Loading;