import axios from 'axios';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';
const PLAID_CLIENT_ID = process.env.REACT_APP_PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.REACT_APP_PLAID_SECRET;

class BankService {
  constructor() {
    // Use environment-specific URL
    const baseURL = PLAID_ENV === 'sandbox' 
      ? 'https://sandbox.plaid.com'
      : PLAID_ENV === 'development'
        ? 'https://development.plaid.com'
        : 'https://production.plaid.com';

    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET
      }
    });
  }

  async createLinkToken() {
    try {
      const response = await this.api.post('/link/token/create', {
        client_name: 'SmartBudget',
        language: 'en',
        country_codes: ['US'],
        user: {
          client_user_id: 'unique_user_id'
        },
        products: ['transactions']
      });
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  }

  async exchangePublicToken(publicToken) {
    try {
      const response = await this.api.post('/item/public_token/exchange', {
        public_token: publicToken
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  }

  async getTransactions(accessToken, startDate, endDate) {
    try {
      const response = await this.api.post('/transactions/get', {
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate
      });
      return response.data.transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
}

export const bankService = new BankService(); 