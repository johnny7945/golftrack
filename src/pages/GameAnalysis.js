import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Paper, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  List, ListItem, ListItemText
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
import { Bar } from 'react-chartjs-2';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

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

const GameAnalysis = () => {
  const [gameRecords, setGameRecords] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [gameStats, setGameStats] = useState(null);
  const [performanceInsights, setPerformanceInsights] = useState({
    strengths: [],
    weaknesses: []
  });

  // 載入比賽記錄
  useEffect(() => {
    const records = window.GolfDataService.getGameRecords();
    setGameRecords(records);

    if (records.length > 0) {
      setSelectedGameId(records[records.length - 1].id);
    }
  }, []);

  // 當選擇的比賽變更時，獲取統計數據
  useEffect(() => {
    if (selectedGameId) {
      const stats = window.GolfDataService.getGameStatistics(selectedGameId);
      setGameStats(stats);
      analyzePerformance(stats);
    }
  }, [selectedGameId]);

  // 分析比賽表現
  const analyzePerformance = (stats) => {
    if (!stats) return;

    const strengths = [];
    const weaknesses = [];

    // 分析 FIR
    if (parseFloat(stats.firRate) >= 70) {
      strengths.push('開球上球道率(FIR)表現優秀，保持良好的開球穩定性');
    } else if (parseFloat(stats.firRate) <= 40) {
      weaknesses.push('開球上球道率(FIR)偏低，建議加強開球穩定性');
    }

    // 分析 GIR
    if (parseFloat(stats.girRate) >= 60) {
      strengths.push('標準桿上果嶺率(GIR)表現優秀，鐵桿控制良好');
    } else if (parseFloat(stats.girRate) <= 30) {
      weaknesses.push('標準桿上果嶺率(GIR)偏低，建議加強鐵桿精準度');
    }

    // 分析推桿
    if (parseFloat(stats.averagePutts) <= 1.8) {
      strengths.push('推桿表現出色，平均每洞推桿數低');
    } else if (parseFloat(stats.averagePutts) >= 2.2) {
      weaknesses.push('推桿數偏高，建議加強短推桿練習');
    }

    // 分析三推率
    if (parseFloat(stats.threePuttRate) <= 10) {
      strengths.push('三推率低，顯示出良好的推桿距離控制');
    } else if (parseFloat(stats.threePuttRate) >= 25) {
      weaknesses.push('三推率偏高，建議加強長距離推桿的距離控制');
    }

    // 分析罰桿
    if (stats.totalPenalties <= 2) {
      strengths.push('罰桿少，顯示出良好的球場管理能力');
    } else if (stats.totalPenalties >= 5) {
      weaknesses.push('罰桿偏多，建議提高球場管理意識，避免冒險擊球');
    }

    setPerformanceInsights({ strengths, weaknesses });
  };

  // 處理比賽選擇變化
  const handleGameChange = (e) => {
    setSelectedGameId(e.target.value);
  };

  // 準備洞別成績圖表數據
  const getHoleScoreChartData = () => {
    if (!selectedGameId || !gameStats) return null;

    const selectedGame = gameRecords.find(record => record.id === selectedGameId);
    if (!selectedGame) return null;

    const holeNumbers = selectedGame.holes.map(hole => `${hole.hole}號`);
    const holeScores = selectedGame.holes.map(hole => hole.strokes);
    const holePars = selectedGame.holes.map(hole => hole.par);

    return {
      labels: holeNumbers,
      datasets: [
        {
          label: '桿數',
          data: holeScores,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Par',
          data: holePars,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          比賽分析
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          分析您的比賽表現，找出優勢與需要改進的地方
        </Typography>

        {gameRecords.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 4 }}>
            尚無比賽記錄。請先記錄您的比賽成績。
          </Typography>
        ) : (
          <Box>
            <Box sx={{ mb: 4, mt: 2 }}>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel id="game-select-label">選擇比賽</InputLabel>
                <Select
                  labelId="game-select-label"
                  value={selectedGameId}
                  label="選擇比賽"
                  onChange={handleGameChange}
                >
                  {gameRecords.map((record) => (
                    <MenuItem key={record.id} value={record.id}>
                      {new Date(record.date).toLocaleDateString()} - {record.course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {gameStats && (
              <Grid container spacing={4}>
                {/* 比賽統計卡片 */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <ScoreboardIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">比賽統計</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      
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
                    </CardContent>
                  </Card>
                </Grid>

                {/* 洞別成績圖表 */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      洞別成績
                    </Typography>
                    <Box className="chart-container">
                      <Bar 
                        data={getHoleScoreChartData()} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: '桿數'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: '洞號'
                              }
                            }
                          },
                          plugins: {
                            title: {
                              display: true,
                              text: '各洞桿數與標準桿比較'
                            }
                          }
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>

                {/* 表現分析 */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6">優勢</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      
                      {performanceInsights.strengths.length > 0 ? (
                        <List>
                          {performanceInsights.strengths.map((strength, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={strength} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          尚未發現明顯優勢，繼續努力！
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                        <Typography variant="h6">需要改進</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      
                      {performanceInsights.weaknesses.length > 0 ? (
                        <List>
                          {performanceInsights.weaknesses.map((weakness, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={weakness} />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          表現良好，沒有明顯需要改進的地方！
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* 洞別詳細數據表格 */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      洞別詳細數據
                    </Typography>
                    <TableContainer>
                      <Table className="game-record-table" size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>洞號</TableCell>
                            <TableCell>Par</TableCell>
                            <TableCell>桿數</TableCell>
                            <TableCell>推桿</TableCell>
                            <TableCell>罰桿</TableCell>
                            <TableCell>GIR</TableCell>
                            <TableCell>FIR</TableCell>
                            <TableCell>對Par</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {gameRecords.find(record => record.id === selectedGameId)?.holes.map((hole, index) => {
                            const relativeToPar = hole.strokes - hole.par;
                            let parText = '';
                            if (relativeToPar === 0) parText = 'Par';
                            else if (relativeToPar === 1) parText = 'Bogey';
                            else if (relativeToPar === 2) parText = 'Double Bogey';
                            else if (relativeToPar > 2) parText = `+${relativeToPar}`;
                            else if (relativeToPar === -1) parText = 'Birdie';
                            else if (relativeToPar === -2) parText = 'Eagle';
                            else if (relativeToPar < -2) parText = `${relativeToPar}`;

                            return (
                              <TableRow key={index}>
                                <TableCell>{hole.hole}</TableCell>
                                <TableCell>{hole.par}</TableCell>
                                <TableCell>{hole.strokes}</TableCell>
                                <TableCell>{hole.putts}</TableCell>
                                <TableCell>{hole.penalties}</TableCell>
                                <TableCell>{hole.gir ? '是' : '否'}</TableCell>
                                <TableCell>
                                  {hole.fir === null ? 'N/A' : (hole.fir ? '是' : '否')}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: relativeToPar < 0 ? 'success.main' : 
                                           relativeToPar > 0 ? 'error.main' : 'text.primary'
                                  }}
                                >
                                  {parText}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GameAnalysis;