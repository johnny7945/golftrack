import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, TextField, FormControlLabel,
  Switch, Card, CardContent, IconButton, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const PracticeGoals = () => {
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    target: '',
    reminder: false
  });

  // 載入目標數據
  useEffect(() => {
    const loadedGoals = window.GolfDataService.getGoals();
    setGoals(loadedGoals);
  }, []);

  // 處理表單輸入變化
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'reminder' ? checked : value
    });
  };

  // 開啟新增目標對話框
  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormData({ type: '', target: '', reminder: false });
    setOpenDialog(true);
  };

  // 開啟編輯目標對話框
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type,
      target: goal.target,
      reminder: goal.reminder
    });
    setOpenDialog(true);
  };

  // 刪除目標
  const handleDeleteGoal = (goalId) => {
    if (window.confirm('確定要刪除此練習目標嗎？')) {
      window.GolfDataService.deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  // 提交表單
  const handleSubmit = () => {
    if (!formData.type || !formData.target) {
      alert('請填寫所有必填欄位');
      return;
    }

    if (editingGoal) {
      // 更新現有目標
      const updatedGoal = {
        ...editingGoal,
        type: formData.type,
        target: formData.target,
        reminder: formData.reminder
      };
      window.GolfDataService.updateGoal(updatedGoal);
      setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
    } else {
      // 新增目標
      const newGoal = window.GolfDataService.addGoal(formData);
      setGoals([...goals, newGoal]);
    }

    setOpenDialog(false);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          練習目標設定
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          設定您的高爾夫練習目標，提高練習效率
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddGoal}
          sx={{ mt: 2, mb: 4 }}
        >
          新增練習目標
        </Button>

        {goals.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            尚未設定任何練習目標。點擊「新增練習目標」按鈕開始設定。
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {goals.map((goal) => (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="h2" gutterBottom>
                        {goal.target}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditGoal(goal)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteGoal(goal.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      類型: {goal.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      提醒: {goal.reminder ? '開啟' : '關閉'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* 新增/編輯目標對話框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? '編輯練習目標' : '新增練習目標'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="goal-type-label">目標類型</InputLabel>
              <Select
                labelId="goal-type-label"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label="目標類型"
                required
              >
                <MenuItem value="練習次數">練習次數</MenuItem>
                <MenuItem value="擊球距離">擊球距離</MenuItem>
                <MenuItem value="準確度">準確度</MenuItem>
                <MenuItem value="自定義">自定義</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              label="目標描述"
              name="target"
              value={formData.target}
              onChange={handleInputChange}
              fullWidth
              required
              helperText="例如：每天100球、7號鐵70%成功率、開球木桿250碼"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.reminder}
                  onChange={handleInputChange}
                  name="reminder"
                  color="primary"
                />
              }
              label="每日提醒"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editingGoal ? '更新' : '新增'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PracticeGoals;