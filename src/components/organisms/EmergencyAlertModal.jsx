import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { emergencyService } from "@/services/api/emergencyService";
import { toast } from "react-toastify";

const EmergencyAlertModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    severity: "High",
    message: "",
    recipients: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const severityOptions = [
    { value: "Critical", label: "Critical", color: "text-red-600 bg-red-50", icon: "AlertTriangle" },
    { value: "High", label: "High", color: "text-orange-600 bg-orange-50", icon: "AlertCircle" },
    { value: "Medium", label: "Medium", color: "text-yellow-600 bg-yellow-50", icon: "Info" }
  ];

  const recipientOptions = [
    { id: "all_staff", label: "All Staff", description: "Notify all medical staff" },
    { id: "doctors", label: "Doctors", description: "Attending physicians only" },
    { id: "nurses", label: "Nurses", description: "Nursing staff" },
    { id: "security", label: "Security", description: "Security personnel" },
    { id: "administration", label: "Administration", description: "Administrative staff" },
    { id: "emergency_team", label: "Emergency Response Team", description: "Specialized emergency responders" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecipientToggle = (recipientId) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(recipientId)
        ? prev.recipients.filter(id => id !== recipientId)
        : [...prev.recipients, recipientId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error("Please enter an emergency message");
      return;
    }

    if (formData.recipients.length === 0) {
      toast.error("Please select at least one recipient group");
      return;
    }

    setIsLoading(true);

    try {
      const alertData = {
        severity: formData.severity,
        message: formData.message.trim(),
        recipients: formData.recipients,
        timestamp: new Date().toISOString(),
        status: "Sent",
        sentBy: "Current User" // In real app, would get from auth context
      };

      const newAlert = await emergencyService.create(alertData);
      
      onSuccess(newAlert);
      
      // Reset form
      setFormData({
        severity: "High",
        message: "",
        recipients: []
      });
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast.error("Failed to send emergency alert. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        severity: "High",
        message: "",
        recipients: []
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedSeverity = severityOptions.find(opt => opt.value === formData.severity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Send Emergency Alert
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Notify staff members of critical situations
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Severity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Alert Severity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {severityOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleInputChange("severity", option.value)}
                      className={`
                        cursor-pointer border-2 rounded-lg p-4 transition-all duration-200
                        ${formData.severity === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${option.color}`}>
                          <ApperIcon name={option.icon} size={16} />
                        </div>
                        <span className="font-medium text-gray-900">{option.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Describe the emergency situation and required actions..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Recipients Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notify Recipients *
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {recipientOptions.map((recipient) => (
                    <div
                      key={recipient.id}
                      onClick={() => handleRecipientToggle(recipient.id)}
                      className={`
                        cursor-pointer border rounded-lg p-3 transition-all duration-200
                        ${formData.recipients.includes(recipient.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{recipient.label}</div>
                          <div className="text-sm text-gray-600">{recipient.description}</div>
                        </div>
                        {formData.recipients.includes(recipient.id) && (
                          <ApperIcon name="Check" size={20} className="text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Preview */}
              {formData.message && formData.recipients.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded ${selectedSeverity.color}`}>
                      <ApperIcon name={selectedSeverity.icon} size={16} />
                    </div>
                    <span className="font-medium text-gray-900">
                      {formData.severity} Alert Preview
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{formData.message}</p>
                  <p className="text-xs text-gray-500">
                    Will be sent to: {formData.recipients.map(id => 
                      recipientOptions.find(r => r.id === id)?.label
                    ).join(", ")}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  disabled={isLoading || !formData.message.trim() || formData.recipients.length === 0}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Alert...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Send" size={16} />
                      Send Emergency Alert
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyAlertModal;