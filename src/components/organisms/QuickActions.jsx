import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import QuickActionButton from "@/components/molecules/QuickActionButton";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const QuickActions = () => {
  const handleNewPatient = () => {
    toast.info("New Patient Registration feature coming soon!");
  };

  const handleEmergencyAlert = () => {
    toast.error("Emergency Alert System activated!");
  };

  const handleStaffDirectory = () => {
    toast.info("Staff Directory feature coming soon!");
  };

  const actions = [
    {
      title: "New Patient",
      description: "Register new patient",
      icon: "UserPlus",
      onClick: handleNewPatient,
      variant: "primary"
    },
    {
      title: "Emergency Alert",
      description: "Send critical alert",
      icon: "AlertTriangle",
      onClick: handleEmergencyAlert,
      variant: "danger"
    },
    {
      title: "Staff Directory",
      description: "View all staff",
      icon: "Users",
      onClick: handleStaffDirectory,
      variant: "secondary"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Zap" className="h-5 w-5 text-primary-600" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <QuickActionButton
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={action.onClick}
              variant={action.variant}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;