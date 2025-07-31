import { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import QuickActions from "@/components/organisms/QuickActions";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getMetrics } from "@/services/api/metricsService";
import { getActivities } from "@/services/api/activityService";
const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [metricsError, setMetricsError] = useState("");
  const [activitiesError, setActivitiesError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [updatedMetricIndex, setUpdatedMetricIndex] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement dashboard search functionality here
  };

const loadMetrics = async () => {
    try {
      setIsLoadingMetrics(true);
      setMetricsError("");
      const data = await getMetrics();
      setMetrics(data);
    } catch (error) {
      setMetricsError("Failed to load hospital metrics");
      console.error("Error loading metrics:", error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Handle real-time metric updates
  const handleMetricUpdate = (updatedMetrics, changedIndex) => {
    setMetrics([...updatedMetrics]);
    setUpdatedMetricIndex(changedIndex);
    
    // Clear the highlight after animation
    setTimeout(() => {
      setUpdatedMetricIndex(null);
    }, 1000);
  };

  // Handle WebSocket connection status
  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
    if (!connected) {
      setMetricsError("Connection lost. Attempting to reconnect...");
    } else {
      setMetricsError("");
    }
  };

  const loadActivities = async () => {
    try {
      setIsLoadingActivities(true);
      setActivitiesError("");
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      setActivitiesError("Failed to load recent activities");
      console.error("Error loading activities:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

useEffect(() => {
    loadMetrics();
    loadActivities();

    // Import WebSocket functions dynamically to avoid module loading issues
    import('@/services/api/metricsService').then(({ connectWebSocket, disconnectWebSocket }) => {
      // Establish WebSocket connection for live updates
      const ws = connectWebSocket(handleMetricUpdate, handleConnectionChange);

      // Cleanup on unmount
      return () => {
        disconnectWebSocket();
      };
    });
  }, []);

  if (isLoadingMetrics && isLoadingActivities) {
    return <Loading message="Loading hospital dashboard..." />;
  }

  if (metricsError && activitiesError) {
    return (
      <Error 
        message="Failed to load dashboard data. Please try again."
        onRetry={() => { loadMetrics(); loadActivities(); }}
      />
    );
  }

  return (
    <div className="space-y-6">
{/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          Hospital Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor key metrics and manage hospital operations efficiently
        </p>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-md">
        <SearchBar
          placeholder="Search patients, staff, departments..."
          onSearch={handleSearch}
        />
      </div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingMetrics ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-12"></div>
            </div>
          ))
        ) : metricsError ? (
<div className="col-span-full flex items-center justify-between">
            <Error message={metricsError} onRetry={loadMetrics} />
            {isConnected && (
              <div className="flex items-center space-x-2 text-success-600 text-sm">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span>Live Updates Active</span>
              </div>
            )}
          </div>
        ) : (
metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.label}
              value={metric.value}
              unit={metric.unit}
              trend={metric.trend}
              icon={metric.icon}
              color={metric.color}
              isLive={isConnected}
              isUpdated={updatedMetricIndex === index}
              lastUpdated={metric.lastUpdated}
            />
          ))
        )}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {activitiesError ? (
          <Error message={activitiesError} onRetry={loadActivities} />
        ) : (
          <ActivityFeed 
            activities={activities} 
            isLoading={isLoadingActivities}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;