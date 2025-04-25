import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  CardActions, Button, CardMedia
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import BarChartIcon from '@mui/icons-material/BarChart';

const PracticeAssistant = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          練球助手
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          設定目標、記錄練習、分析進步
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* 練習目標卡片 */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card">
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FlagIcon sx={{ fontSize: 60, color: 'white' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  練習目標
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  設定您的高爾夫練習目標，包括練習次數、擊球距離、準確度等，並獲得每日提醒。
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  to="/practice/goals" 
                  size="small" 
                  color="primary"
                >
                  設定目標
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* 練習記錄卡片 */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card">
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SportsGolfIcon sx={{ fontSize: 60, color: 'white' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  練習記錄
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  記錄每天的練習數據，包括不同球桿的擊球次數和成功次數，自動計算成功率。
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  to="/practice/record" 
                  size="small" 
                  color="primary"
                >
                  記錄練習
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* 數據分析卡片 */}
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card">
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: 'info.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BarChartIcon sx={{ fontSize: 60, color: 'white' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  數據分析
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  通過圖表視覺化展示您的練習數據，包括成功率趨勢、球桿比較和弱項分析。
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  to="/practice/analysis" 
                  size="small" 
                  color="primary"
                >
                  查看分析
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            如何使用練球助手？
          </Typography>
          <Typography variant="body1" paragraph>
            1. 首先在「練習目標」中設定您想要達成的目標
          </Typography>
          <Typography variant="body1" paragraph>
            2. 每次練習後，使用「練習記錄」功能記錄您的練習數據
          </Typography>
          <Typography variant="body1" paragraph>
            3. 定期查看「數據分析」，了解您的進步情況和需要加強的地方
          </Typography>
          <Typography variant="body1">
            持續記錄和分析將幫助您更有效地提升高爾夫技能！
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PracticeAssistant;