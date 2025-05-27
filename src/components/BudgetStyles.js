import styled from 'styled-components';

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
  }

  &::before {
    content: '$';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    z-index: 1;
  }
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    ${InputWrapper} {
      width: 100%;
    }
  }
`;

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
  padding: 12px;
  padding-left: ${props => props.type === 'number' ? '24px' : '12px'};
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px #4caf5020;
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
  
  &:hover {
    background: #ff525210;
    color: #ff1744;
  }
`;

export const AddButton = styled.button`
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
  
  &:hover {
    background: #4caf5010;
    transform: translateY(-1px);
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