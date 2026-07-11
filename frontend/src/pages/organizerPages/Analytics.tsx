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

export default function Analytics() {
  const [loadingAllTime, setLoadingAllTime] = useState(true);
  const [allTimeError, setAllTimeError] = useState<string | null>(null);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [filteredError, setFilteredError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"day" | "week" | "custom">("day");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null); // Only used for custom range
  const [allTimeData, setAllTimeData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchAllTimeData = async () => {
      const fetchedData = await getAllAnalytics();
      setAllTimeData(fetchedData);
      setLoadingAllTime(false);
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
            {loadingAllTime ? <p>Loading...</p> : <p>All Time Stats</p>}
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
