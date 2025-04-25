import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Grid, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel,
  Switch, Alert, Card, CardContent, Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import SaveIcon from '@mui/icons-material/Save';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

const GameRecord = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courseName, setCourseName] = useState('');
  const [holeData, setHoleData] = useState(Array(18).fill().map((_, index) => ({
    hole: index + 1,
    par: 4, // 預設Par 4
    strokes: '',
    putts: '',
    penalties: 0,
    gir: false,
    fir: index === 2 || index === 5 || index === 8 || index === 11 || index === 14 || index === 17 ? null : false // Par 3洞設為null
  })));
  const [successMessage, setSuccessMessage] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [gameStats, setGameStats] = useState(null);

  // 處理球洞數據變化
  const handleHoleDataChange = (index, field, value) => {
    const newHoleData = [...holeData];
    
    // 處理不同類型的輸入
    if (field === 'gir' || field === 'fir') {
      newHoleData[index][field] = value;
    } else {
      // 數字輸入處理
      const numValue = value === '' ? '' : parseInt(value);
      newHoleData[index][field] = numValue;
    }
    
    // 更新Par值時，如果是Par 3，將FIR設為null
    if (field === 'par' && value === 3) {
      newHoleData[index].fir = null;
    } else if (field === 'par' && (value === 4 || value === 5) && newHoleData[index].fir === null) {
      newHoleData[index].fir = false;
    }
    
    setHoleData(newHoleData);
  };

  // 驗證數據
  const validateData = () => {
    if (!courseName.trim()) {
      alert('請輸入球場名稱');
      return false;
    }

    for (let i = 0; i < holeData.length; i++) {
      const hole = holeData[i];
      if (hole.strokes === '' || hole.putts === '') {
        alert(`請完成第${i + 1}洞的數據輸入`);
        return false;
      }
      
      if (hole.putts > hole.strokes) {
        alert(`第${i + 1}洞的推桿數不能大於總桿數`);
        return false;
      }
    }

    return true;
  };

  // 計算統計數據
  const calculateStats = () => {
    const par4and5Holes = holeData.filter(hole => hole.par === 4 || hole.par === 5);
    
    // 計算關鍵指標
    const totalPutts = holeData.reduce((sum, hole) => sum + hole.putts, 0);
    const totalPenalties = holeData.reduce((sum, hole) => sum + hole.penalties, 0);
    const girCount = holeData.filter(hole => hole.gir).length;
    const firCount = par4and5Holes.filter(hole => hole.fir).length;
    const threePuttCount = holeData.filter(hole => hole.putts >= 3).length;
    
    return {
      totalScore: holeData.reduce((sum, hole) => sum + hole.strokes, 0),
      totalPar: holeData.reduce((sum, hole) => sum + hole.par, 0),
      firRate: par4and5Holes.length > 0 ? (firCount / par4and5Holes.length * 100).toFixed(1) : 0,
      girRate: (girCount / holeData.length * 100).toFixed(1),
      averagePutts: (totalPutts / holeData.length).toFixed(1),
      threePuttRate: (threePuttCount / holeData.length * 100).toFixed(1),
      totalPenalties
    };
  };

  // 保存比賽記錄
  const handleSaveRecord = () => {
    if (!validateData()) return;

    // 格式化日期為 YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];

    // 創建比賽記錄對象
    const gameRecord = {
      date: formattedDate,
      course: courseName,
      holes: holeData
    };

    // 保存到數據服務
    window.GolfDataService.addGameRecord(gameRecord);

    // 計算並顯示統計數據
    const stats = calculateStats();
    setGameStats(stats);
    setShowStats(true);

    // 顯示成功消息
    setSuccessMessage('比賽記錄已成功保存！');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 重置表單
  const handleReset = () => {
    if (window.confirm('確定要重置所有數據嗎？')) {
      setCourseName('');
      setHoleData(Array(18).fill().map((_, index) => ({
        hole: index + 1,
        par: 4,
        strokes: '',
        putts: '',
        penalties: 0,
        gir: false,
        fir: index === 2 || index === 5 || index === 8 || index === 11 || index === 14 || index === 17 ? null : false
      })));
      setShowStats(false);
      setGameStats(null);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          比賽記錄
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          記錄您的18洞比賽成績，分析您的比賽表現
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="比賽日期"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="球場名稱"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            洞別成績記錄
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            請填寫每洞的詳細數據，包括總桿數、推桿數、罰桿數、是否標準桿上果嶺(GIR)和是否開球上球道(FIR)
          </Typography>
          
          <TableContainer component={Paper}>
            <Table className="game-record-table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>洞號</TableCell>
                  <TableCell>Par</TableCell>
                  <TableCell>總桿數</TableCell>
                  <TableCell>推桿數</TableCell>
                  <TableCell>罰桿數</TableCell>
                  <TableCell>GIR</TableCell>
                  <TableCell>FIR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holeData.map((hole, index) => (
                  <TableRow key={index}>
                    <TableCell>{hole.hole}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={hole.par}
                        onChange={(e) => handleHoleDataChange(index, 'par', parseInt(e.target.value))}
                        variant="standard"
                        SelectProps={{
                          native: true,
                        }}
                        sx={{ width: '60px' }}
                      >
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={hole.strokes}
                        onChange={(e) => handleHoleDataChange(index, 'strokes', e.target.value)}
                        variant="standard"
                        inputProps={{ min: 1 }}
                        sx={{ width: '60px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={hole.putts}
                        onChange={(e) => handleHoleDataChange(index, 'putts', e.target.value)}
                        variant="standard"
                        inputProps={{ min: 0 }}
                        sx={{ width: '60px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={hole.penalties}
                        onChange={(e) => handleHoleDataChange(index, 'penalties', e.target.value)}
                        variant="standard"
                        inputProps={{ min: 0 }}
                        sx={{ width: '60px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hole.gir}
                            onChange={(e) => handleHoleDataChange(index, 'gir', e.target.checked)}
                            size="small"
                          />
                        }
                        label=""
                      />
                    </TableCell>
                    <TableCell>
                      {hole.fir === null ? (
                        <Typography variant="body2" color="text.secondary">N/A</Typography>
                      ) : (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={hole.fir}
                              onChange={(e) => handleHoleDataChange(index, 'fir', e.target.checked)}
                              size="small"
                              disabled={hole.fir === null}
                            />
                          }
                          label=""
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
            >
              重置
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveRecord}
            >
              保存比賽記錄
            </Button>
          </Box>
        </Box>

        {/* 統計數據顯示 */}
        {showStats && gameStats && (
          <Card sx={{ mt: 4 }}>
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
                  <Typography variant="body2" color="text.secondary">對Par</Typography>
                  <Typography variant="h6">{gameStats.totalScore - gameStats.totalPar > 0 ? `+${gameStats.totalScore - gameStats.totalPar}` : gameStats.totalScore - gameStats.totalPar}</Typography>
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
        )}
      </Box>
    </Container>
  );
};

export default GameRecord;