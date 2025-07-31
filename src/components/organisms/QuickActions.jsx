import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import QuickActionButton from "@/components/molecules/QuickActionButton";
import ApperIcon from "@/components/ApperIcon";
import PatientRegistrationModal from "@/components/organisms/PatientRegistrationModal";
import EmergencyAlertModal from "@/components/organisms/EmergencyAlertModal";
import { toast } from "react-toastify";

const QuickActions = () => {
const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleNewPatient = () => {
    setIsPatientModalOpen(true);
  };

const handlePatientRegistrationSuccess = (newPatient) => {
    setIsPatientModalOpen(false);
    toast.success(`Patient ${newPatient.name} registered successfully!`);
    // Could trigger a refresh of patient data in parent components if needed
  };

const handleEmergencyAlert = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleEmergencyAlertSuccess = (alertData) => {
    toast.success(`Emergency alert sent to ${alertData.recipients.length} recipient(s)`);
    setIsEmergencyModalOpen(false);
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
<PatientRegistrationModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={handlePatientRegistrationSuccess}
      />
      <EmergencyAlertModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSuccess={handleEmergencyAlertSuccess}
      />
    </Card>
  );
};

export default QuickActions;