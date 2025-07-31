import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Staff = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          Staff Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage hospital staff, schedules, and personnel information
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-center mb-4">
            <ApperIcon name="UserCheck" className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl">Staff Management</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-lg">
            Complete staff management system coming soon!
          </p>
          <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900">Upcoming Features:</h4>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Staff directory and profiles</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Shift scheduling and management</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Department assignments</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Performance tracking</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;