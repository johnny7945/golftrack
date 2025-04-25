import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import PracticeAssistant from './pages/PracticeAssistant';
import PracticeGoals from './pages/PracticeGoals';
import PracticeRecord from './pages/PracticeRecord';
import PracticeAnalysis from './pages/PracticeAnalysis';
import GameRecord from './pages/GameRecord';
import GameAnalysis from './pages/GameAnalysis';
import GameRecordList from './pages/GameRecordList';
import './App.css';

// 創建高爾夫主題
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // 草地綠
    },
    secondary: {
      main: '#ffffff', // 高爾夫球白
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/practice" element={<PracticeAssistant />} />
              <Route path="/practice/goals" element={<PracticeGoals />} />
              <Route path="/practice/record" element={<PracticeRecord />} />
              <Route path="/practice/analysis" element={<PracticeAnalysis />} />
              <Route path="/game" element={<GameRecord />} />
              <Route path="/game/records" element={<GameRecordList />} />
              <Route path="/game/analysis" element={<GameAnalysis />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;