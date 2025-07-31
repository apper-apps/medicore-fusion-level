import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  color = "primary", 
  className, 
  isLive = false,
  isUpdated = false,
  lastUpdated 
}) => {
  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-success-600";
    if (trend === "down") return "text-error-600";
    return "text-gray-400";
  };

  const getGradientColor = () => {
    switch (color) {
      case "success":
        return "from-success-500 to-success-600";
      case "warning":
        return "from-warning-500 to-warning-600";
      case "error":
        return "from-error-500 to-error-600";
      case "secondary":
        return "from-secondary-500 to-secondary-600";
      default:
        return "from-primary-500 to-primary-600";
    }
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <Card className={cn(
      "hover:scale-105 transform transition-all duration-300 relative overflow-hidden",
      isUpdated && "ring-2 ring-primary-400 ring-opacity-75",
      className
    )}>
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
      )}
      
      {/* Update pulse animation */}
      {isUpdated && (
        <div className="absolute inset-0 bg-primary-100 opacity-30 animate-ping"></div>
      )}
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {isLive && lastUpdated && (
                <span className="text-xs text-gray-400">
                  {formatLastUpdated(lastUpdated)}
                </span>
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <h3 className={cn(
                "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500",
                getGradientColor(),
                isUpdated && "scale-110"
              )}>
                {value}
              </h3>
              {unit && (
                <span className="text-lg text-gray-500 font-medium">{unit}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className={cn(
              "p-3 rounded-lg bg-gradient-to-r transition-all duration-300",
              getGradientColor(),
              isUpdated && "scale-110 shadow-lg"
            )}>
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
            {trend && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={getTrendIcon()} 
                  className={cn(
                    "h-4 w-4 transition-all duration-300", 
                    getTrendColor(),
                    isUpdated && "scale-125"
                  )} 
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Live status indicator */}
        {isLive && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-success-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <span>Real-time data</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;