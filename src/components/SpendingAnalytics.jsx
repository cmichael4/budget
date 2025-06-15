import React from 'react';
import styled from 'styled-components';

const AnalyticsContainer = styled.div`
  width: 100%;
`;

const InsightCard = styled.div`
  background: linear-gradient(135deg, #f9fafb 80%, #f3f7f4 100%);
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(44, 62, 80, 0.10);
  border: 1px solid #ececec;
  padding: 24px 18px 18px 18px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const RecommendationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 14px;
  color: #222;
`;

const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TipRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 1rem;
  color: #222;
  font-weight: 500;
`;

const TipIcon = styled.span`
  font-size: 1.15em;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5em;
  color: #219150;
`;

const Tip = styled.div`
  color: #444;
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.6;
  .icon {
    font-size: 1.25em;
    margin-top: 2px;
    color: #219150;
    flex-shrink: 0;
    width: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TipsRow = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 2px;
  margin-bottom: 2px;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const TipCard = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.08);
  border-left: 6px solid ${props => props.$accent || '#2196f3'};
  padding: 18px 18px 16px 16px;
  min-width: 240px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const TipIconLarge = styled.span`
  font-size: 1.6em;
  margin-bottom: 2px;
  color: ${props => props.$accent || '#2196f3'};
`;

const TipText = styled.div`
  font-size: 1.08rem;
  color: #222;
  font-weight: 500;
  line-height: 1.5;
  b {
    font-weight: 800;
    color: #1976d2;
  }
`;

const StatusIcon = styled.span`
  font-size: 1.2em;
  margin-left: 4px;
`;

const SpendingAnalytics = ({ expenses, monthlyIncome }) => {
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  // Calculate various metrics
  const expenseToIncomeRatio = (totalExpenses / monthlyIncome) * 100;
  const hasHighExpenses = expenseToIncomeRatio > 70;
  const recommendedEmergencyFund = totalExpenses * 6;
  const recommendedSavings = monthlyIncome * 0.2;
  // Color logic
  const accentGood = '#4caf50';
  const accentWarn = '#ffb300';
  const accentInfo = '#1976d2';

  return (
    <AnalyticsContainer>
      <TipsRow>
        <TipCard $accent={hasHighExpenses ? accentWarn : accentGood}>
          <TipIconLarge $accent={hasHighExpenses ? accentWarn : accentGood}>
            {hasHighExpenses ? '⚠️' : '✅'}
          </TipIconLarge>
          <TipText>
            {hasHighExpenses ? (
              <>Your expenses are <b>using {expenseToIncomeRatio.toFixed(1)}%</b> of your income.<br/>Try to reduce this to under <b>70%</b>.</>
            ) : (
              <>Great job! Your expenses are only <b>{expenseToIncomeRatio.toFixed(1)}%</b> of your income.</>
            )}
          </TipText>
        </TipCard>
        <TipCard $accent={accentInfo}>
          <TipIconLarge $accent={accentInfo}>🎯</TipIconLarge>
          <TipText>
            Try to save at least <b>${recommendedSavings.toFixed(2)}/month</b> (20% of income) for your goals.
          </TipText>
        </TipCard>
        <TipCard $accent={accentInfo}>
          <TipIconLarge $accent={accentInfo}>🏦</TipIconLarge>
          <TipText>
            Build an emergency fund of <b>${recommendedEmergencyFund.toFixed(2)}</b> (6 months of expenses).
          </TipText>
        </TipCard>
      </TipsRow>
    </AnalyticsContainer>
  );
};

export default SpendingAnalytics; 