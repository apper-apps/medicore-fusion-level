import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PatientFilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  availableDepartments = [] 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "stable", label: "Stable" },
    { value: "critical", label: "Critical" },
    { value: "observation", label: "Observation" },
    { value: "discharged", label: "Discharged" }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Filter Toggle Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="Filter" size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Patients</h3>
            {hasActiveFilters && (
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            )}
          </div>
          <ApperIcon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-gray-500" 
          />
        </button>
      </div>

      {/* Filter Content */}
<div className={cn(
        "px-6 transition-all duration-300 ease-in-out",
        isExpanded ? "py-6 max-h-96" : "py-0 max-h-0 overflow-hidden"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Patient Name Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name
            </label>
            <Input
              type="text"
              placeholder="Search by name..."
              value={filters.patientName || ""}
              onChange={(e) => handleFilterChange("patientName", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filters.department || ""}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Departments</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Admission Date Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Date
            </label>
            <Input
              type="date"
              value={filters.admissionDate || ""}
              onChange={(e) => handleFilterChange("admissionDate", e.target.value)}
              className="w-full"
            />
          </div>

        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {hasActiveFilters && "Filters applied"}
          </div>
          <div className="flex gap-3">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-600 hover:text-gray-900"
              >
                <ApperIcon name="X" size={16} className="mr-2" />
                Clear Filters
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientFilterPanel;