import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { NetworkTools } from './views/NetworkTools';
import { ProfileSettings } from './views/ProfileSettings';
import { SubnetCalculator } from './views/SubnetCalculator';
import { SSLInspector } from './views/SSLInspector';
import { ConfigGenerator } from './views/ConfigGenerator';
import { MacLookup } from './views/MacLookup';
import { DnsPropagation } from './views/DnsPropagation';
import { BotAutomation } from './views/BotAutomation';
import { LandingPage } from './views/LandingPage';

import {  Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (

      <Routes>

        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* All dashboard tools use Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<NetworkTools initialTab="scanner" />} />
          <Route path="/map" element={<NetworkTools initialTab="map" />} />
          <Route path="/dns" element={<NetworkTools initialTab="dns" />} />
          <Route path="/ai" element={<NetworkTools initialTab="ai" />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/subnet" element={<SubnetCalculator />} />
          <Route path="/ssl" element={<SSLInspector />} />
          <Route path="/config" element={<ConfigGenerator />} />
          <Route path="/mac" element={<MacLookup />} />
          <Route path="/dns-propagation" element={<DnsPropagation />} />
          <Route path="/bot-automation" element={<BotAutomation />} />
        </Route>

      </Routes>

  );
};

export default App;
