import { useState, useEffect } from "react";
import PatientTable from "@/components/organisms/PatientTable";
import PatientModal from "@/components/organisms/PatientModal";
import PatientFilterPanel from "@/components/organisms/PatientFilterPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getPatients } from "@/services/api/patientService";

const Patients = () => {
const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  });
const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      setError("Failed to load patients");
      console.error("Error loading patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter patients based on current filters
  const applyFilters = () => {
    let filtered = [...patients];

    // Department filter
    if (filters.department) {
      filtered = filtered.filter(patient => {
        const department = getDepartmentFromRoom(patient.roomNumber);
        return department === filters.department;
      });
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(patient => 
        patient.admissionStatus === filters.status
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(patient => {
        const admissionDate = new Date(patient.admissionDate);
        return admissionDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(patient => {
        const admissionDate = new Date(patient.admissionDate);
        return admissionDate <= toDate;
      });
    }

    setFilteredPatients(filtered);
  };

  // Extract department from room number (e.g., "A-101" -> "A")
  const getDepartmentFromRoom = (roomNumber) => {
    return roomNumber ? roomNumber.split('-')[0] : '';
  };

  // Get unique departments from patients
  const getAvailableDepartments = () => {
    const departments = patients.map(patient => getDepartmentFromRoom(patient.roomNumber));
    return [...new Set(departments)].filter(Boolean).sort();
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      department: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [patients, filters]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  if (isLoading) {
    return <Loading message="Loading patients..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPatients} />;
  }

  if (patients.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Patient Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage patient records and medical information
          </p>
        </div>
        <Empty
          title="No patients registered"
          description="There are no patients in the system yet. Register the first patient to get started."
          icon="Users"
          actionText="Register New Patient"
          onAction={() => {/* Implement patient registration */}}
        />
      </div>
    );
  }

return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          Patient Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage patient records and medical information
        </p>
      </div>

      {/* Filter Panel */}
      <PatientFilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        availableDepartments={getAvailableDepartments()}
      />

      {/* Patient Table */}
      <PatientTable
        patients={filteredPatients}
        onPatientClick={handlePatientClick}
        isLoading={isLoading}
      />

      {/* Patient Modal */}
      <PatientModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Patients;