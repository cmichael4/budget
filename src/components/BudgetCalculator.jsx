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
        <InputRow key={income.id}>
          <InputField
            type="month"
            value={income.date}
            onChange={(e) => handleVariableIncomeChange(income.id, 'date', e.target.value)}
            style={{ width: '150px', marginRight: '10px' }}
          />
          <InputWrapper>
            <InputField
              type="number"
              value={income.amount}
              onChange={(e) => handleVariableIncomeChange(income.id, 'amount', Number(e.target.value))}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </InputWrapper>
          {index > 0 && (
            <DeleteButton 
              onClick={() => removeVariableIncome(income.id)}
              title="Remove income entry"
            >×</DeleteButton>
          )}
        </InputRow>
      ))}
      <AddButton onClick={addVariableIncome}>+ Add Another Month</AddButton>
      
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
      <InfoText>
        Quick start: Enter your after-tax paycheck, set a savings goal, and add your monthly expenses below.
      </InfoText>

      <Summary>
        <SummaryRow>
          <SummaryLabel>
            <CategoryIcon>💵</CategoryIcon>
            Daily Spending Budget:
          </SummaryLabel>
          <SummaryValue>${calculatedData.discretionaryDay.toFixed(2)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>
            <CategoryIcon>💰</CategoryIcon>
            Monthly Savings Target:
          </SummaryLabel>
          <SummaryValue>${calculatedData.savingsGoalMonth.toFixed(2)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Monthly Income:</SummaryLabel>
          <SummaryValue>${calculatedData.monthlyIncome.toFixed(2)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Monthly Expenses:</SummaryLabel>
          <SummaryValue>${calculatedData.totalMonthlyExpenses.toFixed(2)}</SummaryValue>
        </SummaryRow>
        <InfoText small style={{ color: 'white', margin: '10px 0 0 0' }}>
          💡 Your daily budget is what you can spend on discretionary items after saving ${calculatedData.savingsGoalMonth.toFixed(2)}/month
        </InfoText>
      </Summary>

      <Grid>
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
            <select 
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value)}
              style={{ 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginLeft: '10px'
              }}
            >
              <option value="fixed">Fixed (Regular Paycheck)</option>
              <option value="variable">Variable (Irregular Income)</option>
            </select>
          </div>

          {incomeType === 'fixed' ? (
            <>
              <InputRow>
                <Label>
                  Biweekly Paycheck (After Tax)<RequiredField>*</RequiredField>
                </Label>
                <InputWrapper>
                  <InputField
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
              </InputRow>
              <HelpText>Enter the amount you receive every two weeks after taxes and deductions</HelpText>
            </>
          ) : (
            <VariableIncomeSection />
          )}
        </Section>

        <Section>
          <SectionTitle>
            <CategoryIcon>🎯</CategoryIcon>
            <h2>Savings Goal</h2>
          </SectionTitle>
          <Tooltip>
            Setting aside money for savings is important for your financial health.
          </Tooltip>
          <InputRow>
            <Label>
              Annual Savings Goal<RequiredField>*</RequiredField>
            </Label>
            <InputWrapper>
              <InputField
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
          </InputRow>
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
      </Grid>

      <BudgetTable>
        <Section>
          <SectionTitle>
            <CategoryIcon>📊</CategoryIcon>
            <h2>Monthly Expenses</h2>
          </SectionTitle>
          {expenses.map(expense => (
            <InputRow key={expense.id}>
              <InputField
                type="text"
                value={expense.name}
                onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                style={{ width: '150px', marginRight: '10px' }}
                placeholder="Expense name"
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InputWrapper>
                  <InputField
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleExpenseChange(expense.id, 'amount', Number(e.target.value))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </InputWrapper>
                <DeleteButton onClick={() => deleteExpense(expense.id)} title="Remove expense">×</DeleteButton>
              </div>
            </InputRow>
          ))}
          <AddButton onClick={addExpense}>+ Add Another Expense</AddButton>
          
          <SectionTitle>
            <CategoryIcon>🔄</CategoryIcon>
            <h3>Subscriptions</h3>
          </SectionTitle>
          {subscriptions.map(sub => (
            <InputRow key={sub.id}>
              <InputField
                type="text"
                value={sub.name}
                onChange={(e) => handleSubscriptionChange(sub.id, 'name', e.target.value)}
                style={{ width: '150px', marginRight: '10px' }}
                placeholder="Subscription name"
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InputWrapper>
                  <InputField
                    type="number"
                    value={sub.amount}
                    onChange={(e) => handleSubscriptionChange(sub.id, 'amount', Number(e.target.value))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </InputWrapper>
                <DeleteButton onClick={() => deleteSubscription(sub.id)} title="Remove subscription">×</DeleteButton>
              </div>
            </InputRow>
          ))}
          <AddButton onClick={addSubscription}>+ Add Subscription</AddButton>
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
      </BudgetTable>
    </Container>
  );
};

export default BudgetCalculator; 