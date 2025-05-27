import React from 'react';
import BudgetCalculator from './components/BudgetCalculator';
import { createGlobalStyle } from 'styled-components';

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
  return (
    <div className="App">
      <GlobalStyle />
      <BudgetCalculator />
    </div>
  );
}

export default App; 