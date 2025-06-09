# USDC Whale Commander

A real-time whale activity intelligence dashboard for tracking large USDC movements with military-grade precision. Think "Bloomberg Terminal meets Whale Watching" with gorgeous real-time visualizations.

## 🎯 The Concept

A mission control center for tracking large USDC movements with military-grade precision. This dashboard makes USDC whale watching addictive and insightful.

## ✨ Key Features

### 1. Live Whale Alert Stream
- Real-time feed of transfers >$50K with pulsing animations
- Each alert shows: Amount, From/To (with labels like "Unknown Whale", "DEX", "Exchange")
- Sound effects for mega-whales (>$1M transfers)
- Color-coded by size: Yellow ($50K+), Orange ($250K+), Red ($1M+)

### 2. Whale Leaderboard
- Top 20 USDC holders with live balance updates
- "Net Flow" indicator (gaining/losing USDC today)
- Whale activity score (how often they transfer)
- Clickable to see their recent activity


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/usdc-whale-commander.git
cd usdc-whale-commander
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up your environment variables
   - Copy the `.env.example` file to a new file named `.env`
   - Replace `YOUR_API_KEY_HERE` with your actual API key from The Graph
   - The `.env` file is gitignored to keep your API key private
   - We've also created a `.env.development` file with additional configuration to help with development

4. Note about development environment
   - This project uses CRACO (Create React App Configuration Override) to customize the webpack configuration
   - This allows us to bypass the strict module scope plugin that causes issues with imports from outside the src directory

4. Start the development server
```bash
npm start
# or
yarn start
```

5. Open your browser and navigate to `http://localhost:3000`

## 🔧 Built With
- React
- TypeScript
- Apollo Client for GraphQL
- Styled Components
- Howler.js for sound effects

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- The Graph Protocol for providing the subgraph data
- USDC for being the most interesting stablecoin to track
