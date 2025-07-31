import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Inventory = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          Inventory Management
        </h1>
        <p className="text-gray-600 mt-2">
          Track medical supplies, equipment, and pharmaceutical inventory
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-success-500 to-success-600 flex items-center justify-center mb-4">
            <ApperIcon name="Package" className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl">Inventory Control</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-lg">
            Advanced inventory management system coming soon!
          </p>
          <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900">Upcoming Features:</h4>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Real-time stock tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Automated reorder alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Expiration date monitoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <ApperIcon name="Check" className="h-4 w-4 text-success-600" />
                <span>Supplier management</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;