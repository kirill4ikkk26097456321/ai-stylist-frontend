import './styles/global.css';
import './styles/variables.css';
import './styles/style.css';
import './styles/profile.css';
import './styles/auth.css';
import './styles/tabs.css';
import './styles/sidebar.css';
import './styles/chat.css';
import './styles/fitting.css';

// URL твоего Python-сервера
const API_URL = "http://127.0.0.1:8000/api/v1";

// Глобальное состояние (анкета)
window.userProfileState = {
  name: "Надежда",
  event_goal: "Повседневный",
  budget: "Средний",
  photo: null
};

document.addEventListener('DOMContentLoaded', () => {
  
  // --- ЛОГИКА АВТОРИЗАЦИИ (РЕАЛЬНАЯ РАБОТА С БД) ---
  const authSection = document.getElementById('auth-section');
  const mainApp = document.getElementById('main-app');
  
  document.getElementById('btn-show-register').addEventListener('click', () => {
    document.getElementById('auth-choice').style.display = 'none';
    document.getElementById('auth-register').style.display = 'flex';
  });

  document.getElementById('btn-show-login').addEventListener('click', () => {
    document.getElementById('auth-choice').style.display = 'none';
    document.getElementById('auth-login').style.display = 'flex';
  });

  // Регистрация
  document.getElementById('btn-do-register').addEventListener('click', async () => {
    const name = document.getElementById('reg-name').value || "Пользователь";
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password })
      });
      if (res.ok) {
        authSection.style.display = 'none';
        mainApp.style.display = 'flex';
      } else {
        alert("Ошибка регистрации! Проверь данные.");
      }
    } catch (e) {
      console.error(e);
      alert("Сервер не отвечает. Убедись, что Python запущен!");
    }
  });

  // Вход
  document.getElementById('btn-do-login').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        authSection.style.display = 'none';
        mainApp.style.display = 'flex';
        // Обновляем UI профиля
        document.getElementById('ui-profile-username').textContent = `@${data.username}`;
      } else {
        alert("Неверный логин или пароль!");
      }
    } catch (e) {
      console.error(e);
      alert("Сервер не отвечает.");
    }
  });


  // --- НАВИГАЦИЯ ---
  const navButtons = document.querySelectorAll('.top-bar .nav-btn');
  const chatArea = document.querySelector('.chat-area');
  const plusArea = document.querySelector('.plus-area');     
  const heartArea = document.querySelector('.heart-area');   
  const profileArea = document.querySelector('.profile-area');
  const fittingScreen = document.getElementById('fitting-screen');
  const inputContainer = document.getElementById('main-input-container');
  const inputField = document.getElementById('main-input-field');

  function hideAllScreens() {
    chatArea.style.display = 'none';
    plusArea.style.display = 'none';
    heartArea.style.display = 'none';
    profileArea.style.display = 'none';
    fittingScreen.style.display = 'none';
    inputContainer.style.display = 'none';
  }

  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      hideAllScreens();
      if (index === 0) {
        chatArea.style.display = 'flex';
        inputContainer.style.display = 'flex';
        inputField.placeholder = "Спросите у ИИ — стилиста";
      }
      else if (index === 1) plusArea.style.display = 'flex';
      else if (index === 2) heartArea.style.display = 'flex';
      else if (index === 3) profileArea.style.display = 'flex';
    });
  });

  document.getElementById('btn-create-new').addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    navButtons[0].classList.add('active');
    hideAllScreens();
    chatArea.style.display = 'flex';
    inputContainer.style.display = 'flex';
  });

  // --- СБОР АНКЕТЫ И ФОТО ---
  document.querySelectorAll('.chat-option').forEach(option => {
    option.addEventListener('click', (e) => {
      if (option.id !== 'go-to-fitting-btn') {
        option.classList.toggle('active');
      }
      const key = e.target.getAttribute('data-key');
      const value = e.target.getAttribute('data-value');
      if (key && value) window.userProfileState[key] = value;
    });
  });

  const photoUpload = document.getElementById('photo-upload');
  if (photoUpload) {
    photoUpload.addEventListener('change', (e) => {
      if (e.target.files[0]) {
        window.userProfileState.photo = e.target.files[0];
        alert("Фото прикреплено!");
      }
    });
  }

  // --- РАБОТА С БЭКЕНДОМ И НЕЙРОСЕТЬЮ ---
  let selectedCount = 0;
  
  document.getElementById('go-to-fitting-btn').addEventListener('click', async () => {
    hideAllScreens();
    fittingScreen.style.display = 'flex';
    inputContainer.style.display = 'flex';
    inputField.placeholder = "ИИ генерирует образ... Ждите.";
    
    const state = window.userProfileState;
    const grid = document.getElementById('capsule-grid');
    grid.innerHTML = '<p style="text-align:center; width:100%;">Анализируем параметры и общаемся с нейросетью...</p>';

    // Собираем жесткую FormData, заполняя пустоты, чтобы FastAPI не выдал ошибку 422
    const formData = new FormData();
    formData.append('name', state.name || "Гость");
    formData.append('hair_color', state.hair_color || "Не указан");
    formData.append('eye_color', state.eye_color || "Не указан");
    formData.append('skin_tone', state.skin_tone || "Светлая");
    formData.append('undertone', state.undertone || "Холодный");
    formData.append('height', state.height || 165);
    formData.append('weight', state.weight || 55);
    formData.append('chest', state.chest || 90);
    formData.append('waist', state.waist || 60);
    formData.append('hips', state.hips || 90);
    formData.append('style_categories', state.style_categories || "Кэжуал");
    formData.append('event_goal', state.event_goal || "Повседневный");
    formData.append('feeling_goal', state.feeling_goal || "Комфортно");
    formData.append('requirements', state.requirements || "");
    formData.append('budget', state.budget || "Средний");

    if (state.photo) {
      formData.append('photo', state.photo);
    }

    try {
      // 1. Отправляем анкету на анализ
      const styleRes = await fetch(`${API_URL}/style`, {
        method: 'POST',
        body: formData
      });
      if (!styleRes.ok) throw new Error("Ошибка анализа стиля");
      const styleData = await styleRes.json();

      grid.innerHTML = '<p style="text-align:center; width:100%;">Собираем капсулу...</p>';

      // 2. Генерируем капсулу
      const capRes = await fetch(`${API_URL}/capsules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_text: styleData.analysis_text,
          event_goal: state.event_goal || "Повседневный",
          budget: state.budget || "Средний"
        })
      });
      if (!capRes.ok) throw new Error("Ошибка генерации капсулы");
      const capData = await capRes.json();

      // Очищаем сетку для результатов
      grid.innerHTML = '';
      
      // Поскольку ИИ возвращает сплошной текст, в реальном проекте мы бы парсили текст 
      // и искали ссылки через /api/v1/link. Сейчас для визуала создадим пару карточек.
      const aiItems = [
        { name: "Верх из капсулы", price: 3500, img: "https://via.placeholder.com/150/cccccc/ffffff?text=Top" },
        { name: "Низ из капсулы", price: 4200, img: "https://via.placeholder.com/150/cccccc/ffffff?text=Bottom" }
      ];

      // Отрисовываем ответ
      const hangerBadge = document.getElementById('hanger-badge');
      selectedCount = 0;
      hangerBadge.style.display = 'none';

      aiItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card selectable-item';
        card.innerHTML = `
          <div class="card-icons">
            <span class="card-heart">🤍</span>
            <div class="select-circle"></div>
          </div>
          <img src="${item.img}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-top: 8px;">
          <div style="font-size: 12px; margin-top: 5px; text-align: center;">${item.name}</div>
          <div class="card-price" style="text-align: center; margin-top: auto;">${item.price}р</div>
        `;
        
        const circle = card.querySelector('.select-circle');
        circle.addEventListener('click', () => {
          card.classList.toggle('selected');
          if (card.classList.contains('selected')) selectedCount++;
          else selectedCount--;
          
          if (selectedCount > 0) {
            hangerBadge.style.display = 'flex';
            hangerBadge.textContent = selectedCount;
          } else {
            hangerBadge.style.display = 'none';
          }
        });
        grid.appendChild(card);
      });

      inputField.placeholder = "Внести уточнения";

    } catch (err) {
      console.error(err);
      grid.innerHTML = '<p style="text-align:center; color:red; width:100%;">Ошибка связи с сервером. Запущен ли Python?</p>';
      inputField.placeholder = "Ошибка!";
    }
  });

  // Остальная логика аккордеонов и меню...
  document.querySelectorAll('.section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (content) content.style.display = content.style.display === 'none' ? 'flex' : 'none';
    });
  });

  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  }
  document.getElementById('open-sidebar-btn').addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
  });
  document.getElementById('close-sidebar-btn').addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

});