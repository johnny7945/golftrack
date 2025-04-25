import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Grid, Card, CardContent, CardActions, Typography, 
  Button, Box, Divider, List, ListItem, ListItemText, LinearProgress 
} from '@mui/material';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import FlagIcon from '@mui/icons-material/Flag';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

const Dashboard = () => {
  const [practiceGoals, setPracticeGoals] = useState([]);
  const [clubStats, setClubStats] = useState({});
  const [gameStats, setGameStats] = useState(null);
  
  useEffect(() => {
    // 獲取練習目標
    const goals = window.GolfDataService.getGoals();
    setPracticeGoals(goals);
    
    // 獲取球桿統計數據（過去30天）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateRange = {
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    };
    const stats = window.GolfDataService.getClubSuccessRates(dateRange);
    setClubStats(stats);
    
    // 獲取最新比賽統計
    const latestGameStats = window.GolfDataService.getGameStatistics();
    setGameStats(latestGameStats);
  }, []);
  
  // 找出成功率最高和最低的球桿
  const getBestAndWorstClubs = () => {
    const clubTypes = Object.keys(clubStats).filter(type => clubStats[type].attempts > 0);
    if (clubTypes.length === 0) return { best: null, worst: null };
    
    const best = clubTypes.reduce((prev, current) => {
      return parseFloat(clubStats[current].rate) > parseFloat(clubStats[prev].rate) ? current : prev;
    }, clubTypes[0]);
    
    const worst = clubTypes.reduce((prev, current) => {
      return parseFloat(clubStats[current].rate) < parseFloat(clubStats[prev].rate) ? current : prev;
    }, clubTypes[0]);
    
    return { best, worst };
  };
  
  const { best: bestClub, worst: worstClub } = getBestAndWorstClubs();
  
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          高爾夫練習助手儀表板
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          追蹤您的練習進度和比賽表現
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* 練習目標卡片 */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <FlagIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">練習目標</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {practiceGoals.length > 0 ? (
                <List>
                  {practiceGoals.slice(0, 3).map((goal) => (
                    <ListItem key={goal.id}>
                      <ListItemText 
                        primary={goal.target} 
                        secondary={`類型: ${goal.type}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  尚未設定練習目標
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to="/practice/goals" 
                size="small" 
                color="primary"
              >
                管理目標
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* 練習統計卡片 */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">練習統計 (過去30天)</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {bestClub && worstClub ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    最佳表現: {bestClub} ({clubStats[bestClub].rate}%)
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(clubStats[bestClub].rate)} 
                    color="success"
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                  />
                  
                  <Typography variant="body1" gutterBottom>
                    需要改進: {worstClub} ({clubStats[worstClub].rate}%)
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(clubStats[worstClub].rate)} 
                    color="error"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  尚無練習數據
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to="/practice/analysis" 
                size="small" 
                color="primary"
              >
                查看詳細分析
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* 比賽記錄卡片 */}
        <Grid item xs={12}>
          <Card className="dashboard-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ScoreboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">最新比賽表現</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {gameStats ? (
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="body2" color="text.secondary">總桿數</Typography>
                    <Typography variant="h6">{gameStats.totalScore}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="body2" color="text.secondary">FIR</Typography>
                    <Typography variant="h6">{gameStats.firRate}%</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="body2" color="text.secondary">GIR</Typography>
                    <Typography variant="h6">{gameStats.girRate}%</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="body2" color="text.secondary">平均推桿</Typography>
                    <Typography variant="h6">{gameStats.averagePutts}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="body2" color="text.secondary">三推率</Typography>
                    <Typography variant="h6">{gameStats.threePuttRate}%</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="body2" color="text.secondary">罰桿</Typography>
                    <Typography variant="h6">{gameStats.totalPenalties}</Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  尚無比賽記錄
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to="/game" 
                size="small" 
                color="primary"
              >
                記錄新比賽
              </Button>
              {gameStats && (
                <Button 
                  component={Link} 
                  to="/game/analysis" 
                  size="small" 
                  color="primary"
                >
                  查看詳細分析
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;