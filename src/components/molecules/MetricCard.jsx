import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ title, value, unit, trend, icon, color = "primary", className }) => {
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

  return (
    <Card className={cn("hover:scale-105 transform transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className={`text-3xl font-bold bg-gradient-to-r ${getGradientColor()} bg-clip-text text-transparent`}>
                {value}
              </h3>
              {unit && (
                <span className="text-lg text-gray-500 font-medium">{unit}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradientColor()}`}>
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
            {trend && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={getTrendIcon()} 
                  className={cn("h-4 w-4", getTrendColor())} 
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;