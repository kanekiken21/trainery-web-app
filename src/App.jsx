import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Sparkles, Lock, Copy, Moon, Sun, Globe, ChevronRight } from 'lucide-react';
import './App.css';

// --- НАСТРОЙКИ ---
const ADMIN_ID = 8297304095; 

// Словарь переводов
const T = {
  uk: {
    hello: "Привіт",
    subtitle: "Твій фітнес-простір",
    news_empty: "Новини готуються... 🤫",
    news_sub: "Тут з'являться корисні поради",
    tip_title: "Нагадування",
    tip_text: "Не забудь випити склянку води!",
    tab_home: "Головна",
    tab_marathon: "Марафони",
    tab_health: "Здоров'я",
    m_title: "Марафони ⚡️",
    m_empty: "Сезон закрито 🍂",
    m_empty_sub: "Скоро анонсуємо нові програми",
    m_buy: "Купити",
    m_book: "Бронь",
    h_title: "Розділ в розробці",
    h_sub: "Графіки ваги та цикл з'являться тут",
    profile: "Мій профіль",
    settings: "Налаштування",
    admin: "Адмін-панель",
    copied: "Скопійовано!",
    theme: "Темна тема",
    lang: "English Language"
  },
  en: {
    hello: "Hello",
    subtitle: "Your fitness space",
    news_empty: "News coming soon... 🤫",
    news_sub: "Useful tips will appear here",
    tip_title: "Reminder",
    tip_text: "Don't forget to drink water!",
    tab_home: "Home",
    tab_marathon: "Programs",
    tab_health: "Health",
    m_title: "Programs ⚡️",
    m_empty: "Season closed 🍂",
    m_empty_sub: "New programs coming soon",
    m_buy: "Join",
    m_book: "Book",
    h_title: "Coming Soon",
    h_sub: "Weight charts and cycle tracker here",
    profile: "My Profile",
    settings: "Settings",
    admin: "Admin Panel",
    copied: "Copied!",
    theme: "Dark Mode",
    lang: "Українська мова"
  }
};

// ДАННЫЕ (Если пусто [], будет заглушка)
const NEWS = []; 
const MARATHONS = [
  // { id: 1, type: 'standard', title: 'Жиротоп', desc: 'Старт 20.10', price: 650 },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Настройки
  const [lang, setLang] = useState('uk'); // uk | en
  const [theme, setTheme] = useState('light'); // light | dark
  const [copied, setCopied] = useState(false);

  // Хелпер для перевода
  const t = (key) => T[lang][key];

  useEffect(() => {
    // 1. Инициализация и защита от зума
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Блокируем скролл и зум на уровне документа
    document.body.style.overflow = 'hidden';

    // 2. Юзер
    const tgUser = tg.initDataUnsafe?.user;
    if (tgUser) {
      setUser(tgUser);
    } else {
      setUser({ first_name: 'Чемпіонка', username: 'fit_user', id: 8297304095 }); // Твой ID для теста
    }

    // 3. Загрузка настроек из памяти
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Переключение темы
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Копирование ID
  const copyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Компонент кнопки
  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400 }}
      onClick={onClick}
      className={`spring-btn ${className || ''}`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="app-container">
      
      {/* --- ШАПКА --- */}
      <header className="fixed-header">
        <div className="header-logo">
           {/* ЛОГОТИП БАРСА */}
           <img src="/logo.png" alt="Logo" className="app-logo" onError={(e) => e.target.style.display='none'} />
           <h1>Trainery</h1>
        </div>
        <motion.div 
          className="profile-bubble"
          whileTap={{ scale: 0.85 }}
          onClick={() => { setProfileOpen(true); setShowSettings(false); }}
        >
           {user?.photo_url ? <img src={user.photo_url} /> : <User size={20} />}
        </motion.div>
      </header>

      {/* --- КОНТЕНТ --- */}
      <div className="content-area">
        <AnimatePresence mode="wait">
          
          {/* ГЛАВНАЯ */}
          {activeTab === 'home' && (
            <motion.div 
              key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="page"
            >
              <div className="greeting-block">
                <h2>{t('hello')}, {user?.first_name}! 👋</h2>
                <p>{t('subtitle')}</p>
              </div>

              {/* Слайдер или Заглушка */}
              <div className="news-section">
                {NEWS.length > 0 ? (
                  <div className="news-slider">
                    {NEWS.map(item => (
                      <div key={item.id} className="news-card"><h3>{item.title}</h3></div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-card">
                    <img src="/chibi.png" alt="Chibi" className="chibi-img" onError={(e) => e.target.style.display='none'} />
                    {!user && <Sparkles size={32} color="#FFD700" />} {/* Если картинки нет, покажем иконку */}
                    <div className="empty-text">
                      <h3>{t('news_empty')}</h3>
                      <p>{t('news_sub')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="daily-tip">
                <span className="emoji">💧</span>
                <div className="text">
                  <b>{t('tip_title')}</b>
                  <p>{t('tip_text')}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* МАРАФОНЫ */}
          {activeTab === 'marathons' && (
            <motion.div 
              key="marathons" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="page"
            >
              <h2 className="page-title">{t('m_title')}</h2>
              
              {MARATHONS.length > 0 ? (
                MARATHONS.map((item) => (
                  <div key={item.id} className={`marathon-card ${item.type}`}>
                    <div className="m-header">
                      <h3>{item.title}</h3>
                      {item.type === 'standard' && <span className="tag">HIT 🔥</span>}
                    </div>
                    <p className="m-desc">{item.desc}</p>
                    <div className="m-footer">
                      <span className="m-price">{item.price} ₴</span>
                      <SpringButton className="m-btn">
                        {item.type === 'standard' ? t('m_buy') : t('m_book')}
                      </SpringButton>
                    </div>
                  </div>
                ))
              ) : (
                // ЗАГЛУШКА МАРАФОНОВ
                <div className="empty-card" style={{borderColor: '#FF2D55'}}>
                   <div className="premium-icon-box">
                      <img src="/premium.png" alt="Premium" className="prem-img" onError={(e) => e.target.style.display='none'}/>
                   </div>
                   <div className="empty-text">
                      <h3>{t('m_empty')}</h3>
                      <p>{t('m_empty_sub')}</p>
                   </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ЗДОРОВЬЕ */}
          {activeTab === 'health' && (
            <motion.div 
              key="health" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="page center-page"
            >
              <div className="placeholder-circle">
                <Lock size={32} color="#FF4081" />
              </div>
              <h3>{t('h_title')}</h3>
              <p>{t('h_sub')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- НИЖНЕЕ МЕНЮ --- */}
      <div className="bottom-nav-container">
        <div className="nav-island">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
            <Home size={24} />
          </button>
          <button onClick={() => setActiveTab('marathons')} className={activeTab === 'marathons' ? 'active' : ''}>
            <Zap size={24} />
          </button>
          <button onClick={() => setActiveTab('health')} className={activeTab === 'health' ? 'active' : ''}>
            <Activity size={24} />
          </button>
        </div>
      </div>

      {/* --- ПРОФИЛЬ + НАСТРОЙКИ --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div className="backdrop" onClick={() => setProfileOpen(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
            
            <motion.div className="modal" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:"spring", damping:25}}>
              <div className="modal-top" onClick={() => setProfileOpen(false)}><div className="bar"></div></div>
              
              {!showSettings ? (
                // ГЛАВНЫЙ ЭКРАН ПРОФИЛЯ
                <div className="profile-content">
                  <div className="big-avatar">
                     {user?.photo_url ? <img src={user.photo_url}/> : <User size={40}/>}
                  </div>
                  <h3>{user?.first_name}</h3>
                  
                  {/* ID с копированием */}
                  <div className="id-row" onClick={copyId}>
                    <span>ID: {user?.id}</span>
                    {copied ? <span style={{color:'#4caf50', marginLeft:5}}>{t('copied')}</span> : <Copy size={14} style={{marginLeft:5, opacity:0.5}}/>}
                  </div>

                  <div className="menu-list">
                    <div className="menu-item" onClick={() => setShowSettings(true)}>
                      <Settings size={20} /> {t('settings')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                    </div>
                    
                    {/* АДМИНКА ТОЛЬКО ДЛЯ ТЕБЯ */}
                    {user?.id === ADMIN_ID && (
                      <div className="menu-item admin-item">
                        <Lock size={20} /> {t('admin')}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // ЭКРАН НАСТРОЕК
                <div className="settings-content">
                  <h3 style={{marginBottom: 20}}>{t('settings')}</h3>
                  
                  <div className="menu-item" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
                    {t('theme')}
                    <div className="toggle-switch" data-active={theme === 'dark'}></div>
                  </div>

                  <div className="menu-item" onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}>
                    <Globe size={20}/>
                    {t('lang')}
                  </div>

                  <SpringButton className="back-btn" onClick={() => setShowSettings(false)}>
                    Назад
                  </SpringButton>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;