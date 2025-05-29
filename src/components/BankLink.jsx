import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import styled from 'styled-components';
import { bankService } from '../services/bankService';

const LinkContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 20px 0;
`;

const StatusMessage = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  background: ${props => props.$type === 'error' ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.$type === 'error' ? '#c62828' : '#2e7d32'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2e7d32;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LinkButton = styled.button`
  background: #2e7d32;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  
  &:hover {
    background: #1b5e20;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const BankLink = ({ onAccountsLinked }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const generateToken = async () => {
      try {
        setStatus('Initializing bank connection...');
        const token = await bankService.createLinkToken();
        setLinkToken(token);
        setStatus('');
      } catch (err) {
        setError('Failed to initialize bank connection. Please try again later.');
        console.error('Error generating link token:', err);
      }
    };
    generateToken();
  }, []);

  const onSuccess = useCallback(async (publicToken, metadata) => {
    setLoading(true);
    setError(null);
    try {
      setStatus('Connecting to your bank...');
      const accessToken = await bankService.exchangePublicToken(publicToken);
      
      setStatus('Fetching your transactions...');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const transactions = await bankService.getTransactions(
        accessToken,
        thirtyDaysAgo.toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );

      setStatus('Successfully connected!');
      onAccountsLinked({
        accounts: metadata.accounts,
        transactions
      });
    } catch (err) {
      setError('Failed to fetch bank data. Please try again.');
      console.error('Error linking account:', err);
    } finally {
      setLoading(false);
    }
  }, [onAccountsLinked]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: () => {
      setStatus('');
    },
    onEvent: (eventName) => {
      if (eventName === 'ERROR') {
        setError('An error occurred while connecting to your bank.');
      }
    }
  });

  return (
    <LinkContainer>
      <h2>Connect Your Bank Account</h2>
      <p>Securely connect your bank account to automatically track expenses.</p>
      
      {error && (
        <StatusMessage $type="error">
          ⚠️ {error}
        </StatusMessage>
      )}
      
      {status && (
        <StatusMessage>
          <LoadingSpinner />
          {status}
        </StatusMessage>
      )}
      
      <LinkButton 
        onClick={() => open()} 
        disabled={!ready || loading}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            Connecting...
          </>
        ) : (
          'Connect Bank Account'
        )}
      </LinkButton>
      
      <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        🔒 Your bank connection is secured by Plaid, trusted by millions of users.
        We never see or store your banking credentials.
      </div>
    </LinkContainer>
  );
};

export default BankLink; 