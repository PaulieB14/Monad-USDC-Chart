import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Monad Color palette */
    --color-background: #200052; /* Monad Blue */
    --color-background-lighter: #2a0a6a; /* Slightly lighter Monad Blue */
    --color-primary: #836EF9; /* Monad Purple */
    --color-secondary: #9a8bfa; /* Lighter Monad Purple */
    --color-accent: #A0055D; /* Monad Berry */
    --color-text: #FBFAF9; /* Monad Off-White */
    --color-text-secondary: #d8d7d6; /* Slightly darker Off-White */
    --color-border: #3a1a7a; /* Slightly lighter than background-lighter */
    
    /* Alert colors */
    --color-alert-red: #FF4136;
    --color-alert-orange: #FF851B;
    --color-alert-yellow: #FFDC00;
    --color-alert-green: #2ECC40;
    
    /* Status colors */
    --color-success: #2ECC40;
    --color-warning: #FFDC00;
    --color-danger: #FF4136;
    --color-info: #836EF9; /* Monad Purple */
    
    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
    
    /* Animations */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    /* Border radius */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 20px;
    
    /* Font sizes */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-xxl: 2rem;
    --font-size-xxxl: 3rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Inter', sans-serif;
    background-color: var(--color-background);
    color: var(--color-text);
    line-height: 1.5;
    font-size: 16px;
    overflow-x: hidden;
  }

  body {
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  a {
    color: var(--color-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--color-accent);
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-background-lighter);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent);
  }

  /* Animations */
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 5px var(--color-primary);
    }
    50% {
      box-shadow: 0 0 20px var(--color-primary), 0 0 30px var(--color-accent);
    }
    100% {
      box-shadow: 0 0 5px var(--color-primary);
    }
  }

  /* Utility classes */
  .pulse {
    animation: pulse 2s infinite;
  }

  .fadeIn {
    animation: fadeIn 0.5s ease-in;
  }

  .slideInUp {
    animation: slideInUp 0.5s ease-out;
  }

  .glow {
    animation: glow 2s infinite;
  }
`;

export default GlobalStyles;
