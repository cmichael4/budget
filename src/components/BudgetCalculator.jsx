import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db, ref, onValue, set, runTransaction } from '../firebase';
import AdminDashboard from './AdminDashboard';
import SpendingAnalytics from './SpendingAnalytics';
import { trackCalculatorUsage, trackBudgetUpdate, trackFeatureUsage } from '../services/analytics';
import { 
  InputWrapper, 
  PageTitle, 
  CategoryIcon, 
  SectionTitle, 
  Label, 
  RequiredField,
  CalculatedRow,
  Value,
  Section
} from './BudgetStyles';
import InvestmentGrowth from './InvestmentGrowth';
import { FaDollarSign, FaChartLine, FaWallet, FaUserFriends, FaEye } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import GoogleSignIn from './GoogleSignIn';

const DashboardTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: -1px;
  color: #222;
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 18px;
`;

const Card = styled.div`
  background: linear-gradient(135deg, #f9fafb 80%, #f3f7f4 100%);
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(44, 62, 80, 0.10);
  padding: 12px 12px 12px 12px;
  margin: 4px 0;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  border: 1px solid #ececec;
`;

const MetricsGrid = styled.div`
  display: flex;
  gap: 6px;
  background: none;
  border-radius: 14px;
  overflow: visible;
  margin-top: 4px;
`;

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

const Highlight = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px 10px 16px 10px;
  box-shadow: 0 1px 2px rgba(44, 62, 80, 0.04);
  h3 {
    color: #666;
    font-size: 1.1rem;
    margin: 0 0 8px 0;
    font-weight: 600;
  }
  .amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2e7d32;
    margin: 8px 0;
  }
  .sublabel {
    font-size: 13px;
    color: #a0a0a0;
  }
`;

const KeyMetric = styled.div`
  flex: 1;
  padding: 8px 0 6px 0;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.07);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.15s, background 0.15s;
  &:hover {
    background: #f6f8fa;
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.12);
    z-index: 1;
  }
  .icon {
    font-size: 1.3rem;
    margin-bottom: 4px;
    color: #219150;
  }
  .label {
    color: #888;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 1px;
  }
  .value {
    font-size: 1.2rem;
    font-weight: 800;
    color: #222;
    margin: 3px 0 1px 0;
    letter-spacing: -1px;
  }
  .sublabel {
    font-size: 10px;
    color: #b0b0b0;
    font-weight: 400;
    margin-top: 0;
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
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
  padding-top: 0;
  @media (max-width: 700px) {
    padding: 0 4px;
    max-width: 100vw;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-right: 32px;
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

const GuidanceBanner = styled.div`
  background: #eaf4fd;
  border-left: 4px solid #2196f3;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 28px;
  font-size: 15px;
  box-shadow: 0 1px 4px rgba(33, 150, 243, 0.06);
  .title {
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    color: #1976d2;
  }
  .content {
    color: #4a4a4a;
    line-height: 1.7;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
`;

const NavButton = styled.button`
  background: ${props => props.$primary ? '#4caf50' : 'transparent'};
  color: ${props => props.$primary ? 'white' : '#4caf50'};
  border: ${props => props.$primary ? 'none' : '1px solid #4caf50'};
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const WelcomeBanner = styled.div`
  background: #fffde7;
  border-left: 4px solid #ffd600;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 28px;
  font-size: 16px;
  color: #795548;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(255, 214, 0, 0.06);
`;

const ValueProposition = styled.div`
  background: #e8f5e9;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
  
  h2 {
    color: #2e7d32;
    margin: 0 0 16px 0;
    font-size: 1.5rem;
    text-align: center;
  }
  
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .step {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    
    h3 {
      color: #2e7d32;
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }
  }
  
  .cta {
    text-align: center;
    margin-top: 20px;
  }
`;

const NoDataCallout = styled.div`
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 28px 24px;
  border-radius: 12px;
  margin: 32px 0;
  text-align: center;
  color: #a67c00;
  font-size: 18px;
  box-shadow: 0 1px 4px rgba(255, 152, 0, 0.06);
`;

const CTAButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 18px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #388e3c;
  }
`;

const SectionDescription = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 8px;
`;

const WhatsNextSection = styled.div`
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 28px 24px;
  border-radius: 12px;
  margin: 56px 0 0 0;
  font-size: 16px;
  color: #1565c0;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(33, 150, 243, 0.06);
  justify-content: space-between;
`;

const SectionSpacer = styled.div`
  height: 16px;
`;

const TractionBanner = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #e0ffe7 60%, #f0f4ff 100%);
  border-radius: 14px;
  padding: 18px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
  font-size: 1.1rem;
  font-weight: 600;
`;

const TestimonialCard = styled.section`
  background: #f6f8fa;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(44, 62, 80, 0.07);
  padding: 12px 16px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-top: 20px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(44,62,80,0.04);
  padding: 26px 20px 20px 20px;
  min-width: 0;
  width: 100%;
  min-height: 148px;
  height: 100%;
  box-sizing: border-box;
`;

const StatAmount = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${props => props.color || '#222'};
  line-height: 1.1;
  margin-bottom: 6px;
`;

const StatLabel = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 0;
`;

const StatSubtext = styled.div`
  font-size: 14px;
  color: #888;
  font-weight: 400;
  margin-top: auto;
  line-height: 1.3;
`;

const TABS = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'budget', icon: '💰', label: 'Budget' },
  { id: 'insights', icon: '💡', label: 'Insights' },
  { id: 'investments', icon: '📈', label: 'Investments' },
  { id: 'admin', icon: '⚙️', label: 'Admin', requiresAuth: true }
];

const EmptyState = ({ type, onAddExpense }) => {
  switch (type) {
    case 'expenses':
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '32px 16px',
          background: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ marginBottom: '8px' }}>No Expenses Added Yet</h3>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Start by adding your monthly expenses like rent, utilities, and groceries
          </p>
          <ActionButton $primary onClick={onAddExpense}>
            Add Your First Expense
          </ActionButton>
        </div>
      );
    
    case 'income':
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '32px 16px',
          background: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <h3 style={{ marginBottom: '8px' }}>Enter Your Income</h3>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Let's start by entering your after-tax monthly income
          </p>
        </div>
      );
    
    default:
      return null;
  }
};

const BudgetCalculator = () => {
  const loadFromLocalStorage = () => {
    try {
      const savedBudgetData = localStorage.getItem('budgetData');
      const savedExpenses = localStorage.getItem('expenses');
      const savedAdditionalIncomes = localStorage.getItem('additionalIncomes');

      return {
        budgetData: savedBudgetData ? JSON.parse(savedBudgetData) : {
          biweeklyPaycheck: '',
          savingsGoalYear: ''
        },
        expenses: savedExpenses ? JSON.parse(savedExpenses) : [],
        additionalIncomes: savedAdditionalIncomes ? JSON.parse(savedAdditionalIncomes) : []
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return {
        budgetData: {
          biweeklyPaycheck: '',
          savingsGoalYear: ''
        },
        expenses: [],
        additionalIncomes: []
      };
    }
  };

  const savedData = loadFromLocalStorage();
  const [budgetData, setBudgetData] = useState(savedData?.budgetData || {
    biweeklyPaycheck: '',
    savingsGoalYear: ''
  });

  const [expenses, setExpenses] = useState(savedData?.expenses || []);

  const [subscriptions, setSubscriptions] = useState([]);

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
  const [variableIncomes, setVariableIncomes] = useState([]);

  const [activeTab, setActiveTab] = useState('overview');

  const [additionalIncomes, setAdditionalIncomes] = useState(savedData?.additionalIncomes || []);

  const [viewCount, setViewCount] = useState(0);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [userProgress, setUserProgress] = useState({
    hasEnteredIncome: false,
    hasAddedExpense: false,
    hasViewedInsights: false
  });

  const [analyticsError, setAnalyticsError] = useState(null);

  const hasData = budgetData.biweeklyPaycheck !== '' && expenses.length > 0;
  const [showSummary, setShowSummary] = useState(hasData);
  useEffect(() => { setShowSummary(hasData); }, [hasData]);

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
        setAnalyticsError("Analytics not initialized");
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
            setAnalyticsError("Error initializing analytics");
          });
        }
      }, { onlyOnce: true });

      // First get current view count
      onValue(viewsRef, (snapshot) => {
        const currentViews = snapshot.val();
        console.log("Current views from Firebase:", currentViews);
        setViewCount(currentViews || 0);
      }, (error) => {
        console.error("Error reading view count:", error);
        setAnalyticsError("Error reading analytics");
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
                setAnalyticsError("Error saving visit data");
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
                setAnalyticsError("Error saving basic visit data");
              });
          });
      }).catch(error => {
        console.error("Error in view count transaction:", error);
        setAnalyticsError("Error incrementing view count");
      });

    } catch (error) {
      console.error("Error in analytics setup:", error, error.stack);
      setAnalyticsError("Error initializing analytics");
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
    trackCalculatorUsage('Budget Calculation', 'Calculate');
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
    trackCalculatorUsage('Input Change', name);
  };

  const handleExpenseChange = (id, field, value) => {
    if (field === 'amount') {
      // Handle the raw input value
      value = value === '' || value === null ? 0 : parseFloat(value) || 0;
    }
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
    trackBudgetUpdate('Expense Update', field);
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
    const newExpense = {
      id: Date.now(),
      category: '',
      amount: '',
      frequency: 'monthly'
    };
    setExpenses(prev => [...prev, newExpense]);
    trackFeatureUsage('Expense Management', 'Add Expense');
  };

  const addSubscription = () => {
    const newId = Math.max(...subscriptions.map(s => s.id), 0) + 1;
    setSubscriptions(prev => [...prev, { id: newId, name: 'New Subscription', amount: 0 }]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    trackFeatureUsage('Expense Management', 'Delete Expense');
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {!showSummary ? (
              <>
                <ValueProposition>
                  <h2>Smart Budget Planning Made Simple</h2>
                  <div className="steps">
                    <div className="step">
                      <h3>📝 Enter Your Income</h3>
                      <p>Start by entering your after-tax income to get accurate calculations for your spending power.</p>
                    </div>
                    <div className="step">
                      <h3>💸 Add Your Expenses</h3>
                      <p>List your regular monthly expenses and bills to understand your financial commitments.</p>
                    </div>
                    <div className="step">
                      <h3>🎯 Set Savings Goals</h3>
                      <p>Define your yearly savings target and see how your money can grow through investments.</p>
                    </div>
                  </div>
                  <div className="cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <ActionButton $primary onClick={() => setActiveTab('budget')}>
                      Start Planning Your Budget →
                    </ActionButton>
                    {hasData && (
                      <ActionButton style={{ background: '#e0f7fa', color: '#00796b', border: 'none' }} onClick={() => setShowSummary(true)}>
                        See Your Summary
                      </ActionButton>
                    )}
                  </div>
                </ValueProposition>
              </>
            ) : (
              <>
                <h2 style={{ fontWeight: 800, fontSize: '1.7rem', margin: '0 0 18px 0', color: '#222' }}>Your Budget Overview</h2>
                <GuidanceBanner>
                  <div className="title">
                    💡 Quick Tips
                  </div>
                  <div className="content">
                    • Check the <strong>Overview</strong> tab for your budget summary and key metrics<br />
                    • Visit the <strong>Investments</strong> tab to see how your savings can grow over time<br />
                    • Use the <strong>Insights</strong> tab for personalized recommendations
                  </div>
                </GuidanceBanner>
                <Card>
                  <SectionTitle style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
                    <CategoryIcon>💰</CategoryIcon>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Quick Budget Summary</h2>
                  </SectionTitle>
                  <SectionDescription>
                    See your key numbers at a glance. This summary updates as you enter your data.
                  </SectionDescription>
                  <StatGrid>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.monthlyIncome.toFixed(2)}</StatAmount>
                      <StatLabel>Monthly Income</StatLabel>
                      <StatSubtext>after taxes</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#ff5252">${calculatedData.totalMonthlyExpenses.toFixed(2)}</StatAmount>
                      <StatLabel>Monthly Expenses</StatLabel>
                      <StatSubtext>bills & necessities</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.discretionaryDay.toFixed(2)}</StatAmount>
                      <StatLabel>Available Daily Budget</StatLabel>
                      <StatSubtext>for flexible spending</StatSubtext>
                    </StatBox>
                  </StatGrid>
                </Card>
                <Card>
                  <SectionTitle style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CategoryIcon>📅</CategoryIcon>
                    <h2>Spending Breakdown</h2>
                  </SectionTitle>
                  <SectionDescription>
                    Breakdown of your weekly, monthly, and emergency fund targets based on your current budget.
                  </SectionDescription>
                  <StatGrid>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.discretionaryWeek.toFixed(2)}</StatAmount>
                      <StatLabel>Weekly Budget</StatLabel>
                      <StatSubtext>for discretionary spending</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.savingsGoalMonth.toFixed(2)}</StatAmount>
                      <StatLabel>Monthly Savings</StatLabel>
                      <StatSubtext>towards your goals</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#2e7d32">${(calculatedData.totalMonthlyExpenses * 6).toFixed(2)}</StatAmount>
                      <StatLabel>Emergency Fund</StatLabel>
                      <StatSubtext>recommended 6-month buffer</StatSubtext>
                    </StatBox>
                  </StatGrid>
                </Card>
                <NavigationButtons>
                  <NavButton onClick={() => setActiveTab('investments')}>
                    📈 View Investment Growth
                  </NavButton>
                  <NavButton $primary onClick={() => setActiveTab('insights')}>
                    💡 Get Personalized Insights
                  </NavButton>
                  <NavButton style={{ background: '#e0f7fa', color: '#00796b', border: 'none' }} onClick={() => setShowSummary(false)}>
                    Back to Getting Started
                  </NavButton>
                </NavigationButtons>
              </>
            )}
          </>
        );

      case 'budget':
        return (
          <>
            {/* Compact Quick Tips Banner */}
            <TipBanner $type="info" style={{ marginBottom: 12, fontSize: 13, padding: '10px 14px' }}>
              <div className="title" style={{ fontSize: 14, marginBottom: 2 }}>
                💡 Quick Tips
              </div>
              <div className="content" style={{ fontSize: 13 }}>
                • Enter your after-tax income and monthly expenses<br />
                • Add recurring bills and subscriptions<br />
                • Check Overview and Investments tabs for insights
              </div>
            </TipBanner>

            {/* Modern, Clean Unified Budget Form */}
            <Card style={{ padding: 28, margin: 0, background: '#fafbfc', border: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(44,62,80,0.04)' }}>
              {/* Income Section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CategoryIcon>💰</CategoryIcon> Income
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 400 }}>
                  <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Biweekly Paycheck (After Taxes)</label>
                  <StyledInputField
                    type="number"
                    name="biweeklyPaycheck"
                    value={budgetData.biweeklyPaycheck || ''}
                    onChange={handleInputChange}
                    placeholder="$0.00"
                    step="0.01"
                    min="0"
                    required
                    style={{ fontSize: 15, padding: '10px 12px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ececec', margin: '18px 0' }} />

              {/* Additional Income Section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CategoryIcon>➕</CategoryIcon> Additional Income
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 500 }}>
                  {additionalIncomes.map((income, idx) => (
                    <div key={income.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <StyledInputField
                        type="text"
                        value={income.name}
                        onChange={e => handleAdditionalIncomeChange(income.id, 'name', e.target.value)}
                        placeholder="Source"
                        style={{ fontSize: 14, padding: '8px 10px', width: 120 }}
                      />
                      <StyledInputField
                        type="number"
                        value={income.amount || ''}
                        onChange={e => handleAdditionalIncomeChange(income.id, 'amount', e.target.value)}
                        placeholder="$0.00"
                        step="0.01"
                        min="0"
                        style={{ fontSize: 14, padding: '8px 10px', width: 100 }}
                      />
                      <StyledSelect
                        value={income.frequency}
                        onChange={e => handleAdditionalIncomeChange(income.id, 'frequency', e.target.value)}
                        style={{ fontSize: 14, padding: '8px 10px', width: 100 }}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="yearly">Yearly</option>
                      </StyledSelect>
                      <StyledDeleteButton
                        onClick={() => deleteAdditionalIncome(income.id)}
                        title="Remove income source"
                        style={{ fontSize: 16, width: 26, height: 26 }}
                      >×</StyledDeleteButton>
                    </div>
                  ))}
                  <StyledAddButton onClick={addAdditionalIncome} style={{ fontSize: 13, padding: '5px 10px', margin: '2px 0', borderRadius: 6, border: '1.5px solid #4caf50', color: '#4caf50', background: 'white' }}>
                    + Add Additional Income
                  </StyledAddButton>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ececec', margin: '18px 0' }} />

              {/* Savings Goal Section */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CategoryIcon>💾</CategoryIcon> Savings Goal
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 500 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Yearly</label>
                    <StyledInputField
                      type="number"
                      name="savingsGoalYear"
                      value={budgetData.savingsGoalYear || ''}
                      onChange={handleInputChange}
                      placeholder="$0.00"
                      step="0.01"
                      min="0"
                      style={{ fontSize: 14, padding: '8px 10px', width: '100%' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>(or Monthly)</label>
                    <StyledInputField
                      type="number"
                      name="savingsGoalMonth"
                      value={budgetData.savingsGoalMonth || ''}
                      onChange={e => {
                        const monthVal = parseFloat(e.target.value) || 0;
                        setBudgetData(prev => ({
                          ...prev,
                          savingsGoalMonth: monthVal,
                          savingsGoalYear: monthVal * 12
                        }));
                      }}
                      placeholder="$0.00"
                      step="0.01"
                      min="0"
                      style={{ fontSize: 14, padding: '8px 10px', width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ececec', margin: '18px 0' }} />

              {/* Expenses Section */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CategoryIcon>💳</CategoryIcon> Monthly Expenses
                </div>
                {expenses.length === 0 && (
                  <div style={{ color: '#888', fontSize: 14, marginBottom: 6 }}>No expenses added yet.</div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 500 }}>
                  {expenses.map(expense => (
                    <div key={expense.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <StyledInputField
                        type="text"
                        value={expense.name}
                        onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                        placeholder="e.g. Rent, Phone, Groceries"
                        style={{ fontSize: 14, padding: '8px 10px', width: 140 }}
                      />
                      <AmountInputGroup style={{ flex: 1 }}>
                        <span className="currency-symbol">$</span>
                        <StyledInputField
                          type="number"
                          value={expense.amount || ''}
                          onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          style={{ fontSize: 14, padding: '8px 10px', width: 100, paddingLeft: 22 }}
                        />
                      </AmountInputGroup>
                      <StyledDeleteButton 
                        onClick={() => deleteExpense(expense.id)}
                        title="Remove expense"
                        style={{ fontSize: 16, width: 26, height: 26 }}
                      >×</StyledDeleteButton>
                    </div>
                  ))}
                  <StyledAddButton onClick={addExpense} style={{ fontSize: 13, padding: '5px 10px', margin: '2px 0', borderRadius: 6, border: '1.5px solid #4caf50', color: '#4caf50', background: 'white' }}>
                    + Add Expense
                  </StyledAddButton>
                </div>
              </div>
            </Card>

            {/* Compact Navigation Buttons */}
            <NavigationButtons style={{ marginTop: 18, paddingTop: 10, gap: 8 }}>
              <NavButton onClick={() => setActiveTab('overview')} style={{ fontSize: 14, padding: '8px 14px' }}>
                ← Overview
              </NavButton>
              <NavButton
                $primary
                onClick={() => setActiveTab('insights')}
                disabled={budgetData.biweeklyPaycheck === '' || expenses.length === 0}
                title={budgetData.biweeklyPaycheck === '' || expenses.length === 0 ? 'Please enter your income and at least one expense to continue' : ''}
                style={{ fontSize: 14, padding: '8px 14px' }}
              >
                Next: Insights →
              </NavButton>
            </NavigationButtons>
          </>
        );

      case 'insights':
        return (
          <>
            {(budgetData.biweeklyPaycheck === '' || Number(budgetData.biweeklyPaycheck) === 0 || expenses.length === 0) ? (
              <NoDataCallout>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div>
                <div>
                  <strong>Let's get started!</strong><br />
                  Enter your income and expenses on the <b>Budget</b> tab to see your personalized insights.
                </div>
                <CTAButton onClick={() => setActiveTab('budget')}>Go to Budget</CTAButton>
              </NoDataCallout>
            ) : (
              <>
                <TractionBanner>
                  <span>
                    <FaUserFriends style={{ marginRight: 8 }} />
                    Helping <b>{formatNumberWithCommas(viewCount)}+</b> young professionals take control of their money!
                  </span>
                </TractionBanner>

                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 0, minHeight: 0 }}>
                    <SectionTitle style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
                      <CategoryIcon>💰</CategoryIcon>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Quick Budget Summary</h2>
                    </SectionTitle>
                  </div>
                  <SectionDescription>
                    See your key numbers at a glance. This summary updates as you enter your data.
                  </SectionDescription>
                  <StatGrid>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.monthlyIncome.toFixed(2)}</StatAmount>
                      <StatLabel>Monthly Income</StatLabel>
                      <StatSubtext>after taxes</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#ff5252">${calculatedData.totalMonthlyExpenses.toFixed(2)}</StatAmount>
                      <StatLabel>Monthly Expenses</StatLabel>
                      <StatSubtext>bills & necessities</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.discretionaryDay.toFixed(2)}</StatAmount>
                      <StatLabel>Available Daily Budget</StatLabel>
                      <StatSubtext>for flexible spending</StatSubtext>
                    </StatBox>
                  </StatGrid>
                </Card>

                <SectionSpacer />

                <Card>
                  <SectionTitle style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CategoryIcon>📅</CategoryIcon>
                    <h2>Spending Breakdown</h2>
                  </SectionTitle>
                  <SectionDescription>
                    Breakdown of your weekly, monthly, and emergency fund targets based on your current budget.
                  </SectionDescription>
                  <StatGrid>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.discretionaryWeek.toFixed(2)}</StatAmount>
                      <StatLabel>Weekly Budget</StatLabel>
                      <StatSubtext>for discretionary spending</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#2e7d32">${calculatedData.savingsGoalMonth.toFixed(2)}</StatAmount>
                      <StatLabel>Monthly Savings</StatLabel>
                      <StatSubtext>towards your goals</StatSubtext>
                    </StatBox>
                    <StatBox>
                      <StatAmount color="#2e7d32">${(calculatedData.totalMonthlyExpenses * 6).toFixed(2)}</StatAmount>
                      <StatLabel>Emergency Fund</StatLabel>
                      <StatSubtext>recommended 6-month buffer</StatSubtext>
                    </StatBox>
                  </StatGrid>
                </Card>

                <SectionSpacer />

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

                <WhatsNextSection>
                  <span style={{ fontSize: '2rem' }}>🚀</span>
                  <div>
                    <strong>What's Next?</strong><br />
                    Explore the <b>Investments</b> tab to see how your savings can grow over time!
                  </div>
                  <CTAButton style={{ marginLeft: 'auto' }} onClick={() => setActiveTab('investments')}>
                    Try Investment Growth
                  </CTAButton>
                </WhatsNextSection>
              </>
            )}
          </>
        );

      case 'investments':
        return (
          <>
            <GuidanceBanner>
              <div className="title">
                📈 Investment Growth Calculator
              </div>
              <div className="content">
                See how your savings can grow over time with compound interest.
                Adjust the investment period and expected return rate to explore different scenarios.
              </div>
            </GuidanceBanner>

            <Card>
              <InvestmentGrowth annualSavings={budgetData.savingsGoalYear || 0} />
            </Card>

            <NavigationButtons>
              <NavButton onClick={() => setActiveTab('insights')}>
                ← Back to Insights
              </NavButton>
              <NavButton $primary onClick={() => setActiveTab('overview')}>
                Return to Overview →
              </NavButton>
            </NavigationButtons>
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
        <GoogleSignIn />

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

        {analyticsError && (
          <div style={{ color: '#ff5252', fontSize: '13px', marginTop: '8px' }}>
            ⚠️ Analytics error: {analyticsError}
          </div>
        )}

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

function formatNumberWithCommas(num) {
  if (typeof num !== 'number') return num;
  return num.toLocaleString();
}

export default BudgetCalculator; 