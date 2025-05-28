import React from 'react';
import styled from 'styled-components';

const AnalyticsContainer = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InsightCard = styled.div`
  border-left: 4px solid ${props => props.$alert ? '#ff9800' : '#4caf50'};
  padding: 16px;
  font-size: 14px;
`;

const RecommendationList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Tip = styled.div`
  color: #666;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  .icon {
    flex-shrink: 0;
  }
`;

const SpendingAnalytics = ({ expenses, monthlyIncome }) => {
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  // Calculate various metrics
  const expenseToIncomeRatio = (totalExpenses / monthlyIncome) * 100;
  const hasHighExpenses = expenseToIncomeRatio > 70;
  const recommendedEmergencyFund = totalExpenses * 6;
  const recommendedSavings = monthlyIncome * 0.2;

  return (
    <AnalyticsContainer>
      <InsightCard $alert={hasHighExpenses}>
        <strong>
          {hasHighExpenses ? '⚠️ Budget Recommendations' : '💡 Budget Tips'}
        </strong>
        <RecommendationList>
          <Tip>
            <span className="icon">💰</span>
            <div>
              Your expenses are using {expenseToIncomeRatio.toFixed(1)}% of your income. 
              {expenseToIncomeRatio > 70 ? ' Try to reduce this to under 70%.' : ' Great job keeping expenses manageable!'}
            </div>
          </Tip>
          
          <Tip>
            <span className="icon">🎯</span>
            <div>
              Aim to save ${recommendedSavings.toFixed(2)}/month (20% of income) for future goals
              and emergencies.
            </div>
          </Tip>
          
          <Tip>
            <span className="icon">🏦</span>
            <div>
              Build an emergency fund of ${recommendedEmergencyFund.toFixed(2)} 
              (6 months of expenses) for financial security.
            </div>
          </Tip>
          
          {monthlyIncome > 0 && (
            <Tip>
              <span className="icon">📊</span>
              <div>
                Monthly budget targets:<br />
                • Essentials: up to ${(monthlyIncome * 0.5).toFixed(2)} (50%)<br />
                • Wants: up to ${(monthlyIncome * 0.3).toFixed(2)} (30%)<br />
                • Savings: at least ${(monthlyIncome * 0.2).toFixed(2)} (20%)
              </div>
            </Tip>
          )}
        </RecommendationList>
      </InsightCard>
    </AnalyticsContainer>
  );
};

export default SpendingAnalytics; 