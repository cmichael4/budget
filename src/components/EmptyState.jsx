const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .description {
    color: #666;
    font-size: 14px;
    max-width: 400px;
    margin: 0 auto;
  }
`;

// Use it for empty states:
{expenses.length === 0 && (
  <EmptyState>
    <div className="icon">📝</div>
    <div className="title">No Expenses Added Yet</div>
    <div className="description">
      Start by adding your regular monthly expenses like rent,
      utilities, groceries, and other bills.
    </div>
    <ActionButton $primary onClick={addExpense} style={{ marginTop: '20px' }}>
      Add Your First Expense
    </ActionButton>
  </EmptyState>
)} 