/**
 * 数据管理模块
 * 统一处理 localStorage 和数据操作
 */

const DataManager = {
  // 用户相关
  setUser(username, data) {
    localStorage.setItem(`user_${username}`, JSON.stringify(data));
  },

  getUser(username) {
    const data = localStorage.getItem(`user_${username}`);
    return data ? JSON.parse(data) : null;
  },

  // 登录状态
  setLoginStatus(username) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  },

  getLoginStatus() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      username: localStorage.getItem('username') || ''
    };
  },

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  },

  // 导航历史
  addNavigationRecord(username, record) {
    const history = this.getNavigationHistory(username);
    history.unshift(record);
    if (history.length > 50) history.pop();
    localStorage.setItem(`navHistory_${username}`, JSON.stringify(history));
  },

  getNavigationHistory(username) {
    const data = localStorage.getItem(`navHistory_${username}`);
    return data ? JSON.parse(data) : [];
  },

  clearNavigationHistory(username) {
    localStorage.setItem(`navHistory_${username}`, JSON.stringify([]));
  },

  deleteNavigationRecord(username, index) {
    const history = this.getNavigationHistory(username);
    history.splice(index, 1);
    localStorage.setItem(`navHistory_${username}`, JSON.stringify(history));
  },

  // 检查是否已登录
  isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  getCurrentUsername() {
    return localStorage.getItem('username') || '';
  },

  // 收藏夹
  addFavorite(username, room) {
    const favorites = this.getFavorites(username);
    if (!favorites.find(r => r.id === room.id)) {
      favorites.push(room);
      localStorage.setItem(`favorites_${username}`, JSON.stringify(favorites));
    }
  },

  getFavorites(username) {
    const data = localStorage.getItem(`favorites_${username}`);
    return data ? JSON.parse(data) : [];
  },

  removeFavorite(username, roomId) {
    const favorites = this.getFavorites(username);
    const filtered = favorites.filter(r => r.id !== roomId);
    localStorage.setItem(`favorites_${username}`, JSON.stringify(filtered));
  },

  // 设置
  setSetting(key, value) {
    localStorage.setItem(`setting_${key}`, JSON.stringify(value));
  },

  getSetting(key, defaultValue = null) {
    const data = localStorage.getItem(`setting_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  }
};

// 导出给全局使用
if (typeof window !== 'undefined') {
  window.DataManager = DataManager;
}
