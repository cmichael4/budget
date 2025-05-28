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
import { db, ref, onValue, set, runTransaction } from '../firebase';
import AdminDashboard from './AdminDashboard';
import BankLink from './BankLink';
import SpendingAnalytics from './SpendingAnalytics';

const TabContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`;

const Tab = styled.button`
  padding: 12px 8px;
  border: none;
  background: ${props => props.$active ? '#2e7d32' : '#f5f5f5'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 48px;

  @media (min-width: 768px) {
    padding: 12px;
    font-size: 14px;
  }

  &:hover {
    background: ${props => props.$active ? '#2e7d32' : '#e0e0e0'};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (min-width: 768px) {
    padding: 20px;
    margin: 12px 0;
  }
`;

const Highlight = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  
  h3 {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
  
  .amount {
    font-size: 24px;
    font-weight: 600;
    color: #2e7d32;
    margin: 8px 0;
  }
  
  .sublabel {
    font-size: 12px;
    color: #666;
  }
`;

const KeyMetric = styled.div`
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  
  .label {
    color: #666;
    font-size: 14px;
  }
  
  .value {
    font-size: 24px;
    font-weight: 600;
    color: #2e7d32;
    margin: 8px 0;
  }
  
  .sublabel {
    font-size: 12px;
    color: #666;
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 1024px) {
    padding: 24px;
    flex-direction: row;
    align-items: flex-start;
    
    .sidebar {
      width: 320px;
      flex-shrink: 0;
      position: sticky;
      top: 20px;
    }
    
    .main-content {
      flex: 1;
      margin-left: 24px;
    }
  }

  @media (max-width: 1023px) {
    .sidebar {
      margin-bottom: 20px;
    }
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoText = styled.p`
  color: #666;
  margin: 8px 0;
  font-size: ${props => props.$small ? '14px' : '16px'};
  text-align: ${props => props.$center ? 'center' : 'left'};
  margin-top: ${props => props.$marginTop ? props.$marginTop : '0'};
`;

const Progress = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
`;

const TipBanner = styled.div`
  background: ${props => props.$type === 'success' ? '#e8f5e9' : props.$type === 'warning' ? '#fff3e0' : '#e3f2fd'};
  border-left: 4px solid ${props => props.$type === 'success' ? '#4caf50' : props.$type === 'warning' ? '#ff9800' : '#2196f3'};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  
  .title {
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
  }
  
  .content {
    color: #666;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 14px;
    
    .title {
      font-size: 14px;
    }
    
    .content {
      font-size: 13px;
    }
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$primary ? '#4caf50' : 'transparent'};
  color: ${props => props.$primary ? 'white' : '#4caf50'};
  border: ${props => props.$primary ? 'none' : '1px solid #4caf50'};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
`;

const TABS = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'budget', icon: '💰', label: 'Budget' },
  { id: 'insights', icon: '💡', label: 'Insights' },
  { id: 'admin', icon: '⚙️', label: 'Admin', requiresAuth: true }
];

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

  const [activeTab, setActiveTab] = useState('overview');

  const [additionalIncomes, setAdditionalIncomes] = useState(savedData?.additionalIncomes || []);

  const [viewCount, setViewCount] = useState(0);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [bankTransactions, setBankTransactions] = useState([]);

  const [userProgress, setUserProgress] = useState({
    hasEnteredIncome: false,
    hasAddedExpense: false,
    hasViewedInsights: false
  });

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

  useEffect(() => {
    try {
      console.log("Firebase DB object:", db);
      if (!db) {
        console.log("Firebase DB not initialized");
        return;
      }
      
      console.log("Starting analytics tracking");
      const viewsRef = ref(db, 'pageViews');
      console.log("Views ref:", viewsRef);
      
      // Initialize analytics data if it doesn't exist
      onValue(viewsRef, (snapshot) => {
        if (!snapshot.exists()) {
          console.log("Initializing pageViews data");
          set(viewsRef, 0).then(() => {
            console.log("PageViews data initialized");
          }).catch(error => {
            console.error("Error initializing pageViews:", error);
          });
        }
      }, { onlyOnce: true });

      // First get current view count
      onValue(viewsRef, (snapshot) => {
        const currentViews = snapshot.val();
        console.log("Current views from Firebase:", currentViews);
        setViewCount(currentViews || 0);
      });

      // Check if we should count this visit
      const sessionKey = 'viewCounted';
      if (sessionStorage.getItem(sessionKey)) {
        console.log("Already counted this session");
        return;
      }

      console.log("Incrementing view count...");
      // Increment view count
      runTransaction(viewsRef, (currentViews) => {
        console.log("Transaction current value:", currentViews);
        return (currentViews || 0) + 1;
      }).then(() => {
        console.log("View count incremented successfully");
        
        // Save visit data
        const visitData = {
          timestamp: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          userAgent: navigator.userAgent,
          screenSize: {
            width: window.screen.width,
            height: window.screen.height
          },
          referrer: document.referrer || 'direct',
          path: window.location.pathname
        };

        console.log("Fetching location data...");
        // Get location data
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(locationData => {
            console.log("Location data received:", locationData);
            const visitId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const fullVisitData = {
              ...visitData,
              location: {
                city: locationData.city,
                region: locationData.region,
                country: locationData.country,
                ip: locationData.ip
              }
            };

            console.log("Saving visit data:", fullVisitData);
            set(ref(db, `analytics/visits/${visitId}`), fullVisitData)
              .then(() => {
                console.log("Visit data saved successfully");
                sessionStorage.setItem(sessionKey, 'true');
              })
              .catch(error => {
                console.error("Error saving visit data:", error);
              });
          })
          .catch((error) => {
            console.error("Error getting location:", error);
            // Save visit without location data
            const visitId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log("Saving visit without location data");
            set(ref(db, `analytics/visits/${visitId}`), visitData)
              .then(() => {
                console.log("Basic visit data saved successfully");
                sessionStorage.setItem(sessionKey, 'true');
              })
              .catch(error => {
                console.error("Error saving basic visit data:", error);
              });
          });
      }).catch(error => {
        console.error("Error in view count transaction:", error);
      });

    } catch (error) {
      console.error("Error in analytics setup:", error, error.stack);
    }
  }, []);

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
      <InfoText $small>
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

  const handleAdminAuth = () => {
    const password = prompt("Enter admin password:");
    if (password === 'c0urtney') {
      setIsAdminAuthenticated(true);
      setActiveTab('admin');
    } else {
      alert('Incorrect password');
      setActiveTab('overview');
    }
  };

  const handleAccountsLinked = ({ accounts, transactions }) => {
    setLinkedAccounts(accounts);
    setBankTransactions(transactions);
    
    // Update expenses based on transactions
    const newExpenses = transactions.flat().map(transaction => ({
      id: transaction.id,
      name: transaction.description,
      amount: Math.abs(transaction.amount),
      date: transaction.date,
      category: transaction.category
    }));
    
    setExpenses(newExpenses);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {!userProgress.hasEnteredIncome && (
              <TipBanner>
                <div className="title">
                  👋 Welcome to SmartBudget!
                </div>
                <div className="content">
                  Let's start by entering your income and expenses to get a clear picture of your finances.
                  This will help us provide personalized recommendations.
                  <br />
                  <ActionButton 
                    $primary 
                    onClick={() => setActiveTab('budget')}
                    style={{ marginTop: '12px' }}
                  >
                    Get Started →
                  </ActionButton>
                </div>
              </TipBanner>
            )}
            
            {userProgress.hasEnteredIncome && !userProgress.hasAddedExpense && (
              <TipBanner $type="success">
                <div className="title">
                  ✨ Great start with your income!
                </div>
                <div className="content">
                  Now let's track your monthly expenses to see where your money is going.
                </div>
              </TipBanner>
            )}

            <Card>
              <SectionTitle>
                <CategoryIcon>💰</CategoryIcon>
                <h2>Quick Budget Summary</h2>
              </SectionTitle>
              <MetricsGrid>
                <KeyMetric>
                  <div className="label">Monthly Income</div>
                  <div className="value">${calculatedData.monthlyIncome.toFixed(2)}</div>
                  <div className="sublabel">after taxes</div>
                </KeyMetric>
                <KeyMetric>
                  <div className="label">Monthly Expenses</div>
                  <div className="value" style={{ color: '#ff5252' }}>${calculatedData.totalMonthlyExpenses.toFixed(2)}</div>
                  <div className="sublabel">bills & necessities</div>
                </KeyMetric>
                <KeyMetric>
                  <div className="label">Available Daily Budget</div>
                  <div className="value" style={{ color: '#4caf50' }}>${calculatedData.discretionaryDay.toFixed(2)}</div>
                  <div className="sublabel">for flexible spending</div>
                </KeyMetric>
              </MetricsGrid>
            </Card>

            <Card>
              <SectionTitle>
                <CategoryIcon>📅</CategoryIcon>
                <h2>Spending Breakdown</h2>
              </SectionTitle>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '12px' 
              }}>
                <Highlight>
                  <h3>Weekly Budget</h3>
                  <div className="amount">${calculatedData.discretionaryWeek.toFixed(2)}</div>
                  <div className="sublabel">for discretionary spending</div>
                </Highlight>
                <Highlight>
                  <h3>Monthly Savings</h3>
                  <div className="amount">${calculatedData.savingsGoalMonth.toFixed(2)}</div>
                  <div className="sublabel">towards your goals</div>
                </Highlight>
                <Highlight>
                  <h3>Emergency Fund</h3>
                  <div className="amount">${(calculatedData.totalMonthlyExpenses * 6).toFixed(2)}</div>
                  <div className="sublabel">recommended 6-month buffer</div>
                </Highlight>
              </div>
            </Card>

            <BankLink onAccountsLinked={handleAccountsLinked} />
          </>
        );

      case 'budget':
        return (
          <>
            <TipBanner $type="info">
              <div className="title">
                💡 Quick Tips
              </div>
              <div className="content">
                • Enter your after-tax income for accurate calculations<br />
                • Don't forget recurring subscriptions and bills<br />
                • Include estimated variable expenses like groceries<br />
                • Consider seasonal expenses (divide annual costs by 12)
              </div>
            </TipBanner>

            {expenses.length >= 3 && !userProgress.hasViewedInsights && (
              <TipBanner $type="success">
                <div className="title">
                  🎯 Ready for Insights!
                </div>
                <div className="content">
                  You've added enough data for us to analyze your spending patterns
                  and provide personalized recommendations.
                  <br />
                  <ActionButton 
                    $primary 
                    onClick={() => setActiveTab('insights')}
                    style={{ marginTop: '12px' }}
                  >
                    View Insights →
                  </ActionButton>
                </div>
              </TipBanner>
            )}

            <Card>
              <Section>
                <SectionTitle>
                  <CategoryIcon>💸</CategoryIcon>
                  <h2>Income Sources</h2>
                </SectionTitle>
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
                {/* Additional income inputs */}
              </Section>
            </Card>

            <Card>
              <Section>
                <SectionTitle>
                  <CategoryIcon>💳</CategoryIcon>
                  <h2>Monthly Expenses</h2>
                </SectionTitle>
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
          </>
        );

      case 'insights':
        return (
          <>
            {!userProgress.hasViewedInsights && (
              <TipBanner $type="info">
                <div className="title">
                  📊 Understanding Your Analysis
                </div>
                <div className="content">
                  We analyze your spending patterns and compare them to recommended
                  financial guidelines. Look for opportunities to optimize your budget
                  and build long-term financial health.
                </div>
              </TipBanner>
            )}

            {calculatedData.savingsRate < 20 && (
              <TipBanner $type="warning">
                <div className="title">
                  💫 Boost Your Savings
                </div>
                <div className="content">
                  Your current savings rate is {calculatedData.savingsRate.toFixed(1)}%.
                  Try the 50/30/20 rule: 50% needs, 30% wants, and 20% savings.
                  Small changes can make a big difference!
                  <br />
                  <ActionButton 
                    onClick={() => setActiveTab('budget')}
                    style={{ marginTop: '12px' }}
                  >
                    Review Budget →
                  </ActionButton>
                </div>
              </TipBanner>
            )}

            <Card>
              <SectionTitle>
                <CategoryIcon>📊</CategoryIcon>
                <h2>Budget Analysis & Recommendations</h2>
              </SectionTitle>
              <SpendingAnalytics 
                expenses={expenses} 
                monthlyIncome={calculatedData.monthlyIncome} 
              />
            </Card>
          </>
        );

      case 'admin':
        return isAdminAuthenticated ? (
          <AdminDashboard />
        ) : (
          <Card>
            <Section>
              <h2>Access Denied</h2>
              <p>Please authenticate to view the admin dashboard.</p>
            </Section>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <AppContainer>
      {/* Sidebar */}
      <Sidebar className="sidebar">
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
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>SmartBudget Pro</strong> - Helping over 10,000 young professionals
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Views: {viewCount}
          </div>
        </div>

        <TabContainer>
          {TABS.map(tab => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => {
                if (tab.requiresAuth && !isAdminAuthenticated) {
                  handleAdminAuth();
                } else {
                  setActiveTab(tab.id);
                }
              }}
            >
              {tab.icon} {tab.label}
            </Tab>
          ))}
        </TabContainer>

        <Card style={{ background: '#f8f9fa', border: '1px dashed #4caf50' }}>
          <SectionTitle>
            <CategoryIcon>⭐</CategoryIcon>
            <h3>Premium Features</h3>
          </SectionTitle>
          <div style={{ opacity: 0.7 }}>
            • AI-powered insights<br />
            • Custom strategies<br />
            • Bill reminders<br />
            • Investment tools<br />
            • Export reports
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
      </Sidebar>

      {/* Main Content */}
      <MainContent className="main-content">
        <Progress>
          {activeTab === 'overview' && (
            <>
              <span>Step 1/3:</span> Overview
            </>
          )}
          {activeTab === 'budget' && (
            <>
              <span>Step 2/3:</span> Budget
            </>
          )}
          {activeTab === 'insights' && (
            <>
              <span>Step 3/3:</span> Insights
            </>
          )}
        </Progress>

        {renderContent()}
      </MainContent>
    </AppContainer>
  );
};

export default BudgetCalculator; 