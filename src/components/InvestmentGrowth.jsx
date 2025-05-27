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

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }
`;

const Highlight = styled.div`
  background: #f0f7f0;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #4caf5040;
`;

const KeyMetric = styled.div`
  text-align: center;
  padding: 20px;
  flex: 1;
  min-width: 200px;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
    min-width: 100%;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .value {
    font-size: 24px;
    font-weight: 600;
    color: #2e7d32;
    margin: 8px 0;
    
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
`;

const TabGroup = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TimeframeTab = styled.button`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#2e7d32' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#2e7d32' : '#f5f5f5'};
  }
`;

const InvestmentGrowth = ({ annualSavings }) => {
  const [projections, setProjections] = useState([]);
  const [returnRate, setReturnRate] = useState('moderate');
  const [timeframe, setTimeframe] = useState(30); // years to show
  
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

      growth.push({
        year,
        totalContributed,
        balance: Math.round(balance),
        earnings: Math.round(balance - totalContributed)
      });
    }

    setProjections(growth);
  };

  return (
    <Section>
      <SectionTitle>
        <CategoryIcon>📈</CategoryIcon>
        <h2>See Your Money Grow</h2>
      </SectionTitle>
      
      <InfoText>
        Let's see how investing your savings of ${annualSavings.toLocaleString()} each year 
        could help build your wealth over time.
      </InfoText>

      <Card>
        <Highlight>
          <h3>🎯 Your Investment Strategy</h3>
          <ReturnSelector>
            <Label>Choose your investment approach:</Label>
            <Select value={returnRate} onChange={(e) => setReturnRate(e.target.value)}>
              <option value="conservative">Conservative - Safer, slower growth (6%)</option>
              <option value="moderate">Moderate - Balanced growth (9%)</option>
              <option value="aggressive">Aggressive - Higher risk & potential (12%)</option>
            </Select>
          </ReturnSelector>
          <InfoText small>
            💡 Conservative = More bonds (safer), Aggressive = More stocks (more growth potential)
          </InfoText>
        </Highlight>

        <TabGroup>
          <TimeframeTab 
            active={timeframe === 10} 
            onClick={() => setTimeframe(10)}
          >
            10 Years
          </TimeframeTab>
          <TimeframeTab 
            active={timeframe === 20} 
            onClick={() => setTimeframe(20)}
          >
            20 Years
          </TimeframeTab>
          <TimeframeTab 
            active={timeframe === 30} 
            onClick={() => setTimeframe(30)}
          >
            30 Years
          </TimeframeTab>
        </TabGroup>

        {/* Show key metrics for the final year */}
        {projections.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            flexWrap: 'wrap',
            margin: '20px 0',
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '10px'
          }}>
            <KeyMetric>
              <div className="label">Total Contributed</div>
              <div className="value">
                ${projections[timeframe-1].totalContributed.toLocaleString()}
              </div>
            </KeyMetric>
            <KeyMetric>
              <div className="label">Investment Earnings</div>
              <div className="value">
                ${projections[timeframe-1].earnings.toLocaleString()}
              </div>
              <div style={{ color: '#4caf50', fontSize: '14px' }}>
                Money made from investing
              </div>
            </KeyMetric>
            <KeyMetric>
              <div className="label">Final Balance</div>
              <div className="value">
                ${projections[timeframe-1].balance.toLocaleString()}
              </div>
            </KeyMetric>
          </div>
        )}

        <MobileHelper>
          👉 Scroll to see detailed year-by-year growth
        </MobileHelper>

        <GrowthTable>
          <Table>
            <thead>
              <tr>
                <th>Year</th>
                <th>You've Contributed</th>
                <th>Account Balance</th>
                <th>Money Made</th>
              </tr>
            </thead>
            <tbody>
              {projections.slice(0, timeframe).map((row) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>${row.totalContributed.toLocaleString()}</td>
                  <td>${row.balance.toLocaleString()}</td>
                  <td>${row.earnings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </GrowthTable>
      </Card>

      <InfoText small style={{ marginTop: '20px' }}>
        💡 This projection assumes you invest the same amount each year and shows average 
        expected returns. Actual investment returns will vary year to year.
      </InfoText>
    </Section>
  );
};

export default InvestmentGrowth; 