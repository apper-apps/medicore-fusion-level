import { useEffect } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const PatientModal = ({ patient, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !patient) return null;

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "critical":
        return "error";
      case "stable":
        return "success";
      case "observation":
        return "warning";
      case "discharged":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
<div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {patient?.Name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-sm text-gray-500">Patient ID: #{patient.Id}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Status
                <Badge variant={getStatusBadgeVariant(patient.admissionStatus)} className="text-sm">
                  {patient.admissionStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Room Number</p>
                  <p className="text-lg font-semibold text-gray-900">{patient.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Attending Doctor</p>
                  <p className="text-lg font-semibold text-gray-900">{patient.attendingDoctor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-lg font-semibold text-gray-900">{patient.age} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                  <p className="text-lg font-semibold text-gray-900">{patient.emergencyContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Heart" className="h-5 w-5 text-error-600" />
                <span>Medical Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Primary Condition</p>
                  <p className="text-lg font-semibold text-gray-900">{patient.condition}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Admission Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {format(new Date(patient.admissionDate), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button variant="primary" className="flex-1">
              <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
              View Medical Records
            </Button>
            <Button variant="outline" className="flex-1">
              <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline">
              <ApperIcon name="Phone" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;