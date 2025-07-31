import { useState } from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const PatientTable = ({ patients, onPatientClick, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

const filteredAndSortedPatients = patients
    .filter(patient =>
      patient.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.Id.toString().includes(searchQuery) ||
      patient.attendingDoctor?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getSortIcon = (field) => {
    if (sortField !== field) return "ArrowUpDown";
    return sortDirection === "asc" ? "ArrowUp" : "ArrowDown";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
          <div className="w-80">
            <SearchBar
              placeholder="Search by name, ID, or doctor..."
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("Id")}
                  className="font-medium text-gray-500 hover:text-gray-700"
                >
                  Patient ID
                  <ApperIcon name={getSortIcon("Id")} className="ml-1 h-4 w-4" />
                </Button>
              </th>
              <th>
                <Button
                  variant="ghost"
                  size="sm"
onClick={() => handleSort("Name")}
                  className="font-medium text-gray-500 hover:text-gray-700"
                >
                  Name
                  <ApperIcon name={getSortIcon("Name")} className="ml-1 h-4 w-4" />
                </Button>
              </th>
              <th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("roomNumber")}
                  className="font-medium text-gray-500 hover:text-gray-700"
                >
                  Room
                  <ApperIcon name={getSortIcon("roomNumber")} className="ml-1 h-4 w-4" />
                </Button>
              </th>
              <th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("attendingDoctor")}
                  className="font-medium text-gray-500 hover:text-gray-700"
                >
                  Attending Doctor
                  <ApperIcon name={getSortIcon("attendingDoctor")} className="ml-1 h-4 w-4" />
                </Button>
              </th>
              <th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("admissionStatus")}
                  className="font-medium text-gray-500 hover:text-gray-700"
                >
                  Status
                  <ApperIcon name={getSortIcon("admissionStatus")} className="ml-1 h-4 w-4" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedPatients.map((patient) => (
              <tr
                key={patient.Id}
                onClick={() => onPatientClick(patient)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
<td className="font-medium text-primary-600">#{patient.Id}</td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {patient.Name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{patient.Name}</span>
                  </div>
                </td>
                <td className="text-gray-600">{patient.roomNumber}</td>
                <td className="text-gray-600">{patient.attendingDoctor}</td>
                <td>
                  <Badge variant={getStatusBadgeVariant(patient.admissionStatus)}>
                    {patient.admissionStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedPatients.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">
            {searchQuery ? "Try adjusting your search criteria" : "No patients have been registered yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientTable;