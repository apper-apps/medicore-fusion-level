import { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { createPatient } from "@/services/api/patientService";
import { createActivity } from "@/services/api/activityService";
import { toast } from "react-toastify";

const PatientRegistrationModal = ({ isOpen, onClose, onSuccess }) => {
const [formData, setFormData] = useState({
    name: "",
    age: "",
    roomNumber: "",
    attendingDoctor: "",
    admissionStatus: "stable",
    admissionDate: "",
    admissionFrom: "",
    admissionTo: "",
    condition: "",
    emergencyContact: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = "Valid age is required (1-120)";
    }
    if (!formData.roomNumber.trim()) newErrors.roomNumber = "Room number is required";
    if (!formData.attendingDoctor.trim()) newErrors.attendingDoctor = "Attending doctor is required";
    if (!formData.admissionDate.trim()) {
      newErrors.admissionDate = "Admission date is required";
    } else {
      const admissionDate = new Date(formData.admissionDate);
      const now = new Date();
      if (admissionDate > now) {
        newErrors.admissionDate = "Admission date cannot be in the future";
      }
    }
    
    // Validate admission from and to dates
    if (formData.admissionFrom) {
      const admissionFromDate = new Date(formData.admissionFrom);
      const now = new Date();
      if (admissionFromDate > now) {
        newErrors.admissionFrom = "Admission from date cannot be in the future";
      }
    }
    
    if (formData.admissionTo) {
      const admissionToDate = new Date(formData.admissionTo);
      const now = new Date();
      if (admissionToDate > now) {
        newErrors.admissionTo = "Admission to date cannot be in the future";
      }
    }
    
    // Check if admission from is before admission to
    if (formData.admissionFrom && formData.admissionTo) {
      const fromDate = new Date(formData.admissionFrom);
      const toDate = new Date(formData.admissionTo);
      if (fromDate >= toDate) {
        newErrors.admissionTo = "Admission to date must be after admission from date";
      }
    }
    
    if (!formData.condition.trim()) newErrors.condition = "Condition is required";
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
const patientData = {
        Name: formData.name,
        age: parseInt(formData.age),
        roomNumber: formData.roomNumber,
        attendingDoctor: formData.attendingDoctor,
        admissionStatus: formData.admissionStatus,
        admissionDate: formData.admissionDate,
        admissionFrom: formData.admissionFrom,
        admissionTo: formData.admissionTo,
        condition: formData.condition,
        emergencyContact: formData.emergencyContact
      };
      
      const newPatient = await createPatient(patientData);
      
      // Create corresponding activity record for the patient admission
      if (newPatient && newPatient.Id) {
        await createActivity({
          Name: `Patient Registration - ${newPatient.Name || formData.name}`,
          type: "admission",
          description: `New patient ${newPatient.Name || formData.name} registered in room ${formData.roomNumber} under Dr. ${formData.attendingDoctor}`,
          timestamp: new Date().toISOString(),
          severity: "medium",
          relatedPatientId: newPatient.Id
        });
      }
      
      toast.success(`Patient ${newPatient.Name || formData.name} registered successfully!`);
      
      // Reset form
setFormData({
        name: "",
        age: "",
        roomNumber: "",
        attendingDoctor: "",
        admissionStatus: "stable",
        admissionDate: "",
        admissionFrom: "",
        admissionTo: "",
        condition: "",
        emergencyContact: ""
      });
      
      onSuccess && onSuccess(newPatient);
      onClose();
    } catch (error) {
      toast.error("Failed to register patient. Please try again.");
      console.error("Patient registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
setFormData({
        name: "",
        age: "",
        roomNumber: "",
        attendingDoctor: "",
        admissionStatus: "stable",
        admissionDate: "",
        admissionFrom: "",
        admissionTo: "",
        condition: "",
        emergencyContact: ""
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <ApperIcon name="UserPlus" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">New Patient Registration</h2>
                <p className="text-sm text-gray-500">Register a new patient in the system</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter patient's full name"
                    error={errors.name}
                    disabled={loading}
                  />
                  {errors.name && <p className="text-sm text-error-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    error={errors.age}
                    disabled={loading}
                  />
                  {errors.age && <p className="text-sm text-error-600 mt-1">{errors.age}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact *
                </label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Enter emergency contact number"
                  error={errors.emergencyContact}
                  disabled={loading}
                />
                {errors.emergencyContact && <p className="text-sm text-error-600 mt-1">{errors.emergencyContact}</p>}
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number *
                  </label>
                  <Input
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange("roomNumber", e.target.value)}
                    placeholder="e.g., A-101"
                    error={errors.roomNumber}
                    disabled={loading}
                  />
                  {errors.roomNumber && <p className="text-sm text-error-600 mt-1">{errors.roomNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attending Doctor *
                  </label>
                  <Input
                    value={formData.attendingDoctor}
                    onChange={(e) => handleInputChange("attendingDoctor", e.target.value)}
                    placeholder="Dr. John Smith"
                    error={errors.attendingDoctor}
                    disabled={loading}
                  />
                  {errors.attendingDoctor && <p className="text-sm text-error-600 mt-1">{errors.attendingDoctor}</p>}
                </div>
              </div>
<div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admission Status *
                  </label>
                  <select
                    value={formData.admissionStatus}
                    onChange={(e) => handleInputChange("admissionStatus", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <option value="stable">Stable</option>
                    <option value="critical">Critical</option>
                    <option value="observation">Observation</option>
                    <option value="discharged">Discharged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admission Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.admissionDate}
                    onChange={(e) => handleInputChange("admissionDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                  {errors.admissionDate && <p className="text-sm text-error-600 mt-1">{errors.admissionDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admission From
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.admissionFrom}
                    onChange={(e) => handleInputChange("admissionFrom", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                  {errors.admissionFrom && <p className="text-sm text-error-600 mt-1">{errors.admissionFrom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admission To
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.admissionTo}
                    onChange={(e) => handleInputChange("admissionTo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                  {errors.admissionTo && <p className="text-sm text-error-600 mt-1">{errors.admissionTo}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Condition *
                  </label>
                  <Input
                    value={formData.condition}
                    onChange={(e) => handleInputChange("condition", e.target.value)}
                    placeholder="Enter primary condition"
                    error={errors.condition}
                    disabled={loading}
                  />
                  {errors.condition && <p className="text-sm text-error-600 mt-1">{errors.condition}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
                  Register Patient
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationModal;