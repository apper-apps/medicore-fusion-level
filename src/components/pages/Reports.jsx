import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Generate comprehensive reports and analyze hospital performance
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-error-500 to-error-600 flex items-center justify-center mb-4">
            <ApperIcon name="BarChart3" className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-lg">
            Powerful reporting and analytics system coming soon!
          </p>
          <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900">Upcoming Features:</h4>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Patient flow analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Financial performance reports</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Staff productivity metrics</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Custom report builder</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;