// 数据管理模块 - 统一管理��有数据存储和操作

const DataManager = {
    // 用户相关
    setUser: (username, email, password) => {
        const userData = {
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(`user_${username}`, JSON.stringify(userData));
    },

    getUser: (username) => {
        const data = localStorage.getItem(`user_${username}`);
        return data ? JSON.parse(data) : null;
    },

    userExists: (username) => {
        return localStorage.getItem(`user_${username}`) !== null;
    },

    // 登录状态
    setLoginState: (username, isLoggedIn = true) => {
        localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
        localStorage.setItem('username', username);
    },

    getLoginState: () => {
        return {
            isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
            username: localStorage.getItem('username') || ''
        };
    },

    logout: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
    },

    // 导航历史
    addNavigationHistory: (username, record) => {
        const history = JSON.parse(localStorage.getItem(`navHistory_${username}`) || '[]');
        history.unshift({
            start: record.start,
            end: record.end,
            floor: record.floor || '3D导航',
            distance: record.distance || 0,
            date: new Date().toLocaleDateString('zh-CN'),
            timestamp: Date.now()
        });
        if (history.length > 50) history.pop();
        localStorage.setItem(`navHistory_${username}`, JSON.stringify(history));
    },

    getNavigationHistory: (username) => {
        return JSON.parse(localStorage.getItem(`navHistory_${username}`) || '[]');
    },

    clearNavigationHistory: (username) => {
        localStorage.removeItem(`navHistory_${username}`);
    },

    deleteNavigationRecord: (username, index) => {
        const history = DataManager.getNavigationHistory(username);
        history.splice(index, 1);
        localStorage.setItem(`navHistory_${username}`, JSON.stringify(history));
    },

    // 用户偏好设置
    setPreference: (username, key, value) => {
        const prefs = JSON.parse(localStorage.getItem(`prefs_${username}`) || '{}');
        prefs[key] = value;
        localStorage.setItem(`prefs_${username}`, JSON.stringify(prefs));
    },

    getPreference: (username, key, defaultValue = null) => {
        const prefs = JSON.parse(localStorage.getItem(`prefs_${username}`) || '{}');
        return prefs[key] !== undefined ? prefs[key] : defaultValue;
    },

    // 数据验证
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePassword: (password) => {
        return password && password.length >= 6;
    },

    validateUsername: (username) => {
        return username && username.length >= 3 && username.length <= 20;
    },

    // 清理所有数据（开发调试用）
    clearAllData: () => {
        if (confirm('确定要清除所有数据吗？')) {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.includes('user_') || key.includes('navHistory_') || key.includes('prefs_') ||
                    key === 'isLoggedIn' || key === 'username') {
                    localStorage.removeItem(key);
                }
            });
            alert('所有数据已清除');
        }
    }
};

// 导出供全局使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
