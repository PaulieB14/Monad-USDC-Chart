import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Flex, Text, Badge } from '../../styles';
import { formatUSDCAmount, formatRelativeTime, getAmountColor, shortenAddress, getAddressLabel } from '../../utils';
import type { Transfer } from '../../graphql/types';

// Animations
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(131, 110, 249, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(131, 110, 249, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(131, 110, 249, 0);
  }
`;

const glowAnimation = keyframes`
  0% {
    filter: drop-shadow(0 0 2px var(--color-primary));
  }
  50% {
    filter: drop-shadow(0 0 8px var(--color-primary));
  }
  100% {
    filter: drop-shadow(0 0 2px var(--color-primary));
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Styled components
const AlertContainer = styled.div<{ $color: string }>`
  background-color: var(--color-background-lighter);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-left: 4px solid ${({ $color }) => $color};
  box-shadow: var(--shadow-md);
  animation: ${slideIn} 0.3s ease-out, ${pulseAnimation} 2s infinite;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, ${({ $color }) => $color}10 0%, transparent 100%);
    opacity: 0.1;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background-image: url('/images/monad-icon.svg');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
    z-index: 0;
    animation: ${glowAnimation} 3s infinite;
  }
`;

const AlertContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Amount = styled(Text)<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: 700;
  text-shadow: 0 0 5px ${({ $color }) => $color}80;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  position: relative;
  cursor: pointer;
  
  &:hover {
    .copy-tooltip {
      opacity: 1;
    }
  }
`;

const CopyTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
`;

const AddressCopyButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0;
  font-size: var(--font-size-xs);
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const AddressLabel = styled(Text)`
  background-color: rgba(131, 110, 249, 0.2);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  border: 1px solid rgba(131, 110, 249, 0.3);
`;

const AddressText = styled(Text)`
  font-family: monospace;
  word-break: break-all;
`;

const FullAddressText = styled(Text)`
  font-family: monospace;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: 4px;
  word-break: break-all;
`;

const TimeStamp = styled(Text)`
  font-style: italic;
`;

// WhaleAlert component
interface WhaleAlertProps {
  transfer: Transfer;
}

const WhaleAlert: React.FC<WhaleAlertProps> = ({ transfer }) => {
  const color = getAmountColor(transfer.value);
  const amount = formatUSDCAmount(transfer.value);
  const time = formatRelativeTime(transfer.timestamp);
  
  const fromAddress = shortenAddress(transfer.from.address);
  const toAddress = shortenAddress(transfer.to.address);
  
  const fromLabel = getAddressLabel(transfer.from.address);
  const toLabel = getAddressLabel(transfer.to.address);
  
  // State for copy tooltip
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  // Timeout ref for copy tooltip
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle copy address
  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    
    // Clear any existing timeout
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    
    // Show the copied tooltip
    setCopiedAddress(address);
    
    // Hide the tooltip after 2 seconds
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };
  
  return (
    <AlertContainer $color={color}>
      <AlertContent>
        <Flex $justify="space-between" $align="flex-start">
          <Flex $align="center" $gap="var(--spacing-xs)">
            <Amount $size="lg" $color={color}>{amount}</Amount>
            {parseFloat(transfer.value) >= 1000000000000 && (
              <Badge $variant="warning">Mega Whale</Badge>
            )}
          </Flex>
          <TimeStamp $size="xs" $color="var(--color-text-secondary)">{time}</TimeStamp>
        </Flex>
        
        <Flex $direction="column" $align="flex-start" $gap="var(--spacing-xs)" style={{ marginTop: 'var(--spacing-sm)' }}>
          <Text $size="sm" $color="var(--color-text-secondary)">From:</Text>
          <AddressContainer>
            <AddressLabel>{fromLabel}</AddressLabel>
            <AddressText>{fromAddress}</AddressText>
            <AddressCopyButton 
              onClick={(e) => handleCopyAddress(transfer.from.address, e)}
              title="Copy full address"
            >
              📋
            </AddressCopyButton>
            {copiedAddress === transfer.from.address && (
              <CopyTooltip className="copy-tooltip">Address copied!</CopyTooltip>
            )}
          </AddressContainer>
          <FullAddressText>{transfer.from.address}</FullAddressText>
          
          <Text $size="sm" $color="var(--color-text-secondary)">To:</Text>
          <AddressContainer>
            <AddressLabel>{toLabel}</AddressLabel>
            <AddressText>{toAddress}</AddressText>
            <AddressCopyButton 
              onClick={(e) => handleCopyAddress(transfer.to.address, e)}
              title="Copy full address"
            >
              📋
            </AddressCopyButton>
            {copiedAddress === transfer.to.address && (
              <CopyTooltip className="copy-tooltip">Address copied!</CopyTooltip>
            )}
          </AddressContainer>
          <FullAddressText>{transfer.to.address}</FullAddressText>
        </Flex>
      </AlertContent>
    </AlertContainer>
  );
};

export default WhaleAlert;
