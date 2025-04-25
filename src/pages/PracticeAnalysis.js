import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Paper, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

// 註冊 ChartJS 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PracticeAnalysis = () => {
  const [timeRange, setTimeRange] = useState('7');
  const [clubStats, setClubStats] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [recommendedClub, setRecommendedClub] = useState('');

  // 所有球桿類型
  const clubTypes = [
    '推桿', '切桿', 'P桿', '9號鐵', '8號鐵', '7號鐵', 
    '6號鐵', '5號鐵', '4號鐵', '3號木', '開球木桿'
  ];

  // 圖表顏色
  const chartColors = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(199, 199, 199, 0.6)',
    'rgba(83, 102, 255, 0.6)',
    'rgba(40, 159, 64, 0.6)',
    'rgba(210, 99, 132, 0.6)',
    'rgba(120, 192, 192, 0.6)'
  ];

  // 根據時間範圍獲取數據
  useEffect(() => {
    const days = parseInt(timeRange);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dateRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    // 獲取球桿統計數據
    const stats = window.GolfDataService.getClubSuccessRates(dateRange);
    setClubStats(stats);

    // 獲取練習記錄用於趨勢分析
    const records = window.GolfDataService.getPracticeRecords(dateRange);
    processTrendData(records);

    // 找出需要改進的球桿
    findRecommendedClub(stats);
  }, [timeRange]);

  // 處理趨勢數據
  const processTrendData = (records) => {
    // 按日期排序
    records.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 提取日期和每種球桿的成功率
    const trendData = {};
    clubTypes.forEach(type => {
      trendData[type] = {
        dates: [],
        rates: []
      };
    });

    records.forEach(record => {
      const date = new Date(record.date).toLocaleDateString();
      
      record.clubs.forEach(club => {
        if (trendData[club.type]) {
          trendData[club.type].dates.push(date);
          const rate = club.attempts > 0 ? (club.successes / club.attempts * 100).toFixed(1) : 0;
          trendData[club.type].rates.push(rate);
        }
      });
    });

    setTrendData(trendData);
  };

  // 找出需要改進的球桿
  const findRecommendedClub = (stats) => {
    const clubsWithData = Object.keys(stats).filter(type => stats[type].attempts > 0);
    
    if (clubsWithData.length === 0) {
      setRecommendedClub('');
      return;
    }

    // 找出成功率最低的球桿
    const worstClub = clubsWithData.reduce((prev, current) => {
      return parseFloat(stats[current].rate) < parseFloat(stats[prev].rate) ? current : prev;
    }, clubsWithData[0]);

    setRecommendedClub(worstClub);
  };

  // 處理時間範圍變化
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  // 準備柱狀圖數據
  const barChartData = {
    labels: Object.keys(clubStats),
    datasets: [
      {
        label: '擊球次數',
        data: Object.values(clubStats).map(stat => stat.attempts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: '成功次數',
        data: Object.values(clubStats).map(stat => stat.successes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  // 準備雷達圖數據
  const radarChartData = {
    labels: Object.keys(clubStats),
    datasets: [
      {
        label: '成功率 (%)',
        data: Object.values(clubStats).map(stat => stat.rate),
        backgroundColor: 'rgba(46, 125, 50, 0.2)',
        borderColor: 'rgba(46, 125, 50, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(46, 125, 50, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(46, 125, 50, 1)'
      }
    ]
  };

  // 準備折線圖數據 (選擇前3種有數據的球桿)
  const getLineChartData = () => {
    const clubsWithData = Object.keys(trendData).filter(
      type => trendData[type].dates.length > 0
    ).slice(0, 3);

    return {
      labels: clubsWithData.length > 0 ? trendData[clubsWithData[0]].dates : [],
      datasets: clubsWithData.map((type, index) => ({
        label: type,
        data: trendData[type].rates,
        borderColor: chartColors[index],
        backgroundColor: chartColors[index].replace('0.6', '0.1'),
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 3
      }))
    };
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          練習分析
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          分析您的練習數據，了解進步情況
        </Typography>

        <Box sx={{ mb: 4, mt: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="time-range-label">時間範圍</InputLabel>
            <Select
              labelId="time-range-label"
              value={timeRange}
              label="時間範圍"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="7">過去7天</MenuItem>
              <MenuItem value="30">過去30天</MenuItem>
              <MenuItem value="90">過去3個月</MenuItem>
              <MenuItem value="180">過去6個月</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {Object.keys(clubStats).length === 0 ? (
          <Typography variant="body1">
            所選時間範圍內沒有練習數據。請記錄您的練習或選擇其他時間範圍。
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {/* 建議卡片 */}
            {recommendedClub && (
              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      練習建議
                    </Typography>
                    <Typography variant="body1">
                      根據您的數據，建議多練習 <strong>{recommendedClub}</strong>，
                      目前成功率為 {clubStats[recommendedClub].rate}%。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* 折線圖 - 成功率趨勢 */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  成功率趨勢變化
                </Typography>
                <Box className="chart-container">
                  <Line 
                    data={getLineChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: '成功率 (%)'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: '日期'
                          }
                        }
                      },
                      plugins: {
                        title: {
                          display: true,
                          text: '球桿成功率趨勢'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.raw}%`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* 柱狀圖 - 擊球次數與成功次數 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  擊球次數與成功次數
                </Typography>
                <Box className="chart-container">
                  <Bar 
                    data={barChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: '次數'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: '球桿類型'
                          }
                        }
                      },
                      plugins: {
                        title: {
                          display: true,
                          text: '各球桿練習情況'
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* 雷達圖 - 各球桿成功率 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  各球桿成功率
                </Typography>
                <Box className="chart-container">
                  <Radar 
                    data={radarChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            stepSize: 20
                          }
                        }
                      },
                      plugins: {
                        title: {
                          display: true,
                          text: '球桿成功率雷達圖'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.raw}%`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PracticeAnalysis;