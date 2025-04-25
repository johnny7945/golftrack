import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Grid, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, IconButton, Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const PracticeRecord = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [clubEntries, setClubEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    type: '',
    attempts: '',
    successes: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // 所有球桿類型
  const clubTypes = [
    '推桿', '切桿', 'P桿', '9號鐵', '8號鐵', '7號鐵', 
    '6號鐵', '5號鐵', '4號鐵', '3號木', '開球木桿'
  ];

  // 處理表單輸入變化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry({
      ...currentEntry,
      [name]: name === 'type' ? value : parseInt(value) || ''
    });
  };

  // 添加球桿記錄
  const handleAddClubEntry = () => {
    // 驗證輸入
    if (!currentEntry.type || !currentEntry.attempts || currentEntry.attempts <= 0) {
      alert('請選擇球桿類型並輸入有效的擊球次數');
      return;
    }

    if (currentEntry.successes > currentEntry.attempts) {
      alert('成功次數不能大於擊球次數');
      return;
    }

    // 檢查是否已存在相同球桿類型
    const existingIndex = clubEntries.findIndex(entry => entry.type === currentEntry.type);
    if (existingIndex !== -1) {
      // 更新現有記錄
      const updatedEntries = [...clubEntries];
      updatedEntries[existingIndex] = currentEntry;
      setClubEntries(updatedEntries);
    } else {
      // 添加新記錄
      setClubEntries([...clubEntries, currentEntry]);
    }

    // 重置當前輸入
    setCurrentEntry({
      type: '',
      attempts: '',
      successes: ''
    });
  };

  // 刪除球桿記錄
  const handleDeleteClubEntry = (index) => {
    const updatedEntries = clubEntries.filter((_, i) => i !== index);
    setClubEntries(updatedEntries);
  };

  // 保存練習記錄
  const handleSaveRecord = () => {
    if (clubEntries.length === 0) {
      alert('請至少添加一條球桿練習記錄');
      return;
    }

    // 格式化日期為 YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];

    // 創建練習記錄對象
    const practiceRecord = {
      date: formattedDate,
      clubs: clubEntries
    };

    // 保存到數據服務
    window.GolfDataService.addPracticeRecord(practiceRecord);

    // 顯示成功消息
    setSuccessMessage('練習記錄已成功保存！');
    setTimeout(() => setSuccessMessage(''), 3000);

    // 清空表單
    setClubEntries([]);
    setOpenDialog(false);
  };

  // 計算成功率
  const calculateSuccessRate = (attempts, successes) => {
    if (!attempts) return 0;
    return ((successes / attempts) * 100).toFixed(1);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          練習記錄
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          記錄您的每日練習數據，追蹤進步情況
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
                label="選擇練習日期"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              fullWidth
              sx={{ height: '56px' }}
            >
              添加球桿練習記錄
            </Button>
          </Grid>
        </Grid>

        {clubEntries.length > 0 ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              今日練習記錄
            </Typography>
            <TableContainer component={Paper}>
              <Table className="practice-table">
                <TableHead>
                  <TableRow>
                    <TableCell>球桿類型</TableCell>
                    <TableCell>擊球次數</TableCell>
                    <TableCell>成功次數</TableCell>
                    <TableCell>成功率</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clubEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell>{entry.attempts}</TableCell>
                      <TableCell>{entry.successes}</TableCell>
                      <TableCell>
                        {calculateSuccessRate(entry.attempts, entry.successes)}%
                        <Box
                          className="success-rate-indicator"
                          sx={{
                            backgroundColor: 
                              parseFloat(calculateSuccessRate(entry.attempts, entry.successes)) >= 70 ? 'green' :
                              parseFloat(calculateSuccessRate(entry.attempts, entry.successes)) >= 50 ? 'orange' : 'red',
                            width: `${calculateSuccessRate(entry.attempts, entry.successes)}%`,
                            maxWidth: '100%'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleDeleteClubEntry(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveRecord}
              sx={{ mt: 3 }}
            >
              保存練習記錄
            </Button>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ mt: 4 }}>
            尚未添加任何球桿練習記錄。點擊「添加球桿練習記錄」按鈕開始記錄。
          </Typography>
        )}
      </Box>

      {/* 添加球桿練習記錄對話框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加球桿練習記錄</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="club-type-label">球桿類型</InputLabel>
              <Select
                labelId="club-type-label"
                name="type"
                value={currentEntry.type}
                onChange={handleInputChange}
                label="球桿類型"
                required
              >
                {clubTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              label="擊球次數"
              name="attempts"
              type="number"
              value={currentEntry.attempts}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />

            <TextField
              margin="normal"
              label="成功次數"
              name="successes"
              type="number"
              value={currentEntry.successes}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
              helperText={`成功率: ${calculateSuccessRate(currentEntry.attempts, currentEntry.successes)}%`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleAddClubEntry} color="primary" variant="contained">
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PracticeRecord;