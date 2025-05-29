import React, { useEffect } from 'react';
import BudgetCalculator from './components/BudgetCalculator';
import { createGlobalStyle } from 'styled-components';
import { initGA, trackPageView } from './services/analytics';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f5f5;
  }
`;

function App() {
  useEffect(() => {
    // Initialize GA
    initGA();
    
    // Track initial page view
    trackPageView(window.location.pathname);
    
    // Track subsequent page views
    const handleRouteChange = () => {
      trackPageView(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <BudgetCalculator />
    </div>
  );
}

export default App; 