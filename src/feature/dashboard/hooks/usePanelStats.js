import { useQuery } from "@tanstack/react-query";
import { getPanelStats } from "../api/dashboardApi";

export function usePanelStats(options = {}) {
  return useQuery({
    queryKey: ["panelStats"],
    queryFn: getPanelStats,
    ...options,
  });
}
