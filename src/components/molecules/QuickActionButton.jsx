import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickActionButton = ({ title, description, icon, onClick, variant = "outline" }) => {
  return (
    <Button
      variant={variant}
      size="lg"
      onClick={onClick}
      className="h-auto p-6 flex flex-col items-center space-y-3 hover:scale-105 transform transition-all duration-300"
    >
      <div className="p-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
        <ApperIcon name={icon} className="h-8 w-8 text-white" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </Button>
  );
};

export default QuickActionButton;