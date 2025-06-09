# 🐋 USDC Whale Commander

A real-time intelligence dashboard for tracking large USDC transfers and whale activity on the Ethereum blockchain.

## ✨ Features

- **🚨 Live Whale Alerts**: Real-time monitoring of large USDC transfers ($50K+)
- **🏆 Whale Leaderboard**: Top USDC holders with filtering and activity tracking
- **📊 Interactive Charts**: Visual analytics for whale distribution and activity
- **🔄 Real-time Updates**: Auto-refreshing data every 15-60 seconds
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Military-themed UI**: Dark theme with neon accents

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/PaulieB14/Monad-USDC-Chart.git
   cd Monad-USDC-Chart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Add your Graph API key for better rate limits
   REACT_APP_GRAPH_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

The dashboard connects to The Graph Protocol subgraph for USDC data. Key configuration options in `src/config.ts`:

- **Subgraph URL**: Currently using IPFS hash `QmNbfA9NhEpDnYohsVDUJjgbHNNEAj9xYFYCnd4JrrhqV3`
- **Whale Thresholds**: 
  - Small: $50K (Yellow alerts)
  - Medium: $250K (Orange alerts)  
  - Large: $1M+ (Red alerts with animations)
- **Polling Intervals**: 15-60 seconds depending on data type

## 📈 Data Sources

- **Primary**: The Graph Protocol subgraph for USDC transfers and balances
- **Blockchain**: Ethereum mainnet USDC contract data
- **Real-time**: WebSocket connections for live updates (planned)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Styled Components
- **Data**: Apollo GraphQL Client
- **Charts**: Custom SVG charts with animations
- **Build**: Create React App + Vite
- **Deployment**: Vercel

## 📊 Recent Updates

### Latest Improvements (June 2025)
- ✅ Fixed subgraph URL to use correct IPFS hash
- ✅ Updated GraphQL queries to match actual schema
- ✅ Added real-time data integration
- ✅ Improved error handling and loading states
- ✅ Added whale filtering and categorization
- ✅ Enhanced responsive design
- ✅ Added clickable links to Etherscan

### Planned Features
- 🔄 WebSocket integration for instant updates
- 🔊 Sound notifications for large transfers
- 📱 Mobile app companion
- 🤖 Telegram/Discord bot alerts
- 📈 Historical charts and analytics
- 💾 Export functionality for data

## 🐋 Understanding Whale Categories

- **🏰 Mega Whales**: $10M+ USDC holders
- **🐋 Large Whales**: $1M - $10M USDC holders  
- **🐳 Medium Whales**: $100K - $1M USDC holders
- **🐟 Small Holders**: Under $100K USDC

## 🔗 Useful Links

- **Live Dashboard**: https://monad-usdc-chart.vercel.app/
- **Subgraph Explorer**: https://thegraph.com/hosted-service/subgraph/your-subgraph
- **USDC Contract**: https://etherscan.io/token/0xa0b86a33e6427a6c4e5c14f5e6e4b8b8b8b8b8b8

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The Graph Protocol for blockchain data indexing
- Monad Labs for blockchain infrastructure
- React and TypeScript communities
- All the whale watchers keeping the DeFi ecosystem transparent

---

**⚠️ Disclaimer**: This dashboard is for informational purposes only. Always do your own research before making financial decisions.
