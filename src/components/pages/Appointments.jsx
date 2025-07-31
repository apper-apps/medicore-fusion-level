import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Appointments = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Appointment Management
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage patient appointments efficiently
          </p>
        </div>
        <Button className="ml-4">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center mb-4">
            <ApperIcon name="Calendar" className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl">Appointment System</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-lg">
            Advanced appointment management system coming soon!
          </p>
          <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900">Upcoming Features:</h4>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Interactive calendar view</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Online booking system</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Automated reminders</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Resource scheduling</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;