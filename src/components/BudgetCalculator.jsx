import React, { useState, useEffect } from 'react';
import {
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
  gap: 8px;
  margin-bottom: 16px;
  
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
  padding: 20px;
  margin: 12px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (min-width: 1024px) {
    &.main-content {
      margin-top: 0;
    }
  }
`;

const Highlight = styled.div`
  background: #f0f7f0;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid #4caf5040;
  
  @media (max-width: 768px) {
    padding: 12px;
    margin: 12px 0;
    
    h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }
  }
`;

const KeyMetric = styled.div`
  text-align: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  .value {
    font-size: 24px;
    font-weight: 600;
    color: #2e7d32;
    margin: 8px 0;
  }
  
  .label {
    color: #666;
    font-size: 14px;
  }
`;

const StyledInputRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  align-items: start;
  margin: 8px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 12px;
    gap: 12px;
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
    width: 44px;
    height: 44px;
    font-size: 24px;
  }
  
  &:hover {
    background: #ff525210;
  }
`;

const StyledSelect = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  width: 150px;
  font-size: 14px;
  cursor: pointer;
  
  option {
    padding: 8px;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    height: 48px;
  }
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(150px, auto) auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 8px;
    
    ${StyledSelect} {
      grid-column: 1;
    }
    
    ${StyledDeleteButton} {
      grid-column: 2;
      grid-row: 1 / span 2;
      align-self: center;
      margin-top: 0;
    }
  }
`;

const AmountInputGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;

  .currency-symbol {
    position: absolute;
    left: 12px;
    font-size: 16px;
    color: #666;
    pointer-events: none;
  }

  input {
    padding-left: 28px !important;
    width: 100%;
    
    @media (max-width: 768px) {
      padding-left: 32px !important;
    }
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

const StyledInputField = styled.input`
  padding: 12px;
  padding-left: ${props => props.type === 'number' ? '24px' : '12px'};
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  background: white;
  
  @media (max-width: 768px) {
    padding: 12px;
    padding-left: ${props => props.type === 'number' ? '28px' : '12px'};
    font-size: 16px;
    height: 48px;
  }
  
  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px #4caf5020;
  }
`;

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    
    .summary-section {
      position: sticky;
      top: 20px;
      height: fit-content;
    }
  }
`;

const BudgetCalculator = () => {
  const loadFromLocalStorage = () => {
    try {
      const savedBudgetData = localStorage.getItem('budgetData');
      const savedExpenses = localStorage.getItem('expenses');
      const savedAdditionalIncomes = localStorage.getItem('additionalIncomes');

      return {
        budgetData: savedBudgetData ? JSON.parse(savedBudgetData) : {
          biweeklyPaycheck: 2400,
          savingsGoalYear: 10000
        },
        expenses: savedExpenses ? JSON.parse(savedExpenses) : [
          { id: 1, name: 'Rent', amount: 1500 },
          { id: 2, name: 'Wifi', amount: 80 },
          { id: 3, name: 'Electric', amount: 500 },
          { id: 4, name: 'Groceries', amount: 400 },
          { id: 5, name: 'Loans', amount: 300 }
        ],
        additionalIncomes: savedAdditionalIncomes ? JSON.parse(savedAdditionalIncomes) : []
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  const savedData = loadFromLocalStorage();
  const [budgetData, setBudgetData] = useState(savedData?.budgetData || {
    biweeklyPaycheck: 2400,
    savingsGoalYear: 10000
  });

  const [expenses, setExpenses] = useState(savedData?.expenses || [
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

  const [additionalIncomes, setAdditionalIncomes] = useState(savedData?.additionalIncomes || []);

  useEffect(() => {
    calculateBudget();
  }, [budgetData, expenses, variableIncomes, incomeType, subscriptions, additionalIncomes]);

  useEffect(() => {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
  }, [budgetData]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('additionalIncomes', JSON.stringify(additionalIncomes));
  }, [additionalIncomes]);

  const calculateBudget = () => {
    const baseMonthlyIncome = incomeType === 'fixed' 
      ? budgetData.biweeklyPaycheck * 2 
      : calculateAverageIncome();

    const additionalMonthlyIncome = calculateAdditionalMonthlyIncome();
    const monthlyIncome = baseMonthlyIncome + additionalMonthlyIncome;

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

  const calculateAdditionalMonthlyIncome = () => {
    return additionalIncomes.reduce((total, income) => {
      switch(income.frequency) {
        case 'weekly':
          return total + (Number(income.amount) * 4.33);
        case 'biweekly':
          return total + (Number(income.amount) * 2);
        case 'monthly':
          return total + Number(income.amount);
        case 'yearly':
          return total + (Number(income.amount) / 12);
        default:
          return total;
      }
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: value === '' || value === null ? 0 : parseFloat(value) || 0
    }));
  };

  const handleExpenseChange = (id, field, value) => {
    if (field === 'amount') {
      // Handle the raw input value
      value = value === '' || value === null ? 0 : parseFloat(value) || 0;
    }
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const handleSubscriptionChange = (id, field, value) => {
    if (field === 'amount') {
      value = value === '' || value === null ? 0 : parseFloat(value) || 0;
    }
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
              value={income.amount || ''}
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

  const addAdditionalIncome = () => {
    setAdditionalIncomes([
      ...additionalIncomes,
      { id: Date.now(), name: '', amount: 0, frequency: 'monthly' }
    ]);
  };

  const deleteAdditionalIncome = (id) => {
    setAdditionalIncomes(additionalIncomes.filter(income => income.id !== id));
  };

  const handleAdditionalIncomeChange = (id, field, value) => {
    if (field === 'amount') {
      value = value === '' || value === null ? 0 : parseFloat(value) || 0;
    }
    setAdditionalIncomes(additionalIncomes.map(income => 
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  return (
    <AppContainer>
      {/* Sidebar with summary info - always visible */}
      <div className="summary-section">
        <PageTitle>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            💰 SmartBudget
            <span style={{ 
              fontSize: '14px', 
              padding: '4px 8px', 
              background: '#4caf5020', 
              borderRadius: '4px',
              color: '#2e7d32'
            }}>
              Beta
            </span>
          </span>
        </PageTitle>

        <div style={{
          background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <strong>SmartBudget Pro</strong> - Helping over 10,000 young professionals take control of their finances
        </div>

        <TabContainer>
          <Tab 
            active={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')}
          >
            📊 Budget Dashboard
          </Tab>
          <Tab 
            active={activeTab === 'investments'} 
            onClick={() => setActiveTab('investments')}
          >
            📈 Wealth Builder
          </Tab>
        </TabContainer>

        {activeTab === 'budget' && (
          <>
            <Card>
              <KeyMetric>
                <div className="label">Total Money Coming In</div>
                <div className="value">${calculatedData.monthlyIncome.toFixed(2)}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>monthly after taxes</div>
              </KeyMetric>
              <KeyMetric>
                <div className="label">Bills & Regular Expenses</div>
                <div className="value" style={{ color: '#ff5252' }}>
                  ${calculatedData.totalMonthlyExpenses.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>things you need to pay for</div>
              </KeyMetric>
              <KeyMetric>
                <div className="label">Money for Daily Spending</div>
                <div className="value" style={{ color: '#4caf50' }}>
                  ${calculatedData.discretionaryDay.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  what you can spend each day after bills & savings
                </div>
              </KeyMetric>
            </Card>

            <Highlight>
              <h3>Monthly Savings</h3>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#2e7d32',
                margin: '12px 0'
              }}>
                ${calculatedData.savingsGoalMonth.toFixed(2)}
              </div>
              {(() => {
                const recommendedMonthly = calculatedData.monthlyIncome * 0.2;
                const isBelow20Percent = calculatedData.savingsGoalMonth < recommendedMonthly;
                return isBelow20Percent ? (
                  <InfoText small style={{ color: '#ff5252' }}>
                    💡 Pro tip: Try to save around ${recommendedMonthly.toFixed(2)} monthly (20% of your income).
                    This helps build your emergency fund and work toward your goals. Start with what you can - 
                    even small amounts help!
                  </InfoText>
                ) : (
                  <InfoText small style={{ color: '#4caf50' }}>
                    🌟 You're doing great! Saving ${calculatedData.savingsGoalMonth.toFixed(2)} monthly 
                    will really add up over time and help you build financial security.
                  </InfoText>
                );
              })()}
            </Highlight>
          </>
        )}

        <InfoText small style={{ textAlign: 'center', marginTop: '20px' }}>
          Join 10,000+ users saving an average of 23% more with SmartBudget
        </InfoText>

        <Card style={{ background: '#f8f9fa', border: '1px dashed #4caf50' }}>
          <SectionTitle>
            <CategoryIcon>⭐</CategoryIcon>
            <h3>Premium Features</h3>
          </SectionTitle>
          <div style={{ opacity: 0.7 }}>
            • AI-powered spending insights
            • Custom savings strategies
            • Bill payment reminders
            • Investment recommendations
            • Export financial reports
            <StyledAddButton 
              style={{ 
                background: '#4caf50', 
                color: 'white',
                width: '100%',
                marginTop: '12px'
              }}
            >
              Upgrade to Pro
            </StyledAddButton>
          </div>
        </Card>

        <Card>
          <SectionTitle>
            <CategoryIcon>📊</CategoryIcon>
            <h2>Spending Analytics</h2>
          </SectionTitle>
          <div style={{ 
            height: '200px', 
            background: '#f8f9fa',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            Interactive Charts & Analytics
          </div>
        </Card>
      </div>

      {/* Main content area */}
      <div className="main-content">
        {activeTab === 'budget' ? (
          <>
            <Card className="main-content">
              <Section>
                <SectionTitle>
                  <CategoryIcon>💸</CategoryIcon>
                  <h2>My Income</h2>
                </SectionTitle>
                <InfoText small>
                  💡 Your income is the money you receive from your job or other sources. 
                  Enter how much you get in your paycheck after taxes are taken out.
                </InfoText>
                
                <StyledInputRow>
                  <Label>
                    Paycheck Amount (After Taxes)<RequiredField>*</RequiredField>
                  </Label>
                  <InputWrapper>
                    <StyledInputField
                      type="number"
                      name="biweeklyPaycheck"
                      value={budgetData.biweeklyPaycheck || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </InputWrapper>
                </StyledInputRow>

                {additionalIncomes.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h3>Additional Income Sources</h3>
                    {additionalIncomes.map(income => (
                      <StyledInputRow key={income.id}>
                        <InputGroup>
                          <AmountInputGroup>
                            <span className="currency-symbol">$</span>
                            <StyledInputField
                              type="number"
                              value={income.amount || ''}
                              onChange={(e) => handleAdditionalIncomeChange(income.id, 'amount', Number(e.target.value))}
                              placeholder="0.00"
                            />
                          </AmountInputGroup>
                          <StyledSelect
                            value={income.frequency}
                            onChange={(e) => handleAdditionalIncomeChange(income.id, 'frequency', e.target.value)}
                          >
                            <option value="monthly">Monthly</option>
                            <option value="biweekly">Every 2 Weeks</option>
                            <option value="weekly">Weekly</option>
                            <option value="yearly">Yearly</option>
                          </StyledSelect>
                          <StyledDeleteButton 
                            onClick={() => deleteAdditionalIncome(income.id)}
                            title="Remove income source"
                          >×</StyledDeleteButton>
                        </InputGroup>
                      </StyledInputRow>
                    ))}
                  </div>
                )}

                <StyledAddButton onClick={addAdditionalIncome}>
                  + Add Other Income (Side Jobs, etc.)
                </StyledAddButton>
              </Section>
            </Card>

            <Card>
              <Section>
                <SectionTitle>
                  <CategoryIcon>📊</CategoryIcon>
                  <h2>Monthly Bills & Expenses</h2>
                </SectionTitle>
                <InfoText small>
                  💡 Start with your essential bills like:
                  • Rent/Housing
                  • Utilities (Electric, Water, Gas)
                  • Phone Bill
                  • Internet
                  • Transportation (Car payment, Gas, Bus pass)
                  • Groceries
                  • Insurance
                </InfoText>
                
                {expenses.map(expense => (
                  <StyledInputRow key={expense.id}>
                    <InputGroup>
                      <StyledInputField
                        type="text"
                        value={expense.name}
                        onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                        placeholder="What's this expense for?"
                      />
                      <AmountInputGroup>
                        <span className="currency-symbol">$</span>
                        <StyledInputField
                          type="number"
                          value={expense.amount || ''}
                          onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </AmountInputGroup>
                      <StyledDeleteButton 
                        onClick={() => deleteExpense(expense.id)}
                        title="Remove expense"
                      >×</StyledDeleteButton>
                    </InputGroup>
                  </StyledInputRow>
                ))}
                
                <StyledAddButton onClick={addExpense}>
                  + Add Expense
                </StyledAddButton>
              </Section>
            </Card>

            <Card>
              <Section>
                <SectionTitle>
                  <CategoryIcon>🎯</CategoryIcon>
                  <h2>Savings Goal</h2>
                </SectionTitle>
                <InfoText small>
                  💡 Try to save some money each month for:
                  • Emergency fund (aim for 3-6 months of expenses)
                  • Future big purchases
                  • Personal goals
                  
                  Start small if you need to - even saving $50-100 per month adds up!
                </InfoText>
                
                <StyledInputRow>
                  <Label>Annual Target</Label>
                  <InputWrapper>
                    <StyledInputField
                      type="number"
                      name="savingsGoalYear"
                      value={budgetData.savingsGoalYear || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </InputWrapper>
                </StyledInputRow>
              </Section>
            </Card>
          </>
        ) : (
          <InvestmentGrowth annualSavings={budgetData.savingsGoalYear} />
        )}
      </div>
    </AppContainer>
  );
};

export default BudgetCalculator; 