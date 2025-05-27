import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, CategoryIcon, InfoText, Label } from './BudgetStyles';

const GrowthTable = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
    
    @media (max-width: 768px) {
      padding: 8px;
      
      &:first-child { // Year column
        position: sticky;
        left: 0;
        background: white;
        z-index: 1;
      }
    }
  }

  th {
    background: #f8f9fa;
    color: #2e7d32;
    font-weight: 600;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      &:first-child {
        position: sticky;
        left: 0;
        z-index: 2;
      }
    }
  }

  tr:hover {
    background: #f8f9fa;
    
    @media (max-width: 768px) {
      td:first-child {
        background: #f8f9fa;
      }
    }
  }
`;

const ReturnSelector = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MobileHelper = styled.div`
  display: none;
  color: #666;
  font-size: 14px;
  margin: 10px 0;
  font-style: italic;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const InvestmentGrowth = ({ annualSavings }) => {
  const [projections, setProjections] = useState([]);
  const [returnRate, setReturnRate] = useState('moderate');
  
  const returnRates = {
    conservative: 0.06, // 6%
    moderate: 0.09, // 9%
    aggressive: 0.12, // 12%
  };

  const annualReturn = returnRates[returnRate];
  const inflationRate = 0.03; // 3% average inflation
  const yearsToProject = 30;

  useEffect(() => {
    calculateGrowth();
  }, [annualSavings, returnRate]);

  const calculateGrowth = () => {
    const growth = [];
    let balance = 0;
    let totalContributed = 0;

    for (let year = 1; year <= yearsToProject; year++) {
      totalContributed += annualSavings;
      balance = (balance + annualSavings) * (1 + annualReturn);
      const realBalance = balance / Math.pow(1 + inflationRate, year);

      growth.push({
        year,
        totalContributed,
        balance: Math.round(balance),
        realBalance: Math.round(realBalance),
        earnings: Math.round(balance - totalContributed)
      });
    }

    setProjections(growth);
  };

  return (
    <Section>
      <SectionTitle>
        <CategoryIcon>📈</CategoryIcon>
        <h2>Investment Growth Projection</h2>
      </SectionTitle>
      
      <InfoText>
        See how your annual savings of ${annualSavings.toLocaleString()} could grow over time 
        when invested in a diversified portfolio.
      </InfoText>

      <ReturnSelector>
        <Label>Investment Style:</Label>
        <Select value={returnRate} onChange={(e) => setReturnRate(e.target.value)}>
          <option value="conservative">Conservative (6%)</option>
          <option value="moderate">Moderate (9%)</option>
          <option value="aggressive">Aggressive (12%)</option>
        </Select>
      </ReturnSelector>

      <MobileHelper>
        👉 Scroll horizontally to see more details
      </MobileHelper>

      <GrowthTable>
        <Table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Total Contributed</th>
              <th>Balance</th>
              <th>After Inflation</th>
              <th>Investment Earnings</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>${row.totalContributed.toLocaleString()}</td>
                <td>${row.balance.toLocaleString()}</td>
                <td>${row.realBalance.toLocaleString()}</td>
                <td>${row.earnings.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </GrowthTable>

      <InfoText small style={{ marginTop: '20px' }}>
        💡 Conservative portfolios typically have more bonds, while aggressive portfolios 
        have more stocks. Historical returns shown before inflation.
      </InfoText>
    </Section>
  );
};

export default InvestmentGrowth; 