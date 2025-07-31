import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { updatePatient } from "@/services/api/patientService";
import { toast } from "react-toastify";

const PatientModal = ({ patient, isOpen, onClose }) => {
const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when patient or modal opens
  useEffect(() => {
    if (patient && isOpen) {
      setFormData({
        Name: patient.Name || '',
        age: patient.age || '',
        roomNumber: patient.roomNumber || '',
        attendingDoctor: patient.attendingDoctor || '',
        admissionStatus: patient.admissionStatus || 'stable',
        admissionDate: patient.admissionDate ? format(new Date(patient.admissionDate), 'yyyy-MM-dd') : '',
        condition: patient.condition || '',
        emergencyContact: patient.emergencyContact || ''
      });
      setErrors({});
    }
  }, [patient, isOpen]);

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name?.trim()) {
      newErrors.Name = 'Patient name is required';
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 0 || formData.age > 150)) {
      newErrors.age = 'Please enter a valid age (0-150)';
    }
    
    if (!formData.roomNumber?.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    
    if (!formData.attendingDoctor?.trim()) {
      newErrors.attendingDoctor = 'Attending doctor is required';
    }
    
    if (!formData.condition?.trim()) {
      newErrors.condition = 'Patient condition is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updatedPatient = await updatePatient(patient.Id, formData);
      
      if (updatedPatient) {
        toast.success('Patient updated successfully');
        onClose(); // Close modal on success
        // The parent component should refresh the patient list
      }
    } catch (error) {
      toast.error('Failed to update patient');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <h2 className="text-xl font-bold text-gray-900">Edit Patient Details</h2>
                <p className="text-sm text-gray-500">Patient ID: #{patient.Id}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name *
                </label>
                <Input
                  type="text"
                  value={formData.Name || ''}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  className={errors.Name ? 'border-error-500' : ''}
                  placeholder="Enter patient name"
                />
                {errors.Name && (
                  <p className="mt-1 text-sm text-error-600">{errors.Name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <Input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={errors.age ? 'border-error-500' : ''}
                  placeholder="Enter age"
                  min="0"
                  max="150"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-error-600">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number *
                </label>
                <Input
                  type="text"
                  value={formData.roomNumber || ''}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  className={errors.roomNumber ? 'border-error-500' : ''}
                  placeholder="Enter room number"
                />
                {errors.roomNumber && (
                  <p className="mt-1 text-sm text-error-600">{errors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attending Doctor *
                </label>
                <Input
                  type="text"
                  value={formData.attendingDoctor || ''}
                  onChange={(e) => handleInputChange('attendingDoctor', e.target.value)}
                  className={errors.attendingDoctor ? 'border-error-500' : ''}
                  placeholder="Enter attending doctor"
                />
                {errors.attendingDoctor && (
                  <p className="mt-1 text-sm text-error-600">{errors.attendingDoctor}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <Input
                  type="text"
                  value={formData.emergencyContact || ''}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Enter emergency contact"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <ApperIcon name="Heart" className="h-5 w-5 text-error-600" />
              <span>Medical Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Status
                </label>
                <select
                  value={formData.admissionStatus || 'stable'}
                  onChange={(e) => handleInputChange('admissionStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="stable">Stable</option>
                  <option value="critical">Critical</option>
                  <option value="observation">Observation</option>
                  <option value="discharged">Discharged</option>
                </select>
                <div className="mt-2">
                  <Badge variant={getStatusBadgeVariant(formData.admissionStatus)} className="text-sm">
                    {formData.admissionStatus}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Date
                </label>
                <Input
                  type="date"
                  value={formData.admissionDate || ''}
                  onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Condition *
                </label>
                <textarea
                  value={formData.condition || ''}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.condition ? 'border-error-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter patient condition"
                  rows="3"
                />
                {errors.condition && (
                  <p className="mt-1 text-sm text-error-600">{errors.condition}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Save" className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;