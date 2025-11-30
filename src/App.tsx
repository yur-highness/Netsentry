import React, { useState } from 'react';
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
import { ToolType } from './types';

const App: React.FC = () => {
  // Default to LANDING page
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.LANDING);

  // If in landing mode, show landing page without layout
  if (currentTool === ToolType.LANDING) {
      return <LandingPage onEnter={() => setCurrentTool(ToolType.DASHBOARD)} />;
  }

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.DASHBOARD:
        return <Dashboard />;
      case ToolType.SCANNER:
        return <NetworkTools initialTab="scanner" />;
      case ToolType.MAP:
        return <NetworkTools initialTab="map" />;
      case ToolType.DNS:
        return <NetworkTools initialTab="dns" />;
      case ToolType.AI_ANALYST:
        return <NetworkTools initialTab="ai" />;
      case ToolType.PROFILE:
        return <ProfileSettings />;
      case ToolType.SUBNET_CALC:
        return <SubnetCalculator />;
      case ToolType.SSL_INSPECTOR:
        return <SSLInspector />;
      case ToolType.CONFIG_GEN:
        return <ConfigGenerator />;
      case ToolType.MAC_LOOKUP:
        return <MacLookup />;
      case ToolType.DNS_PROPAGATION:
        return <DnsPropagation />;
      case ToolType.BOT_AUTOMATION:
        return <BotAutomation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentTool={currentTool} setTool={setCurrentTool}>
      {renderContent()}
    </Layout>
  );
};

export default App;