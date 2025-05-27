import React, { useState, useEffect } from 'react';
import {
  Container,
  BudgetTable,
  InputRow,
  CalculatedRow,
  Label,
  Value,
  InputField,
  Section,
  DeleteButton,
  AddButton,
  InfoText,
  Tooltip,
  Summary,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  Grid,
  InputWrapper,
  PageTitle,
  CategoryIcon,
  SectionTitle,
  RequiredField,
  HelpText,
} from './BudgetStyles';
import InvestmentGrowth from './InvestmentGrowth';
import styled from 'styled-components';

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? '#2e7d32' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#2e7d32' : '#e0e0e0'};
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
  
  .label {
    color: #666;
    font-size: 16px;
  }
`;

const StyledInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
  }
`;

const StyledSelect = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  margin-left: 10px;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
  }
`;

const StyledAddButton = styled.button`
  background: none;
  border: 2px solid #4caf50;
  color: #4caf50;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  margin: 20px 0;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
  
  &:hover {
    background: #4caf5010;
  }
`;

const StyledDeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff5252;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    align-self: flex-end;
    margin-top: -40px;
  }
  
  &:hover {
    background: #ff525210;
  }
`;

const StyledInputField = styled.input`
  padding: 12px;
  padding-left: ${props => props.type === 'number' ? '24px' : '12px'};
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  background: white;
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
  
  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px #4caf5020;
  }
`;

const BudgetCalculator = () => {
  const [budgetData, setBudgetData] = useState({
    biweeklyPaycheck: 2400,
    savingsGoalYear: 10000
  });

  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Rent', amount: 1500 },
    { id: 2, name: 'Wifi', amount: 80 },
    { id: 3, name: 'Electric', amount: 500 },
    { id: 4, name: 'Groceries', amount: 400 },
    { id: 5, name: 'Loans', amount: 300 }
  ]);

  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Netflix', amount: 15 },
    { id: 2, name: 'Spotify', amount: 10 }
  ]);

  const [calculatedData, setCalculatedData] = useState({
    monthlyIncome: 0,
    totalMonthlyExpenses: 0,
    incomeAfterExpenses: 0,
    savingsGoalMonth: 0,
    discretionaryMonth: 0,
    discretionaryDay: 0,
    discretionaryWeek: 0
  });

  const [incomeType, setIncomeType] = useState('fixed'); // 'fixed', 'variable'
  const [variableIncomes, setVariableIncomes] = useState([
    { id: 1, amount: 0, date: '' }
  ]);

  const [activeTab, setActiveTab] = useState('budget'); // Add this with other state

  useEffect(() => {
    calculateBudget();
  }, [budgetData, expenses, variableIncomes, incomeType, subscriptions]);

  const calculateBudget = () => {
    const monthlyIncome = incomeType === 'fixed' 
      ? budgetData.biweeklyPaycheck * 2 
      : calculateAverageIncome();

    const totalSubscriptions = subscriptions.reduce((total, sub) => 
      total + Number(sub.amount), 0
    );

    const totalMonthlyExpenses = expenses.reduce((total, expense) => 
      total + Number(expense.amount), 0
    ) + totalSubscriptions;

    const incomeAfterExpenses = monthlyIncome - totalMonthlyExpenses;
    const savingsGoalMonth = budgetData.savingsGoalYear / 12;
    const discretionaryMonth = incomeAfterExpenses - savingsGoalMonth;
    const discretionaryDay = discretionaryMonth / 30;
    const discretionaryWeek = discretionaryMonth / 4.33;

    setCalculatedData({
      monthlyIncome,
      totalMonthlyExpenses,
      incomeAfterExpenses,
      savingsGoalMonth,
      discretionaryMonth,
      discretionaryDay,
      discretionaryWeek
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleExpenseChange = (id, field, value) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleSubscriptionChange = (id, field, value) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const addExpense = () => {
    const newId = Math.max(...expenses.map(e => e.id), 0) + 1;
    setExpenses(prev => [...prev, { id: newId, name: 'New Expense', amount: 0 }]);
  };

  const addSubscription = () => {
    const newId = Math.max(...subscriptions.map(s => s.id), 0) + 1;
    setSubscriptions(prev => [...prev, { id: newId, name: 'New Subscription', amount: 0 }]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const VariableIncomeSection = () => (
    <div>
      <InfoText>
        Enter your recent after-tax income amounts to calculate your average monthly income.
        We recommend entering at least 3 months of data for accuracy.
      </InfoText>
      {variableIncomes.map((income, index) => (
        <StyledInputRow key={income.id}>
          <StyledInputField
            type="month"
            value={income.date}
            onChange={(e) => handleVariableIncomeChange(income.id, 'date', e.target.value)}
            style={{ width: '150px', marginRight: '10px' }}
          />
          <InputWrapper>
            <StyledInputField
              type="number"
              value={income.amount}
              onChange={(e) => handleVariableIncomeChange(income.id, 'amount', Number(e.target.value))}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </InputWrapper>
          {index > 0 && (
            <StyledDeleteButton 
              onClick={() => removeVariableIncome(income.id)}
              title="Remove income entry"
            >×</StyledDeleteButton>
          )}
        </StyledInputRow>
      ))}
      <StyledAddButton onClick={addVariableIncome}>+ Add Another Month</StyledAddButton>
      
      <CalculatedRow highlight>
        <Label>Average Monthly Income:</Label>
        <Value>${calculateAverageIncome().toFixed(2)}</Value>
      </CalculatedRow>
      <InfoText small>
        💡 Tip: Your budget will be based on your average monthly income. 
        Consider budgeting based on your lower-earning months for safety.
      </InfoText>
    </div>
  );

  const handleVariableIncomeChange = (id, field, value) => {
    setVariableIncomes(prev => prev.map(income => 
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  const addVariableIncome = () => {
    const newId = Math.max(...variableIncomes.map(i => i.id), 0) + 1;
    setVariableIncomes(prev => [...prev, { id: newId, amount: 0, date: '' }]);
  };

  const removeVariableIncome = (id) => {
    setVariableIncomes(prev => prev.filter(income => income.id !== id));
  };

  const calculateAverageIncome = () => {
    const validIncomes = variableIncomes.filter(income => 
      income.amount > 0 && income.date !== ''
    );
    
    if (validIncomes.length === 0) return 0;
    
    const total = validIncomes.reduce((sum, income) => 
      sum + Number(income.amount), 0
    );
    
    return total / validIncomes.length;
  };

  return (
    <Container>
      <PageTitle>💰 Smart Budget Planner</PageTitle>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'budget'} 
          onClick={() => setActiveTab('budget')}
        >
          <CategoryIcon>📊</CategoryIcon> Budget
        </Tab>
        <Tab 
          active={activeTab === 'investments'} 
          onClick={() => setActiveTab('investments')}
        >
          <CategoryIcon>📈</CategoryIcon> Investment Growth
        </Tab>
      </TabContainer>

      {activeTab === 'budget' ? (
        <>
          <InfoText>
            Quick start: Enter your income, set a savings goal, and track your expenses.
          </InfoText>

          <Card>
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
                <div className="label">Daily Budget</div>
                <div className="value">
                  ${calculatedData.discretionaryDay.toFixed(2)}
                </div>
                <div style={{ color: '#4caf50', fontSize: '14px' }}>
                  Available to spend today
                </div>
              </KeyMetric>
              <KeyMetric>
                <div className="label">Weekly Budget</div>
                <div className="value">
                  ${calculatedData.discretionaryWeek.toFixed(2)}
                </div>
              </KeyMetric>
              <KeyMetric>
                <div className="label">Monthly Savings</div>
                <div className="value">
                  ${calculatedData.savingsGoalMonth.toFixed(2)}
                </div>
              </KeyMetric>
            </div>

            <Highlight>
              <h3>💰 Money Breakdown</h3>
              <div style={{ 
                display: 'grid', 
                gap: '12px',
                margin: '15px 0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Essential Expenses</span>
                  <strong>{((calculatedData.totalMonthlyExpenses / calculatedData.monthlyIncome) * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Savings</span>
                  <strong>{((calculatedData.savingsGoalMonth / calculatedData.monthlyIncome) * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Discretionary</span>
                  <strong>{((calculatedData.discretionaryMonth / calculatedData.monthlyIncome) * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </Highlight>

            <Card>
              <Section>
                <SectionTitle>
                  <CategoryIcon>💸</CategoryIcon>
                  <h2>Income</h2>
                </SectionTitle>
                <Tooltip>
                  Select your income type and enter your earnings
                </Tooltip>
                
                <div style={{ marginBottom: '20px' }}>
                  <Label>Income Type:</Label>
                  <StyledSelect 
                    value={incomeType}
                    onChange={(e) => setIncomeType(e.target.value)}
                  >
                    <option value="fixed">Fixed (Regular Paycheck)</option>
                    <option value="variable">Variable (Irregular Income)</option>
                  </StyledSelect>
                </div>

                {incomeType === 'fixed' ? (
                  <>
                    <StyledInputRow>
                      <Label>
                        Biweekly Paycheck (After Tax)<RequiredField>*</RequiredField>
                      </Label>
                      <InputWrapper>
                        <StyledInputField
                          type="number"
                          name="biweeklyPaycheck"
                          value={budgetData.biweeklyPaycheck}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </InputWrapper>
                    </StyledInputRow>
                    <HelpText>Enter the amount you receive every two weeks after taxes and deductions</HelpText>
                  </>
                ) : (
                  <VariableIncomeSection />
                )}
              </Section>
            </Card>

            <Card>
              <Section>
                <SectionTitle>
                  <CategoryIcon>🎯</CategoryIcon>
                  <h2>Savings Goal</h2>
                </SectionTitle>
                <Tooltip>
                  Setting aside money for savings is important for your financial health.
                </Tooltip>
                <StyledInputRow>
                  <Label>
                    Annual Savings Goal<RequiredField>*</RequiredField>
                  </Label>
                  <InputWrapper>
                    <StyledInputField
                      type="number"
                      name="savingsGoalYear"
                      value={budgetData.savingsGoalYear}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </InputWrapper>
                </StyledInputRow>
                <CalculatedRow>
                  <Label>Monthly Savings Target:</Label>
                  <Value>${calculatedData.savingsGoalMonth.toFixed(2)}</Value>
                </CalculatedRow>
                <InfoText small>
                  {(() => {
                    const recommendedMonthly = calculatedData.monthlyIncome * 0.2;
                    const currentPercentage = (calculatedData.savingsGoalMonth / calculatedData.monthlyIncome) * 100;
                    const isBelow20Percent = calculatedData.savingsGoalMonth < recommendedMonthly;

                    return (
                      <>
                        💡 Recommended savings (20% of income): ${recommendedMonthly.toFixed(2)}/month
                        <br />
                        <span style={{ 
                          color: isBelow20Percent ? '#ff5252' : '#4caf50',
                          fontWeight: '500',
                          marginTop: '4px',
                          display: 'inline-block'
                        }}>
                          You're currently saving {currentPercentage.toFixed(1)}% of your income
                          {isBelow20Percent ? ' (Consider increasing your savings)' : ' 👍'}
                        </span>
                      </>
                    );
                  })()}
                </InfoText>
              </Section>
            </Card>

            <Card>
              <Section>
                <SectionTitle>
                  <CategoryIcon>📊</CategoryIcon>
                  <h2>Monthly Expenses</h2>
                </SectionTitle>
                {expenses.map(expense => (
                  <StyledInputRow key={expense.id}>
                    <div style={{ width: '100%' }}>
                      <StyledInputField
                        type="text"
                        value={expense.name}
                        onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                        placeholder="Expense name"
                      />
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <InputWrapper style={{ flex: 1 }}>
                          <StyledInputField
                            type="number"
                            value={expense.amount}
                            onChange={(e) => handleExpenseChange(expense.id, 'amount', Number(e.target.value))}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </InputWrapper>
                        <StyledDeleteButton 
                          onClick={() => deleteExpense(expense.id)} 
                          title="Remove expense"
                        >×</StyledDeleteButton>
                      </div>
                    </div>
                  </StyledInputRow>
                ))}
                <StyledAddButton onClick={addExpense}>+ Add Another Expense</StyledAddButton>
                
                <SectionTitle>
                  <CategoryIcon>🔄</CategoryIcon>
                  <h3>Subscriptions</h3>
                </SectionTitle>
                {subscriptions.map(sub => (
                  <StyledInputRow key={sub.id} style={{ flexWrap: 'wrap', gap: '10px' }}>
                    <StyledInputField
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleSubscriptionChange(sub.id, 'name', e.target.value)}
                      style={{ 
                        width: '100%',
                        maxWidth: '200px',
                        marginBottom: '5px'
                      }}
                      placeholder="Subscription name"
                    />
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      flex: 1,
                      minWidth: '150px'
                    }}>
                      <InputWrapper style={{ width: '100%' }}>
                        <StyledInputField
                          type="number"
                          value={sub.amount}
                          onChange={(e) => handleSubscriptionChange(sub.id, 'amount', Number(e.target.value))}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </InputWrapper>
                      <StyledDeleteButton 
                        onClick={() => deleteSubscription(sub.id)} 
                        title="Remove subscription"
                        style={{ marginLeft: '10px' }}
                      >×</StyledDeleteButton>
                    </div>
                  </StyledInputRow>
                ))}
                <StyledAddButton onClick={addSubscription}>+ Add Subscription</StyledAddButton>
                <InfoText small>
                  💡 Common subscriptions: Streaming services (Netflix, Spotify), 
                  Cloud Storage, Gaming Services, News Subscriptions, Gym Memberships
                </InfoText>

                <CalculatedRow>
                  <Label>Total monthly recurring expenses:</Label>
                  <Value>${calculatedData.totalMonthlyExpenses.toFixed(2)}</Value>
                </CalculatedRow>
                <CalculatedRow>
                  <Label>Money left after expenses:</Label>
                  <Value>${calculatedData.incomeAfterExpenses.toFixed(2)}</Value>
                </CalculatedRow>
              </Section>
            </Card>
          </Card>
        </>
      ) : (
        <InvestmentGrowth annualSavings={budgetData.savingsGoalYear} />
      )}
    </Container>
  );
};

export default BudgetCalculator; 