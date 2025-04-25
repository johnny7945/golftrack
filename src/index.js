import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import golfDataService from './services/GolfDataService';

// 將GolfDataService設置為全局變數，讓所有組件都能訪問
window.GolfDataService = golfDataService;

// 初始化一些示範數據（如果本地存儲為空）
if (golfDataService.getGoals().length === 0) {
  // 練球目標數據
  const initialGoals = [
    { type: '練習次數', target: '每天100球', reminder: true },
    { type: '準確度', target: '7號鐵70%成功率', reminder: true },
    { type: '擊球距離', target: '開球木桿250碼', reminder: false }
  ];
  
  initialGoals.forEach(goal => golfDataService.addGoal(goal));
}

if (golfDataService.getPracticeRecords().length === 0) {
  // 練習記錄數據
  const initialPracticeRecords = [
    {
      date: '2023-05-01',
      clubs: [
        { type: '推桿', attempts: 50, successes: 35 },
        { type: '7號鐵', attempts: 30, successes: 18 },
        { type: '開球木桿', attempts: 20, successes: 12 }
      ]
    },
    {
      date: '2023-05-02',
      clubs: [
        { type: '推桿', attempts: 40, successes: 30 },
        { type: '7號鐵', attempts: 35, successes: 22 },
        { type: '開球木桿', attempts: 25, successes: 15 }
      ]
    }
  ];
  
  initialPracticeRecords.forEach(record => golfDataService.addPracticeRecord(record));
}

if (golfDataService.getGameRecords().length === 0) {
  // 比賽記錄數據
  const initialGameRecord = {
    date: '2023-05-10',
    course: '陽明高爾夫球場',
    holes: [
      { hole: 1, par: 4, strokes: 5, putts: 2, penalties: 0, gir: false, fir: true },
      { hole: 2, par: 3, strokes: 3, putts: 1, penalties: 0, gir: true, fir: null },
      { hole: 3, par: 5, strokes: 7, putts: 3, penalties: 1, gir: false, fir: false },
      { hole: 4, par: 4, strokes: 5, putts: 2, penalties: 0, gir: false, fir: true },
      { hole: 5, par: 3, strokes: 4, putts: 2, penalties: 0, gir: false, fir: null },
      { hole: 6, par: 5, strokes: 6, putts: 2, penalties: 0, gir: true, fir: true },
      { hole: 7, par: 4, strokes: 4, putts: 1, penalties: 0, gir: true, fir: true },
      { hole: 8, par: 3, strokes: 3, putts: 1, penalties: 0, gir: true, fir: null },
      { hole: 9, par: 4, strokes: 5, putts: 2, penalties: 0, gir: false, fir: false },
      { hole: 10, par: 4, strokes: 6, putts: 3, penalties: 1, gir: false, fir: false },
      { hole: 11, par: 3, strokes: 4, putts: 2, penalties: 0, gir: false, fir: null },
      { hole: 12, par: 5, strokes: 7, putts: 2, penalties: 1, gir: false, fir: false },
      { hole: 13, par: 4, strokes: 5, putts: 2, penalties: 0, gir: false, fir: true },
      { hole: 14, par: 3, strokes: 3, putts: 1, penalties: 0, gir: true, fir: null },
      { hole: 15, par: 5, strokes: 6, putts: 2, penalties: 0, gir: true, fir: true },
      { hole: 16, par: 4, strokes: 5, putts: 2, penalties: 0, gir: false, fir: false },
      { hole: 17, par: 3, strokes: 4, putts: 2, penalties: 0, gir: false, fir: null },
      { hole: 18, par: 4, strokes: 5, putts: 2, penalties: 0, gir: false, fir: true }
    ]
  };
  
  golfDataService.addGameRecord(initialGameRecord);
}

// 創建React根元素並渲染應用程序
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);