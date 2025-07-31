import { useState, useEffect } from "react";
import PatientTable from "@/components/organisms/PatientTable";
import PatientModal from "@/components/organisms/PatientModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getPatients } from "@/services/api/patientService";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      setError("Failed to load patients");
      console.error("Error loading patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

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

      {/* Patient Table */}
      <PatientTable
        patients={patients}
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