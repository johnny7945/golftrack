/**
 * 高爾夫練習助手與實戰紀錄 - 資料服務
 * 負責處理所有資料的存取、儲存和分析功能
 */

class GolfDataService {
  constructor() {
    // 初始化本地儲存
    this.initializeStorage();
  }

  /**
   * 初始化本地儲存
   */
  initializeStorage() {
    // 檢查是否已有資料，若無則初始化
    if (!localStorage.getItem('golfPracticeGoals')) {
      localStorage.setItem('golfPracticeGoals', JSON.stringify([]));
    }
    if (!localStorage.getItem('golfPracticeRecords')) {
      localStorage.setItem('golfPracticeRecords', JSON.stringify([]));
    }
    if (!localStorage.getItem('golfGameRecords')) {
      localStorage.setItem('golfGameRecords', JSON.stringify([]));
    }
  }

  // ===== 練習目標相關方法 =====

  /**
   * 獲取所有練習目標
   * @returns {Array} 練習目標列表
   */
  getGoals() {
    const goals = JSON.parse(localStorage.getItem('golfPracticeGoals') || '[]');
    return goals;
  }

  /**
   * 添加新練習目標
   * @param {Object} goalData 目標資料
   * @returns {Object} 新增的目標
   */
  addGoal(goalData) {
    const goals = this.getGoals();
    const newGoal = {
      id: Date.now(), // 使用時間戳作為唯一ID
      type: goalData.type,
      target: goalData.target,
      reminder: goalData.reminder,
      createdAt: new Date().toISOString()
    };
    goals.push(newGoal);
    localStorage.setItem('golfPracticeGoals', JSON.stringify(goals));
    return newGoal;
  }

  /**
   * 更新練習目標
   * @param {Object} updatedGoal 更新後的目標
   */
  updateGoal(updatedGoal) {
    const goals = this.getGoals();
    const index = goals.findIndex(goal => goal.id === updatedGoal.id);
    if (index !== -1) {
      goals[index] = updatedGoal;
      localStorage.setItem('golfPracticeGoals', JSON.stringify(goals));
      return true;
    }
    return false;
  }

  /**
   * 刪除練習目標
   * @param {number} goalId 目標ID
   */
  deleteGoal(goalId) {
    const goals = this.getGoals();
    const filteredGoals = goals.filter(goal => goal.id !== goalId);
    localStorage.setItem('golfPracticeGoals', JSON.stringify(filteredGoals));
    return true;
  }

  // ===== 練習記錄相關方法 =====

  /**
   * 獲取練習記錄
   * @param {Object} dateRange 日期範圍 {startDate, endDate}
   * @returns {Array} 練習記錄列表
   */
  getPracticeRecords(dateRange = null) {
    const records = JSON.parse(localStorage.getItem('golfPracticeRecords') || '[]');
    
    if (!dateRange) return records;
    
    return records.filter(record => {
      const recordDate = record.date;
      return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
    });
  }

  /**
   * 添加練習記錄
   * @param {Object} recordData 記錄資料
   */
  addPracticeRecord(recordData) {
    const records = this.getPracticeRecords();
    const newRecord = {
      id: Date.now(),
      date: recordData.date,
      clubs: recordData.clubs,
      createdAt: new Date().toISOString()
    };
    
    // 檢查是否已有同一天的記錄，如果有則更新
    const existingIndex = records.findIndex(record => record.date === recordData.date);
    if (existingIndex !== -1) {
      records[existingIndex] = newRecord;
    } else {
      records.push(newRecord);
    }
    
    localStorage.setItem('golfPracticeRecords', JSON.stringify(records));
    return newRecord;
  }

  /**
   * 刪除練習記錄
   * @param {number} recordId 記錄ID
   */
  deletePracticeRecord(recordId) {
    const records = this.getPracticeRecords();
    const filteredRecords = records.filter(record => record.id !== recordId);
    localStorage.setItem('golfPracticeRecords', JSON.stringify(filteredRecords));
    return true;
  }

  /**
   * 獲取球桿成功率統計
   * @param {Object} dateRange 日期範圍 {startDate, endDate}
   * @returns {Object} 各球桿成功率
   */
  getClubSuccessRates(dateRange = null) {
    const records = this.getPracticeRecords(dateRange);
    const clubStats = {};
    
    // 初始化所有球桿類型的統計數據
    const clubTypes = [
      '推桿', '切桿', 'P桿', '9號鐵', '8號鐵', '7號鐵', 
      '6號鐵', '5號鐵', '4號鐵', '3號木', '開球木桿'
    ];
    
    clubTypes.forEach(type => {
      clubStats[type] = {
        attempts: 0,
        successes: 0,
        rate: 0
      };
    });
    
    // 累計所有記錄中的數據
    records.forEach(record => {
      record.clubs.forEach(club => {
        if (clubStats[club.type]) {
          clubStats[club.type].attempts += club.attempts;
          clubStats[club.type].successes += club.successes;
        }
      });
    });
    
    // 計算成功率
    Object.keys(clubStats).forEach(type => {
      const stats = clubStats[type];
      if (stats.attempts > 0) {
        stats.rate = (stats.successes / stats.attempts * 100).toFixed(1);
      }
    });
    
    return clubStats;
  }

  // ===== 比賽記錄相關方法 =====

  /**
   * 獲取所有比賽記錄
   * @returns {Array} 比賽記錄列表
   */
  getGameRecords() {
    const records = JSON.parse(localStorage.getItem('golfGameRecords') || '[]');
    return records;
  }

  /**
   * 添加比賽記錄
   * @param {Object} gameData 比賽資料
   */
  addGameRecord(gameData) {
    const records = this.getGameRecords();
    const newRecord = {
      id: Date.now(),
      date: gameData.date,
      course: gameData.course,
      holes: gameData.holes,
      createdAt: new Date().toISOString()
    };
    records.push(newRecord);
    localStorage.setItem('golfGameRecords', JSON.stringify(records));
    return newRecord;
  }

  /**
   * 刪除比賽記錄
   * @param {number} recordId 記錄ID
   */
  deleteGameRecord(recordId) {
    const records = this.getGameRecords();
    const filteredRecords = records.filter(record => record.id !== recordId);
    localStorage.setItem('golfGameRecords', JSON.stringify(filteredRecords));
    return true;
  }

  /**
   * 獲取比賽統計數據
   * @param {number} gameId 比賽ID
   * @returns {Object} 統計數據
   */
  getGameStatistics(gameId) {
    const records = this.getGameRecords();
    const game = records.find(record => record.id === gameId);
    
    if (!game) return null;
    
    const holes = game.holes;
    const par4and5Holes = holes.filter(hole => hole.par === 4 || hole.par === 5);
    
    // 計算關鍵指標
    const totalPutts = holes.reduce((sum, hole) => sum + hole.putts, 0);
    const totalPenalties = holes.reduce((sum, hole) => sum + hole.penalties, 0);
    const girCount = holes.filter(hole => hole.gir).length;
    const firCount = par4and5Holes.filter(hole => hole.fir).length;
    const threePuttCount = holes.filter(hole => hole.putts >= 3).length;
    
    return {
      totalScore: holes.reduce((sum, hole) => sum + hole.strokes, 0),
      totalPar: holes.reduce((sum, hole) => sum + hole.par, 0),
      firRate: par4and5Holes.length > 0 ? (firCount / par4and5Holes.length * 100).toFixed(1) : 0,
      girRate: (girCount / holes.length * 100).toFixed(1),
      averagePutts: (totalPutts / holes.length).toFixed(1),
      threePuttRate: (threePuttCount / holes.length * 100).toFixed(1),
      totalPenalties
    };
  }

  /**
   * 獲取比賽趨勢分析
   * @param {number} count 分析的比賽數量
   * @returns {Object} 趨勢數據
   */
  getGameTrends(count = 5) {
    const records = this.getGameRecords();
    // 按日期排序，最新的在前
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 取最近的幾場比賽
    const recentGames = records.slice(0, count);
    
    // 初始化趨勢數據
    const trends = {
      dates: [],
      scores: [],
      firRates: [],
      girRates: [],
      puttAverages: []
    };
    
    // 反向遍歷，使日期按時間順序排列
    for (let i = recentGames.length - 1; i >= 0; i--) {
      const game = recentGames[i];
      const stats = this.getGameStatistics(game.id);
      
      if (stats) {
        trends.dates.push(game.date);
        trends.scores.push(stats.totalScore);
        trends.firRates.push(parseFloat(stats.firRate));
        trends.girRates.push(parseFloat(stats.girRate));
        trends.puttAverages.push(parseFloat(stats.averagePutts));
      }
    }
    
    return trends;
  }
}

// 創建全局實例
const golfDataService = new GolfDataService();

// 導出實例
export default golfDataService;