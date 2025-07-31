import { useState, useEffect } from "react";
import PatientTable from "@/components/organisms/PatientTable";
import PatientModal from "@/components/organisms/PatientModal";
import PatientRegistrationModal from "@/components/organisms/PatientRegistrationModal";
import PatientFilterPanel from "@/components/organisms/PatientFilterPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { getPatients } from "@/services/api/patientService";
import { toast } from "react-toastify";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
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

  const handleOpenRegistration = () => {
    setIsRegistrationOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsRegistrationOpen(false);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationOpen(false);
    loadPatients(); // Refresh the patient list
    toast.success("Patient registered successfully!");
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
onAction={handleOpenRegistration}
        />
      </div>
    );
  }

return (
    <div className="space-y-6">
      {/* Header */}
<div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Patient Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage patient records and medical information
          </p>
        </div>
        <Button
          onClick={handleOpenRegistration}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <ApperIcon name="Plus" size={16} />
          New Patient
        </Button>
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

      {/* Patient Registration Modal */}
      <PatientRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={handleCloseRegistration}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default Patients;