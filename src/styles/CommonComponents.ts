import styled from 'styled-components';

// Card component for dashboard widgets
export const Card = styled.div`
  background-color: var(--color-background-lighter);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

// Card header
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
`;

// Card title
export const CardTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
`;

// Card content
export const CardContent = styled.div`
  position: relative;
`;

// Button variants
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'outline' | 'text' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  
  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: var(--color-primary);
          color: white;
          
          &:hover {
            background-color: var(--color-secondary);
          }
        `;
      case 'secondary':
        return `
          background-color: var(--color-secondary);
          color: white;
          
          &:hover {
            background-color: var(--color-accent);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
          
          &:hover {
            background-color: rgba(131, 110, 249, 0.1);
          }
        `;
      case 'text':
        return `
          background-color: transparent;
          color: var(--color-text);
          padding: var(--spacing-xs) var(--spacing-sm);
          
          &:hover {
            color: var(--color-accent);
          }
        `;
      default:
        return '';
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: var(--spacing-xs);
  }
`;

// Badge component for status indicators
export const Badge = styled.span<{ $variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  
  ${({ $variant = 'info' }) => {
    switch ($variant) {
      case 'success':
        return `
          background-color: rgba(46, 204, 64, 0.2);
          color: var(--color-success);
          border: 1px solid var(--color-success);
        `;
      case 'warning':
        return `
          background-color: rgba(255, 220, 0, 0.2);
          color: var(--color-warning);
          border: 1px solid var(--color-warning);
        `;
      case 'danger':
        return `
          background-color: rgba(255, 65, 54, 0.2);
          color: var(--color-danger);
          border: 1px solid var(--color-danger);
        `;
      case 'info':
      default:
        return `
          background-color: rgba(131, 110, 249, 0.2);
          color: var(--color-info);
          border: 1px solid var(--color-info);
        `;
    }
  }}
`;

// Flex container
export const Flex = styled.div<{ 
  $direction?: 'row' | 'column',
  $justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around',
  $align?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
  $gap?: string,
  $wrap?: 'nowrap' | 'wrap'
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  justify-content: ${({ $justify = 'flex-start' }) => $justify};
  align-items: ${({ $align = 'center' }) => $align};
  gap: ${({ $gap = 'var(--spacing-md)' }) => $gap};
  flex-wrap: ${({ $wrap = 'nowrap' }) => $wrap};
`;

// Grid container
export const Grid = styled.div<{
  $columns?: string,
  $gap?: string
}>`
  display: grid;
  grid-template-columns: ${({ $columns = 'repeat(12, 1fr)' }) => $columns};
  gap: ${({ $gap = 'var(--spacing-md)' }) => $gap};
`;

// Text with variants
export const Text = styled.p<{
  $size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  $weight?: 'normal' | 'medium' | 'semibold' | 'bold',
  $color?: string,
  $align?: 'left' | 'center' | 'right'
}>`
  font-size: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'xs': return 'var(--font-size-xs)';
      case 'sm': return 'var(--font-size-sm)';
      case 'md': return 'var(--font-size-md)';
      case 'lg': return 'var(--font-size-lg)';
      case 'xl': return 'var(--font-size-xl)';
      default: return 'var(--font-size-md)';
    }
  }};
  
  font-weight: ${({ $weight = 'normal' }) => {
    switch ($weight) {
      case 'normal': return '400';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      default: return '400';
    }
  }};
  
  color: ${({ $color = 'var(--color-text)' }) => $color};
  text-align: ${({ $align = 'left' }) => $align};
  margin: 0;
`;

// Loading spinner
export const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(131, 110, 249, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Loading container
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-md);
`;

// Alert component
export const Alert = styled.div<{ $variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  
  ${({ $variant = 'info' }) => {
    switch ($variant) {
      case 'success':
        return `
          background-color: rgba(46, 204, 64, 0.1);
          border-left: 4px solid var(--color-success);
          color: var(--color-success);
        `;
      case 'warning':
        return `
          background-color: rgba(255, 220, 0, 0.1);
          border-left: 4px solid var(--color-warning);
          color: var(--color-warning);
        `;
      case 'danger':
        return `
          background-color: rgba(255, 65, 54, 0.1);
          border-left: 4px solid var(--color-danger);
          color: var(--color-danger);
        `;
      case 'info':
      default:
        return `
          background-color: rgba(131, 110, 249, 0.1);
          border-left: 4px solid var(--color-info);
          color: var(--color-info);
        `;
    }
  }}
`;

// Divider
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-md) 0;
`;

// Container with max width
export const Container = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth = '1200px' }) => $maxWidth};
  margin: 0 auto;
  padding: 0 var(--spacing-md);
`;

// Tooltip
export const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  
  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--color-background);
    color: var(--color-text);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-xs);
    white-space: nowrap;
    z-index: 10;
    box-shadow: var(--shadow-md);
    margin-bottom: var(--spacing-xs);
  }
`;
