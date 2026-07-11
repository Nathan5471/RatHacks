import { useState, useEffect } from "react";
import {
  getDayAnalytics,
  getWeekAnalytics,
  getCustomRangeAnalytics,
  getAllAnalytics,
  getUserSessions,
  getDeviceSessions,
} from "../../utils/AnalyticsAPIHandler";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import { IoMenu } from "react-icons/io5";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface AllTimeData {
  sessionStats: {
    _count: {
      id: number;
    };
    _avg: {
      sessionLength: number;
    };
  };
  pageViews: {
    _count: {
      id: number;
    };
  };
  pagesPerSession: number;
  activeUsers: number;
  deviceBreakdown: [
    {
      _count: {
        id: number;
      };
      deviceType: string;
    },
  ];
  osBreakdown: [
    {
      _count: {
        id: number;
      };
      operatingSystem: string;
    },
  ];
  browserBreakdown: [
    {
      _count: {
        id: number;
      };
      browser: string;
    },
  ];
}

interface FilteredData {
  pageViews: [
    {
      id: string;
      userId: string | null;
      createdAt: Date;
      url: string;
      sessionId: string | null;
      user: {
        id: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
      };
    },
  ];
}

export default function Analytics() {
  const [allTimeError, setAllTimeError] = useState<string | null>(null);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [filteredError, setFilteredError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"day" | "week" | "custom">("day");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null); // Only used for custom range
  const [allTimeData, setAllTimeData] = useState<AllTimeData | null>(null);
  const [filteredData, setFilteredData] = useState<FilteredData | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const pieChartColors = [
    "#e89eb8",
    "#006994",
    "#507d2a",
    "#ee7600",
    "#b666d2",
  ]; // Soft Pink, Sea Blue, Sap Green, Deep Orange, Lilac Color
  // ^ I picked these colors from eggradeints.com, the best color website out there

  useEffect(() => {
    const fetchAllTimeData = async () => {
      const fetchedData = await getAllAnalytics();
      setAllTimeData(fetchedData);
    };

    fetchAllTimeData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoadingFiltered(true);
      let fetchedData;
      if (filter === "day") {
        fetchedData = await getDayAnalytics(
          startDate.toISOString().slice(0, 10),
        );
      } else if (filter === "week") {
        fetchedData = await getWeekAnalytics(
          startDate.toISOString().slice(0, 10),
        );
      } else if (filter === "custom" && endDate) {
        fetchedData = await getCustomRangeAnalytics(
          startDate.toISOString().slice(0, 10),
          endDate.toISOString().slice(0, 10),
        );
      }
      if (fetchedData) {
        setFilteredData(fetchedData);
      }
      setLoadingFiltered(false);
    };

    fetchFilteredData();
  }, [filter, startDate, endDate]);

  return (
    <div className="relative w-screen h-screen flex flex-col sm:flex-row bg-surface-a0 text-white">
      <div
        className={`${
          navbarOpen ? "absolute inset-0 z-50 block bg-black/50" : "hidden"
        } md:block w-full md:w-1/5 lg:w-1/6 h-full`}
        onClick={() => setNavbarOpen(false)}
      >
        <div
          className="w-1/2 sm:w-1/3 md:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <OrganizerNavbar />
        </div>
      </div>
      <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
        <button
          className={`absolute top-4 left-4 md:hidden ${
            navbarOpen ? "hidden" : ""
          }`}
          onClick={() => setNavbarOpen(true)}
        >
          <IoMenu className="text-3xl hover:text-4xl" />
        </button>
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        <div className="w-5/6">
          <h2 className="text-2xl font-semibold mb-2">All Time Stats</h2>
          <div className="w-full bg-surface-a1 p-4 rounded-lg">
            {!allTimeData ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.sessionStats._count.id}
                      </span>
                    </div>
                    <h3 className="text-xl">Sessions</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.pageViews._count.id}
                      </span>
                    </div>
                    <h3 className="text-xl">Page Views</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.pagesPerSession.toFixed(0)}
                      </span>
                    </div>
                    <h3 className="text-xl">Views per Session</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.activeUsers}
                      </span>
                    </div>
                    <h3 className="text-xl">Active Users</h3>
                  </div>
                  <div className="flex flex-col m-2 items-center">
                    <div className="flex p-2 rounded-lg bg-surface-a2">
                      <span className="font-bold text-6xl text-primary-a0">
                        {allTimeData.sessionStats._avg.sessionLength.toFixed(0)}
                      </span>
                    </div>
                    <h3 className="text-xl">Average Session Length</h3>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="w-1/3 p-2 flex flex-col items-center">
                    <h3>Device Breakdown</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={allTimeData.deviceBreakdown.map((item) => ({
                            name: item.deviceType,
                            value: item._count.id,
                            fill: pieChartColors[
                              allTimeData.deviceBreakdown.indexOf(item) %
                                pieChartColors.length
                            ],
                          }))}
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/3 p-2 flex flex-col items-center">
                    <h3>OS Breakdown</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={allTimeData.osBreakdown.map((item) => ({
                            name: item.operatingSystem,
                            value: item._count.id,
                            fill: pieChartColors[
                              allTimeData.osBreakdown.indexOf(item) %
                                pieChartColors.length
                            ],
                          }))}
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/3 p-2 flex flex-col items-center">
                    <h3>Browser Breakdown</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={allTimeData.browserBreakdown.map((item) => ({
                            name: item.browser,
                            value: item._count.id,
                            fill: pieChartColors[
                              allTimeData.browserBreakdown.indexOf(item) %
                                pieChartColors.length
                            ],
                          }))}
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-5/6">
          <h2 className="text-2xl font-semibold mb-2">
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Stats
          </h2>
          <div className="w-full bg-surface-a1 p-4 rounded-lg">
            {loadingFiltered ? (
              <p>Loading...</p>
            ) : (
              <p>{filter.charAt(0).toUpperCase() + filter.slice(1)} Stats</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
