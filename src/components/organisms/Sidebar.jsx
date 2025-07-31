import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Patients", href: "/patients", icon: "Users" },
    { name: "Staff", href: "/staff", icon: "UserCheck" },
    { name: "Appointments", href: "/appointments", icon: "Calendar" },
    { name: "Departments", href: "/departments", icon: "Building2" },
    { name: "Inventory", href: "/inventory", icon: "Package" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0", className)}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
                <ApperIcon name="Heart" className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  MediCore Hub
                </h1>
                <p className="text-sm text-gray-500">Hospital Management</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "sidebar-nav-item",
                    isActive && "active"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="relative flex flex-col w-64 bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex items-center justify-between flex-shrink-0 px-6 py-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
                  <ApperIcon name="Heart" className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    MediCore Hub
                  </h1>
                  <p className="text-sm text-gray-500">Hospital Management</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <nav className="flex-1 px-4 pb-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "sidebar-nav-item",
                      isActive && "active"
                    )
                  }
                >
                  <ApperIcon name={item.icon} className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;