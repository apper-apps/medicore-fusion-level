import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ActivityItem = ({ event, isLast = false }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case "admission":
        return "UserPlus";
      case "discharge":
        return "UserMinus";
      case "critical":
        return "AlertTriangle";
      case "surgery":
        return "Scissors";
      case "medication":
        return "Pill";
      default:
        return "Activity";
    }
  };

  const getEventColor = (severity) => {
    switch (severity) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getIconBgColor = (type) => {
    switch (type) {
      case "admission":
        return "bg-success-500";
      case "discharge":
        return "bg-secondary-500";
      case "critical":
        return "bg-error-500";
      case "surgery":
        return "bg-warning-500";
      case "medication":
        return "bg-primary-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex space-x-3">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${getIconBgColor(event.type)}`}>
          <ApperIcon name={getEventIcon(event.type)} className="h-4 w-4 text-white" />
        </div>
        {!isLast && <div className="w-px h-8 bg-gray-200 mt-2" />}
      </div>
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{event.description}</p>
          <Badge variant={getEventColor(event.severity)} className="ml-2">
            {event.severity}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {format(new Date(event.timestamp), "MMM dd, yyyy 'at' HH:mm")}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;