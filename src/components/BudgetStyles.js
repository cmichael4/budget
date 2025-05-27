import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const PageTitle = styled.h1`
  color: #2e7d32;
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.5em;
`;

export const BudgetTable = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #ffeb3b10;
  margin: 8px 0;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ffeb3b20;
  }
`;

export const CalculatedRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  background-color: ${props => props.highlight ? '#4caf5040' : '#4caf5020'};
  margin: 5px 0;
  border-radius: 4px;
  padding: 12px;
  
  ${props => props.highlight && `
    font-weight: bold;
    font-size: 1.1em;
  `}
`;

export const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

export const Value = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

export const InputField = styled.input`
  width: ${props => props.type === 'text' ? '150px' : '120px'};
  padding: 8px 8px 8px ${props => props.type === 'number' ? '24px' : '8px'};
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: right;
  font-size: 16px;
  position: relative;
  
  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &[type='number']::-webkit-outer-spin-button,
  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: inline-block;

  &::before {
    content: '$';
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    z-index: 1;
  }
`;

export const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin: 20px 0;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff5252;
  font-size: 22px;
  cursor: pointer;
  padding: 4px 12px;
  margin-left: 8px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #ff525210;
    color: #ff1744;
  }
`;

export const AddButton = styled.button`
  background: none;
  border: 2px solid #4caf50;
  color: #4caf50;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin: 15px 0;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #4caf5020;
    transform: translateY(-1px);
  }

  &:before {
    content: '+';
    font-size: 20px;
    margin-right: 4px;
  }
`;

export const InfoText = styled.p`
  color: #666;
  font-size: ${props => props.small ? '14px' : '16px'};
  margin: ${props => props.small ? '8px 0' : '16px 0'};
  line-height: 1.5;
  
  &:before {
    content: '';
    display: block;
    margin: 8px 0;
  }
`;

export const Tooltip = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
  font-weight: normal;
`;

export const SectionHeader = styled.div`
  margin-bottom: 20px;
  
  h2 {
    color: #333;
    margin-bottom: 8px;
    padding-bottom: 5px;
    border-bottom: 2px solid #4caf5020;
  }
`;

export const Summary = styled.div`
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.2);
  }
`;

export const SummaryLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

export const SummaryValue = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CategoryIcon = styled.span`
  font-size: 24px;
  margin-right: 10px;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const RequiredField = styled.span`
  color: #ff5252;
  margin-left: 4px;
`;

export const HelpText = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 4px;
  font-style: italic;
`; 