import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Paper, Card, CardContent,
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Chip
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PlaceIcon from '@mui/icons-material/Place';

// 註冊 ChartJS 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GameRecordList = () => {
  const [gameRecords, setGameRecords] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);

  // 載入比賽記錄
  useEffect(() => {
    const records = window.GolfDataService.getGameRecords();
    // 按日期排序，最新的在前
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    setGameRecords(records);
  }, []);

  // 查看比賽詳情
  const handleViewGameDetails = (gameId) => {
    const game = gameRecords.find(record => record.id === gameId);
    const stats = window.GolfDataService.getGameStatistics(gameId);
    setSelectedGame({ ...game, stats });
    setOpenDialog(true);

    // 獲取該場比賽的表現數據
    preparePerformanceData(gameId);
  };

  // 準備表現數據用於圖表
  const preparePerformanceData = (gameId) => {
    // 獲取最近5場比賽的趨勢數據
    const trends = window.GolfDataService.getGameTrends(5);
    
    // 找出當前比賽在趨勢數據中的索引
    const game = gameRecords.find(record => record.id === gameId);
    const gameDate = game.date;
    const gameIndex = trends.dates.indexOf(gameDate);
    
    setPerformanceData({
      trends,
      gameIndex
    });
  };

  // 關閉對話框
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGame(null);
    setPerformanceData(null);
  };

  // 格式化日期顯示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 渲染比賽記錄列表
  const renderGameRecordsList = () => {
    if (gameRecords.length === 0) {
      return (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">尚無比賽記錄</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            請先在「比賽記錄」頁面添加您的比賽數據
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><Typography variant="subtitle2">日期</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">球場</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">總桿數</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">標準桿</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">差距</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">操作</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gameRecords.map((record) => {
              const stats = window.GolfDataService.getGameStatistics(record.id);
              const scoreDiff = stats ? stats.totalScore - stats.totalPar : 0;
              
              return (
                <TableRow key={record.id} hover>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>{record.course}</TableCell>
                  <TableCell>{stats ? stats.totalScore : '-'}</TableCell>
                  <TableCell>{stats ? stats.totalPar : '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} 
                      color={scoreDiff <= 0 ? "success" : scoreDiff > 5 ? "error" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewGameDetails(record.id)}
                    >
                      查看詳情
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // 渲染比賽詳情對話框
  const renderGameDetailsDialog = () => {
    if (!selectedGame) return null;

    const { stats } = selectedGame;
    
    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <ScoreboardIcon sx={{ mr: 1 }} />
            <Typography variant="h6">比賽詳情</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={3}>
            <Card elevation={2}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <DateRangeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">日期: {formatDate(selectedGame.date)}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <PlaceIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">球場: {selectedGame.course}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" justifyContent="flex-end">
                      <Chip 
                        label={`總桿數: ${stats.totalScore}`} 
                        color="primary" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`標準桿: ${stats.totalPar}`} 
                        color="secondary" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`差距: ${stats.totalScore - stats.totalPar > 0 ? '+' : ''}${stats.totalScore - stats.totalPar}`} 
                        color={stats.totalScore - stats.totalPar <= 0 ? "success" : "error"}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>關鍵指標</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">FIR (球道命中率)</Typography>
                      <Typography variant="h5">{stats.firRate}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">GIR (果嶺命中率)</Typography>
                      <Typography variant="h5">{stats.girRate}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">平均推桿數</Typography>
                      <Typography variant="h5">{stats.averagePutts}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">三推率</Typography>
                      <Typography variant="h5">{stats.threePuttRate}%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">罰桿數</Typography>
                      <Typography variant="h5">{stats.totalPenalties}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>洞數據</Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>洞號</TableCell>
                        <TableCell>標準桿</TableCell>
                        <TableCell>桿數</TableCell>
                        <TableCell>推桿</TableCell>
                        <TableCell>FIR</TableCell>
                        <TableCell>GIR</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedGame.holes.map((hole) => (
                        <TableRow key={hole.hole}>
                          <TableCell>{hole.hole}</TableCell>
                          <TableCell>{hole.par}</TableCell>
                          <TableCell>{hole.strokes}</TableCell>
                          <TableCell>{hole.putts}</TableCell>
                          <TableCell>
                            {hole.fir === null ? '-' : hole.fir ? '✓' : '✗'}
                          </TableCell>
                          <TableCell>
                            {hole.gir ? '✓' : '✗'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {performanceData && (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>表現趨勢</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" align="center" gutterBottom>總桿數趨勢</Typography>
                      <Box height={250}>
                        <Line 
                          data={{
                            labels: performanceData.trends.dates,
                            datasets: [{
                              label: '總桿數',
                              data: performanceData.trends.scores,
                              borderColor: 'rgb(75, 192, 192)',
                              backgroundColor: 'rgba(75, 192, 192, 0.5)',
                              tension: 0.1
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                reverse: true,
                                title: {
                                  display: true,
                                  text: '桿數 (越低越好)'
                                }
                              }
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" align="center" gutterBottom>推桿數趨勢</Typography>
                      <Box height={250}>
                        <Line 
                          data={{
                            labels: performanceData.trends.dates,
                            datasets: [{
                              label: '平均推桿數',
                              data: performanceData.trends.puttAverages,
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.5)',
                              tension: 0.1
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                reverse: true,
                                title: {
                                  display: true,
                                  text: '推桿數 (越低越好)'
                                }
                              }
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" align="center" gutterBottom>GIR趨勢</Typography>
                      <Box height={250}>
                        <Bar
                          data={{
                            labels: performanceData.trends.dates,
                            datasets: [{
                              label: 'GIR率 (%)',
                              data: performanceData.trends.girRates,
                              backgroundColor: 'rgba(153, 102, 255, 0.5)',
                              borderColor: 'rgb(153, 102, 255)',
                              borderWidth: 1
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: 'GIR率 (%) (越高越好)'
                                }
                              }
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" align="center" gutterBottom>FIR趨勢</Typography>
                      <Box height={250}>
                        <Bar
                          data={{
                            labels: performanceData.trends.dates,
                            datasets: [{
                              label: 'FIR率 (%)',
                              data: performanceData.trends.firRates,
                              backgroundColor: 'rgba(54, 162, 235, 0.5)',
                              borderColor: 'rgb(54, 162, 235)',
                              borderWidth: 1
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: 'FIR率 (%) (越高越好)'
                                }
                              }
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          <ScoreboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          比賽記錄查看
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          查看您所有的比賽記錄，並分析您的表現趨勢
        </Typography>
      </Box>

      {renderGameRecordsList()}
      {renderGameDetailsDialog()}
    </Container>
  );
};

export default GameRecordList;