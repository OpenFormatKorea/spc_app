import { fetchHourlySignUpGraph } from "@/lib/campaign/reportapis";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";

export const useFetchReport = (
  startDate: string,
  endDate: string,
  context: GetServerSidePropsContext,
) => {
  const shopId = getCookie("shop_id_standalone") as string;

  // Hourly Stats
  const [hourlyStats, setHourlyStats] = useState(null);
  const [hourlyStatsLoading, setHourlyStatsLoading] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) return;

    // Fetch Hourly Signup Stats
    const fetchHourlyStats = async () => {
      try {
        setHourlyStatsLoading(true);
        const hourlyStatsResponse = await fetchHourlySignUpGraph(
          startDate,
          endDate,
          context,
        );
        setHourlyStats(hourlyStatsResponse.data);
      } catch (error) {
        console.error("Error fetching hourly stats:", error);
      } finally {
        setHourlyStatsLoading(false);
      }
    };
  }, [shopId, startDate, endDate]);

  return {
    hourlyStats,
    hourlyStatsLoading,
  };
};
