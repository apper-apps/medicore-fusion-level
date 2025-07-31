import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import staffService from "@/services/api/staffService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    role: '',
    department: '',
    contactInformation: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Load staff data on component mount
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = () => {
    setFormData({
      Name: '',
      role: '',
      department: '',
      contactInformation: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      Name: '',
      role: '',
      department: '',
      contactInformation: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setSubmitting(true);
      await staffService.create(formData);
      toast.success('Staff member added successfully');
      handleCloseModal();
      loadStaff(); // Refresh the staff list
    } catch (err) {
      toast.error(err.message || 'Failed to add staff member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
{/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Staff Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage hospital staff, schedules, and personnel information
          </p>
        </div>
        <Button 
          onClick={handleAddStaff}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Add Staff
        </Button>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Users" size={24} />
            Staff Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <span>Loading staff...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-2" />
                <p>Error loading staff data</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
              </div>
              <Button onClick={loadStaff} variant="outline">
                Try Again
              </Button>
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Members</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first staff member.</p>
              <Button onClick={handleAddStaff}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add First Staff Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Contact Information</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.Id}>
                      <td className="font-medium">{member.Name}</td>
                      <td>{member.role || 'N/A'}</td>
                      <td>{member.department || 'N/A'}</td>
                      <td>{member.contactInformation || 'N/A'}</td>
                      <td>
                        {member.CreatedOn ? new Date(member.CreatedOn).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.info('Edit functionality coming soon')}
                          >
                            <ApperIcon name="Edit" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => toast.info('Delete functionality coming soon')}
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Staff Member</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                disabled={submitting}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <Input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  placeholder="Enter staff member name"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Doctor, Nurse, Administrator"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <Input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Emergency, ICU, Pediatrics"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Information
                </label>
                <Input
                  type="text"
                  name="contactInformation"
                  value={formData.contactInformation}
                  onChange={handleInputChange}
                  placeholder="Phone number or email"
                  disabled={submitting}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Add Staff Member
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;