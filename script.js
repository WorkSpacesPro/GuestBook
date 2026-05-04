// 数据存储 - 每次页面刷新后留言会消失，数据不会持久化
let messages = [];

// DOM 元素
const form = document.getElementById('guestbook-form');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const messagesList = document.getElementById('messages-list');

// 获取当前日期
function getCurrentDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// 渲染留言列表
function renderMessages() {
    if (messages.length === 0) {
        messagesList.innerHTML = '<div class="empty-message">✨ 还没有留言，来做第一个留言的人吧！</div>';
        return;
    }

    messagesList.innerHTML = messages.map((msg, index) => `
        <div class="message-card" data-index="${index}">
            <div class="message-header">
                <span class="message-name">${escapeHtml(msg.name)}</span>
                <span class="message-date">${msg.date}</span>
            </div>
            <div class="message-content">${escapeHtml(msg.content)}</div>
        </div>
    `).join('');
}

// 简单的 XSS 防护
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 添加新留言
function addMessage(name, content) {
    if (!name.trim() || !content.trim()) {
        alert('请填写姓名和留言内容');
        return false;
    }

    const newMessage = {
        id: Date.now(),
        name: name.trim(),
        content: content.trim(),
        date: getCurrentDate()
    };

    messages.unshift(newMessage); // 新留言显示在上方
    renderMessages();
    return true;
}

// 处理表单提交
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const success = addMessage(nameInput.value, messageInput.value);
    if (success) {
        nameInput.value = '';
        messageInput.value = '';
        nameInput.focus();
    }
});

// 从localStorage加载数据 (可选，但当前示例使用内存存储)
// 如果你想启用数据持久化，可以参考下面的代码
/*
function loadMessagesFromStorage() {
    const stored = localStorage.getItem('guestbook_messages');
    if (stored) {
        messages = JSON.parse(stored);
        renderMessages();
    }
}

function saveMessagesToStorage() {
    localStorage.setItem('guestbook_messages', JSON.stringify(messages));
}

// 在 addMessage 和任何修改 messages 的地方调用 saveMessagesToStorage
// 在页面加载时调用 loadMessagesFromStorage
*/

// 初始化
console.log('留言本已启动，灵感来自 whoisw.com 的动画效果！');
