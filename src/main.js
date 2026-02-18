import './styles/global.css';
import './styles/variables.css';
import './styles/style.css';
import './styles/profile.css';
import './styles/auth.css';
import './styles/tabs.css';
import './styles/sidebar.css';
import './styles/chat.css';
import './styles/fitting.css';

document.addEventListener('DOMContentLoaded', () => {
  
  const authSection = document.getElementById('auth-section');
  const mainApp = document.getElementById('main-app');
  const authChoice = document.getElementById('auth-choice');
  const authRegister = document.getElementById('auth-register');
  const authLogin = document.getElementById('auth-login');

  document.getElementById('btn-show-register').addEventListener('click', () => {
    authChoice.style.display = 'none';
    authRegister.style.display = 'flex';
  });

  document.getElementById('btn-show-login').addEventListener('click', () => {
    authChoice.style.display = 'none';
    authLogin.style.display = 'flex';
  });

  function enterApp() {
    authSection.style.display = 'none';
    mainApp.style.display = 'flex';
  }

  document.getElementById('btn-do-register').addEventListener('click', enterApp);
  document.getElementById('btn-do-login').addEventListener('click', enterApp);

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
    inputField.placeholder = "Спросите у ИИ — стилиста";
  });

  document.getElementById('chat-send-btn').addEventListener('click', () => {
    inputField.value = '';
  });

  document.getElementById('go-to-fitting-btn').addEventListener('click', () => {
    hideAllScreens();
    fittingScreen.style.display = 'flex';
    inputContainer.style.display = 'flex';
    inputField.placeholder = "Внести уточнения";
  });

  const sectionBtns = document.querySelectorAll('.section-btn');
  sectionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (content && content.classList.contains('section-content')) {
        content.style.display = content.style.display === 'none' ? 'flex' : 'none';
      }
    });
  });

  const openSidebarBtn = document.getElementById('open-sidebar-btn');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  }
  openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
  });
  closeSidebarBtn.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.chat-option').forEach(option => {
    option.addEventListener('click', () => option.classList.toggle('active'));
  });

  const selectableCards = document.querySelectorAll('.selectable-item');
  const hangerBadge = document.getElementById('hanger-badge');
  let selectedCount = 0;

  selectableCards.forEach(card => {
    const circle = card.querySelector('.select-circle');
    circle.addEventListener('click', () => {
      card.classList.toggle('selected');
      if (card.classList.contains('selected')) {
        selectedCount++;
      } else {
        selectedCount--;
      }
      
      if (selectedCount > 0) {
        hangerBadge.style.display = 'flex';
        hangerBadge.textContent = selectedCount;
      } else {
        hangerBadge.style.display = 'none';
      }
    });
  });

  const filtersModal = document.getElementById('filters-modal');
  const filtersOverlay = document.getElementById('filters-overlay');
  
  function closeFilters() {
    filtersModal.classList.remove('active');
    filtersOverlay.classList.remove('active');
  }

  document.getElementById('open-filters-btn').addEventListener('click', () => {
    filtersModal.classList.add('active');
    filtersOverlay.classList.add('active');
  });
  
  document.getElementById('apply-filters-btn').addEventListener('click', closeFilters);
  document.getElementById('reset-filters-btn').addEventListener('click', closeFilters);
  filtersOverlay.addEventListener('click', closeFilters);

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

});