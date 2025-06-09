import React from 'react';
import styled from 'styled-components';
import { Flex, Text } from '../../styles';

// Styled components for the sidebar
const SidebarContainer = styled.aside`
  background-color: var(--color-background-lighter);
  border-right: 1px solid var(--color-border);
  width: 240px;
  height: 100%;
  padding: var(--spacing-md);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 90;
  padding-top: 80px; /* Space for header */
  overflow-y: auto;
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  margin-bottom: var(--spacing-xs);
  
  ${({ $active }) => $active && `
    background-color: rgba(0, 136, 204, 0.1);
    border-left: 3px solid var(--color-primary);
  `}
  
  &:hover {
    background-color: rgba(0, 136, 204, 0.05);
  }
`;

const NavIcon = styled.div`
  font-size: var(--font-size-lg);
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavText = styled(Text)<{ $active?: boolean }>`
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  color: ${({ $active }) => $active ? 'var(--color-primary)' : 'var(--color-text)'};
`;

const SectionTitle = styled(Text)`
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-md) 0;
`;

// Navigation items
const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard', active: true },
  { id: 'whale-alerts', icon: '🚨', label: 'Whale Alerts' },
  { id: 'leaderboard', icon: '🏆', label: 'Whale Leaderboard' },
  { id: 'flow', icon: '🌊', label: 'Ocean Flow' },
  { id: 'pulse', icon: '📈', label: 'Market Pulse' },
  { id: 'time-machine', icon: '⏰', label: 'Time Machine' },
];

// Analytics items
const analyticsItems = [
  { id: 'analytics', icon: '📈', label: 'Analytics Dashboard' },
  { id: 'reports', icon: '📋', label: 'Whale Reports' },
  { id: 'alerts', icon: '🔔', label: 'Custom Alerts' },
];

// Sidebar component
const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <SectionTitle $size="xs" $color="var(--color-text-secondary)">
        MAIN NAVIGATION
      </SectionTitle>
      
      {navItems.map((item) => (
        <NavItem key={item.id} $active={item.active}>
          <NavIcon>{item.icon}</NavIcon>
          <NavText $active={item.active}>{item.label}</NavText>
        </NavItem>
      ))}
      
      <Divider />
      
      <SectionTitle $size="xs" $color="var(--color-text-secondary)">
        ANALYTICS
      </SectionTitle>
      
      {analyticsItems.map((item) => (
        <NavItem key={item.id}>
          <NavIcon>{item.icon}</NavIcon>
          <NavText>{item.label}</NavText>
        </NavItem>
      ))}
      
      <Divider />
      
      <Flex $direction="column" $align="flex-start" $gap="var(--spacing-sm)">
        <Text $size="xs" $color="var(--color-text-secondary)">
          Last updated: <span id="last-updated">Just now</span>
        </Text>
        <Text $size="xs" $color="var(--color-text-secondary)">
          Block: <span id="current-block">Loading...</span>
        </Text>
      </Flex>
    </SidebarContainer>
  );
};

export default Sidebar;
