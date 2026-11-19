import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "@/lib/wouter";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { useEffect, useState, Suspense } from "react";
import { LogoLoader } from "@/components/logo-loader";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DarkModeProvider } from "@/contexts/dark-mode-context";
import { MatchProvider } from "@/contexts/match-context";
import { PancoProvider } from "@/contexts/panco-context";
import { CityFilterProvider } from "@/contexts/city-filter-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { NetworkStatus } from "@/components/network-status";
import { JingleMiniPlayer } from "@/components/jingle-mini-player";
import { ScrollDeer } from "@/components/scroll-deer";

const Splash = lazyWithRetry(() => import("@/pages/splash"));
const Home = lazyWithRetry(() => import("@/pages/home"));
const EventPage = lazyWithRetry(() => import("@/pages/event"));
const EventDetail = lazyWithRetry(() => import("@/pages/event-detail"));
const EventCheckout = lazyWithRetry(() => import("@/pages/event-checkout"));
const CekTiketPage = lazyWithRetry(() => import("@/pages/cek-tiket"));
const KomunitasPage = lazyWithRetry(() => import("@/pages/komunitas"));
const RecruitmentPage = lazyWithRetry(() => import("@/pages/recruitment"));
const PortofolioPage = lazyWithRetry(() => import("@/pages/portofolio"));
const ProgramPage = lazyWithRetry(() => import("@/pages/program"));
const ClientAccessPage = lazyWithRetry(() => import("@/pages/client-access"));
const ProgramPasarSeniPage = lazyWithRetry(() => import("@/pages/program-pasar-seni-garut"));
const PasarSeniGarut2026Page = lazyWithRetry(() => import("@/pages/pasar-seni-garut-2026"));
const LombaPage = lazyWithRetry(() => import("@/pages/lomba"));
const ContactPage = lazyWithRetry(() => import("@/pages/contact"));
const DigitalServicesPage = lazyWithRetry(() => import("@/pages/digital-services"));
const DigitalSuperAppDemoPage = lazyWithRetry(() => import("@/pages/digital-super-app-demo"));
const DigitalTicketingDemoPage = lazyWithRetry(() => import("@/pages/digital-ticketing-demo"));
const DigitalKasirDemoPage = lazyWithRetry(() => import("@/pages/digital-kasir-demo"));
const DigitalQueueDemoPage = lazyWithRetry(() => import("@/pages/digital-queue-demo"));
const DigitalBookingDemoPage = lazyWithRetry(() => import("@/pages/digital-booking-demo"));
const DigitalPurchasingDemoPage = lazyWithRetry(() => import("@/pages/digital-purchasing-demo"));
const DigitalLoyaltyDemoPage = lazyWithRetry(() => import("@/pages/digital-loyalty-demo"));
const DigitalWarehouseDemoPage = lazyWithRetry(() => import("@/pages/digital-warehouse-demo"));
const DigitalInvitationDemoPage = lazyWithRetry(() => import("@/pages/digital-invitation-demo"));
const DigitalCompanyDemoPage = lazyWithRetry(() => import("@/pages/digital-company-demo"));
const DigitalYearbookDemoPage = lazyWithRetry(() => import("@/pages/digital-yearbook-demo"));
const DigitalMarketingDemoPage = lazyWithRetry(() => import("@/pages/digital-marketing-demo"));
const DigitalQrMenuDemoPage = lazyWithRetry(() => import("@/pages/digital-qr-menu-demo"));
const DigitalQrMenuCustomerPage = lazyWithRetry(() => import("@/pages/digital-qr-menu-demo").then((module) => ({ default: module.QrMenuCustomerPage })));
const DigitalCrmDemoPage = lazyWithRetry(() => import("@/pages/digital-crm-demo"));
const DigitalInvoiceDemoPage = lazyWithRetry(() => import("@/pages/digital-invoice-demo"));
const DigitalDapurStockDemoPage = lazyWithRetry(() => import("@/pages/digital-dapur-stock-demo"));
const DigitalHppDemoPage = lazyWithRetry(() => import("@/pages/digital-hpp-demo"));
const DigitalRecipeDemoPage = lazyWithRetry(() => import("@/pages/digital-recipe-demo"));
const DigitalHumanResourceDemoPage = lazyWithRetry(() => import("@/pages/digital-human-resource-demo"));
const DigitalLinkBioDemoPage = lazyWithRetry(() => import("@/pages/digital-link-bio-demo"));
const EventOrganizerPage = lazyWithRetry(() => import("@/pages/event-organizer"));
const WeddingOrganizerPage = lazyWithRetry(() => import("@/pages/wedding-organizer"));
const InvitationDemoPage = lazyWithRetry(() => import("@/pages/invitation-demo"));
const WeddingInvitationPage = lazyWithRetry(() => import("@/pages/wedding-invitation"));
const BusinessSystemPage = lazyWithRetry(() => import("@/pages/business-system"));
const DesignCreativePage = lazyWithRetry(() => import("@/pages/design-creative"));
const WebDevelopmentPage = lazyWithRetry(() => import("@/pages/web-development"));
const SosmedManagementPage = lazyWithRetry(() => import("@/pages/sosmed-management"));
const PriceListPage = lazyWithRetry(() => import("@/pages/price-list"));
const TalentPage = lazyWithRetry(() => import("@/pages/talent-management"));
const MerchandisePage = lazyWithRetry(() => import("@/pages/merchandise"));
const ProdukCustomPage = lazyWithRetry(() => import("@/pages/produk-custom"));
const CustomGarutPage = lazyWithRetry(() => import("@/pages/custom-garut"));
const TumblerCustomPage = lazyWithRetry(() => import("@/pages/tumbler-custom"));
const YearBookPage = lazyWithRetry(() => import("@/pages/year-book"));
const YearBookAngkatanPage = lazyWithRetry(() => import("@/pages/year-book-angkatan"));
const MomenKelasDemoPage = lazyWithRetry(() => import("@/pages/momen-kelas-demo"));
const MomenGrupDemoPage = lazyWithRetry(() => import("@/pages/momen-grup-demo"));
const MomenOrganisasiDemoPage = lazyWithRetry(() => import("@/pages/momen-organisasi-demo"));
const MomenEventDemoPage = lazyWithRetry(() => import("@/pages/momen-event-demo"));
const MomenKomunitasDemoPage = lazyWithRetry(() => import("@/pages/momen-komunitas-demo"));
const UcapanSpesialDemoPage = lazyWithRetry(() => import("@/pages/ucapan-spesial-demo"));
const NotifikasiPage = lazyWithRetry(() => import("@/pages/notifikasi"));
const TosPage = lazyWithRetry(() => import("@/pages/tos"));
const CariPage = lazyWithRetry(() => import("@/pages/cari"));
const PrivacyPage = lazyWithRetry(() => import("@/pages/privacy"));
const NotFound = lazyWithRetry(() => import("@/pages/not-found"));
const MaintenancePage = lazyWithRetry(() => import("@/pages/maintenance"));

const IS_MAINTENANCE = import.meta.env.VITE_MAINTENANCE_MODE === "true";

const queryClient = new QueryClient();
void QueryClient;

function PageFallback() {
  return <LogoLoader />;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      target.scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  const [location] = useLocation();
  return (
    <>
    {/* sepasang rusa ikut gulir di semua halaman; dipasang ulang tiap pindah halaman */}
    <ScrollDeer key={location} />
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: "easeInOut" }}
        style={{ minHeight: "100dvh" }}
      >
    <Suspense fallback={null}>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      
      <Route path="/event" component={EventPage} />
      <Route path="/event/:slug/checkout" component={EventCheckout} />
      <Route path="/event/:slug" component={EventDetail} />
      <Route path="/cek-tiket" component={CekTiketPage} />
      <Route path="/komunitas" component={KomunitasPage} />
      <Route path="/recruitment" component={RecruitmentPage} />
      <Route path="/portofolio" component={PortofolioPage} />
      <Route path="/client-access" component={ClientAccessPage} />
      <Route path="/program" component={ProgramPage} />
      <Route path="/program/pasar-seni-garut" component={ProgramPasarSeniPage} />
      <Route path="/pasar-seni-garut-2026" component={PasarSeniGarut2026Page} />
      <Route path="/lomba" component={LombaPage} />
      <Route path="/year-book/contoh">
        <Redirect to="/year-book/2026" />
      </Route>
      <Route path="/year-book/2026" component={YearBookAngkatanPage} />
      <Route path="/year-book/kelas" component={MomenKelasDemoPage} />
      <Route path="/year-book/geng-grup" component={MomenGrupDemoPage} />
      <Route path="/year-book/organisasi" component={MomenOrganisasiDemoPage} />
      <Route path="/year-book/event" component={MomenEventDemoPage} />
      <Route path="/year-book/komunitas" component={MomenKomunitasDemoPage} />
      <Route path="/year-book/ucapan-spesial" component={UcapanSpesialDemoPage} />
      <Route path="/year-book" component={YearBookPage} />
      <Route path="/contact" component={ContactPage} />
      
      <Route path="/digital-services/super-app" component={DigitalSuperAppDemoPage} />
      <Route path="/digital-services/ticketing" component={DigitalTicketingDemoPage} />
      <Route path="/digital-services/kasir" component={DigitalKasirDemoPage} />
      <Route path="/digital-services/antrian" component={DigitalQueueDemoPage} />
      <Route path="/digital-services/booking" component={DigitalBookingDemoPage} />
      <Route path="/digital-services/purchasing" component={DigitalPurchasingDemoPage} />
      <Route path="/digital-services/loyalty" component={DigitalLoyaltyDemoPage} />
      <Route path="/digital-services/gudang" component={DigitalWarehouseDemoPage} />
      <Route path="/digital-services/invitation" component={DigitalInvitationDemoPage} />
      <Route path="/digital-services/company" component={DigitalCompanyDemoPage} />
      <Route path="/digital-services/yearbook" component={DigitalYearbookDemoPage} />
      <Route path="/digital-services/marketing" component={DigitalMarketingDemoPage} />
      <Route path="/digital-services/qr-menu/customer/:tableId" component={DigitalQrMenuCustomerPage} />
      <Route path="/digital-services/qr-menu" component={DigitalQrMenuDemoPage} />
      <Route path="/digital-services/crm" component={DigitalCrmDemoPage} />
      <Route path="/digital-services/invoice" component={DigitalInvoiceDemoPage} />
      <Route path="/digital-services/dapur-stock" component={DigitalDapurStockDemoPage} />
      <Route path="/digital-services/hpp" component={DigitalHppDemoPage} />
      <Route path="/digital-services/resep" component={DigitalRecipeDemoPage} />
      <Route path="/digital-services/human-resource" component={DigitalHumanResourceDemoPage} />
      <Route path="/digital-services/link-bio" component={DigitalLinkBioDemoPage} />
      <Route path="/digital-services" component={DigitalServicesPage} />
      <Route path="/event-organizer" component={EventOrganizerPage} />
      <Route path="/wedding-organizer" component={WeddingOrganizerPage} />
      <Route path="/wedding-invitation/tema/:slug" component={InvitationDemoPage} />
      <Route path="/wedding-invitation" component={WeddingInvitationPage} />
      <Route path="/business-system" component={BusinessSystemPage} />
      <Route path="/design-creative" component={DesignCreativePage} />
      <Route path="/web-development" component={WebDevelopmentPage} />
      <Route path="/sosmed-management" component={SosmedManagementPage} />
      <Route path="/kerja-sama" component={PriceListPage} />
      <Route path="/price-list" component={PriceListPage} />
      <Route path="/talent" component={TalentPage} />
      <Route path="/merchandise" component={MerchandisePage} />
      <Route path="/produk-custom" component={ProdukCustomPage} />
      <Route path="/custom-garut" component={CustomGarutPage} />
      <Route path="/tumbler-custom" component={TumblerCustomPage} />
      <Route path="/cari" component={CariPage} />
      <Route path="/notifikasi" component={NotifikasiPage} />
      <Route path="/tos" component={TosPage} />
      <Route path="/privacy" component={PrivacyPage} />
      
      <Route component={NotFound} />
    </Switch>
    </Suspense>
    </motion.div>
    </AnimatePresence>
    </>
  );
}

function App() {
  const initPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const isHomePath = initPath === "/" || initPath === "";
  // The opening screen (glowing antlers) shows whenever the home page is opened, preview included.
  const [showSplash, setShowSplash] = useState(isHomePath);

  useEffect(() => {
    if (!showSplash) return;

    // Do not let a throttled animation frame leave the app behind the splash.
    const fallback = window.setTimeout(() => setShowSplash(false), 6000);
    return () => window.clearTimeout(fallback);
  }, [showSplash]);

  if (IS_MAINTENANCE) {
    return (
      <Suspense fallback={<PageFallback />}>
        <MaintenancePage />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
    <MatchProvider>
    <PancoProvider>
    <DarkModeProvider>
     <CityFilterProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <NetworkStatus />
          <WouterRouter>
            <Router />
          </WouterRouter>
          <Toaster />
          <JingleMiniPlayer />
        </TooltipProvider>
        {showSplash && (
          <Suspense fallback={null}>
            <Splash onDone={() => setShowSplash(false)} />
          </Suspense>
        )}
      </QueryClientProvider>
     </CityFilterProvider>
    </DarkModeProvider>
    </PancoProvider>
    </MatchProvider>
    </ErrorBoundary>
  );
}

export default App;
