import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { builtinPosters, eventPortfolioItems, type EventPortfolioItem } from "@/data/event-portfolio";
import { PORTFOLIO_EVENT_COLUMNS, rowsToPortfolio, withBuiltinEvents, type PortfolioEventRow } from "@/lib/portfolio-events";

export const portfolioEventsQueryKey = ["portfolio-events"] as const;

/**
 * Acara Nempo dari database (diatur admin di /cms/acara), digabung dengan daftar
 * bawaan supaya riwayat tidak hilang walau database masih kosong (misalnya
 * setelah proyek disalin ke akun lain). Kalau database tidak bisa dihubungi,
 * pakai daftar bawaan saja.
 */
export function usePortfolioEvents(): { items: EventPortfolioItem[]; isLoading: boolean } {
  const query = useQuery({
    queryKey: portfolioEventsQueryKey,
    queryFn: async () => {
      const [rowsRes, hiddenRes] = await Promise.all([
        supabase.from("portfolio_events").select(PORTFOLIO_EVENT_COLUMNS).eq("active", true).order("start_date"),
        supabase.rpc("hidden_portfolio_event_keys"),
      ]);
      if (rowsRes.error) throw rowsRes.error;
      const rows = (rowsRes.data ?? []) as PortfolioEventRow[];
      const hidden = hiddenRes.error ? [] : ((hiddenRes.data ?? []) as unknown as string[]).filter(Boolean);
      return withBuiltinEvents(rowsToPortfolio(rows, builtinPosters), rows, hidden, eventPortfolioItems);
    },
    staleTime: 60_000,
    retry: 1,
  });
  if (query.isError) return { items: eventPortfolioItems, isLoading: false };
  return { items: query.data ?? eventPortfolioItems, isLoading: query.isLoading };
}
