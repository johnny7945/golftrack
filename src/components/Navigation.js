import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import FlagIcon from '@mui/icons-material/Flag';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

const Navigation = () => {
  const location = useLocation();
  
  // 檢查當前路徑是否匹配
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar>
          <SportsGolfIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            高爾夫練習助手
          </Typography>
          
          <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
            <Button
              component={Link}
              to="/practice/goals"
              color="inherit"
              startIcon={<FlagIcon />}
              sx={{ mx: 1, fontWeight: isActive('/practice/goals') ? 'bold' : 'normal' }}
            >
              練習目標
            </Button>
            
            <Button
              component={Link}
              to="/practice/record"
              color="inherit"
              startIcon={<SportsGolfIcon />}
              sx={{ mx: 1, fontWeight: isActive('/practice/record') ? 'bold' : 'normal' }}
            >
              練習記錄
            </Button>
            
            <Button
              component={Link}
              to="/practice/analysis"
              color="inherit"
              startIcon={<BarChartIcon />}
              sx={{ mx: 1, fontWeight: isActive('/practice/analysis') ? 'bold' : 'normal' }}
            >
              練習分析
            </Button>
            
            <Button
              component={Link}
              to="/game"
              color="inherit"
              startIcon={<ScoreboardIcon />}
              sx={{ mx: 1, fontWeight: location.pathname === '/game' ? 'bold' : 'normal' }}
            >
              記錄比賽
            </Button>
            
            <Button
              component={Link}
              to="/game/records"
              color="inherit"
              startIcon={<ScoreboardIcon />}
              sx={{ mx: 1, fontWeight: location.pathname === '/game/records' ? 'bold' : 'normal' }}
            >
              查看記錄
            </Button>
            
            <Button
              component={Link}
              to="/game/analysis"
              color="inherit"
              startIcon={<BarChartIcon />}
              sx={{ mx: 1, fontWeight: location.pathname === '/game/analysis' ? 'bold' : 'normal' }}
            >
              比賽分析
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;