import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import PortfolioLayout from './layouts/PortfolioLayout'
import HomePage from './pages/HomePage'
import BlackfangCampaignLayout from './pages/BlackfangCampaignLayout'
import BlackfangAboutPage from './pages/BlackfangAboutPage'
import BlackfangCampaignHomePage from './pages/BlackfangCampaignHomePage'
import KillTeamIndex from './pages/KillTeamIndex'
import BlackfangPartyPage from './pages/BlackfangPartyPage'
import PlayerOperativesPage from './pages/PlayerOperativesPage'
import NewPlayerOperativePage from './pages/NewPlayerOperativePage'
import KillTeamPage from './pages/KillTeamPage'
import HomebrewTeamPage from './pages/HomebrewTeamPage'
import HomebrewOperativePage from './pages/HomebrewOperativePage'
import DataTableScanabilityPage from './pages/ux/DataTableScanabilityPage'
import CheckoutFunnelSimplificationPage from './pages/ux/CheckoutFunnelSimplificationPage'
import OnboardingEmptyStatesPage from './pages/ux/OnboardingEmptyStatesPage'
import ErrorLoadingPatternsPage from './pages/ux/ErrorLoadingPatternsPage'
import AccessibilityCoreFlowsPage from './pages/ux/AccessibilityCoreFlowsPage'
import UxImprovementsPage from './pages/ux/UxImprovementsPage'
import SchemaBridgePage from './pages/SchemaBridgePage'
import ResumePage from './pages/ResumePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioLayout />}>
          <Route index element={<HomePage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="projects/ux" element={<UxImprovementsPage />} />
          <Route path="projects/ux/checkout-funnel-simplification" element={<CheckoutFunnelSimplificationPage />} />
          <Route path="projects/ux/onboarding-empty-states" element={<OnboardingEmptyStatesPage />} />
          <Route path="projects/ux/data-table-scanability" element={<DataTableScanabilityPage />} />
          <Route path="projects/ux/error-loading-patterns" element={<ErrorLoadingPatternsPage />} />
          <Route path="projects/ux/accessibility-core-flows" element={<AccessibilityCoreFlowsPage />} />
          <Route path="projects/schema-bridge" element={<SchemaBridgePage />} />
          <Route
            path="projects/human-in-the-loop-ai"
            element={<Navigate to="/projects/schema-bridge" replace />}
          />
          <Route path="projects/blackfang-campaign" element={<BlackfangCampaignLayout />}>
            <Route index element={<BlackfangCampaignHomePage />} />
            <Route path="about" element={<BlackfangAboutPage />} />
            <Route path="kt24-data" element={<KillTeamIndex />} />
            <Route path="kt24-data/:tabId" element={<KillTeamIndex />} />
            <Route path="kill-teams" element={<Navigate to="kt24-data" replace />} />
            <Route path="party" element={<BlackfangPartyPage />} />
            <Route path="player-operatives/new" element={<NewPlayerOperativePage />} />
            <Route path="player-operatives" element={<PlayerOperativesPage />} />
            <Route path="section-3" element={<Navigate to="party" replace />} />
            <Route path="homebrew-operative/:operativeId" element={<HomebrewOperativePage />} />
            <Route path="homebrew/:teamId" element={<HomebrewTeamPage />} />
            <Route
              path="deathwatch-veterans"
              element={<Navigate to="/projects/blackfang-campaign/deathwatch" replace />}
            />
            <Route path=":teamSlug" element={<KillTeamPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
