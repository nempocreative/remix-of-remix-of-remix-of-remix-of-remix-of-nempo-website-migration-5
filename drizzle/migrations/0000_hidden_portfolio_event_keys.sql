CREATE OR REPLACE FUNCTION public.hidden_portfolio_event_keys()
RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT builtin_poster FROM public.portfolio_events WHERE active = false AND builtin_poster IS NOT NULL $$;
REVOKE EXECUTE ON FUNCTION public.hidden_portfolio_event_keys() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.hidden_portfolio_event_keys() TO anon, authenticated, service_role;