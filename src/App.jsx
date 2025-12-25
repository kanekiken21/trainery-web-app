import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ChevronRight, ArrowLeft } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095; 

// 🔥 ФИЗИКА (БЫСТРАЯ И ПЛАВНАЯ)
const iosSpring = { type: "spring", stiffness: 350, damping: 30, mass: 0.8 };
const pulse = { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] };

const T = {
  uk: {
    hello: "Привіт", subtitle: "Твій фітнес-простір",
    news_empty: "Новини готуються...", news_sub: "Зараз тут тихо, але скоро буде цікаво",
    tab_home: "Головна", tab_marathon: "Марафони", tab_health: "Здоров'я",
    m_title: "Марафони ⚡️", m_empty: "Сезон закрито 🍂", m_empty_sub: "Скоро анонсуємо нові програми",
    m_buy: "Купити", m_book: "Бронь",
    h_title: "Незабаром", h_sub: "Графіки ваги та цикл з'являться тут",
    profile: "Мій профіль", settings: "Налаштування", admin: "Адмін-панель",
    copied: "Скопійовано!", theme: "Темна тема", lang: "English Language"
  },
  en: {
    hello: "Hello", subtitle: "Your fitness space",
    news_empty: "News coming soon...", news_sub: "It's quiet here, but stay tuned",
    tab_home: "Home", tab_marathon: "Programs", tab_health: "Health",
    m_title: "Programs ⚡️", m_empty: "Season closed 🍂", m_empty_sub: "New programs coming soon",
    m_buy: "Join", m_book: "Book",
    h_title: "Coming Soon", h_sub: "Weight charts and cycle tracker here",
    profile: "My Profile", settings: "Settings", admin: "Admin Panel",
    copied: "Copied!", theme: "Dark Mode", lang: "Українська мова"
  }
};

const NEWS = []; 
const MARATHONS = []; 

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lang, setLang] = useState('uk');
  const [theme, setTheme] = useState('light');
  const [copied, setCopied] = useState(false);

  const t = (key) => T[lang][key];

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    document.body.style.overflow = 'hidden';

    const tgUser = tg.initDataUnsafe?.user;
    setUser(tgUser || { first_name: 'Чемпіонка', username: 'fit_user', id: 8297304095 });

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const copyId = (e) => {
    e.stopPropagation();
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.90 }}
      transition={{ type: "spring", stiffness: 400 }}
      onClick={onClick}
      className={`spring-btn ${className || ''}`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="app-container">
      
      {/* --- HEADER --- */}
      <header className="fixed-header">
        <motion.div 
          className="header-logo"
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={iosSpring}
        >
           <img src="/logo.png" alt="Logo" className="app-logo" style={{background: 'rgba(0,0,0,0.05)'}} />
           <h1>Trainery</h1>
        </motion.div>
        
        <motion.div 
          className="profile-bubble"
          whileTap={{ scale: 0.8 }}
          onClick={() => { setProfileOpen(true); setShowSettings(false); }}
        >
           {user?.photo_url ? <img src={user.photo_url} /> : <User size={20} />}
        </motion.div>
      </header>

      {/* --- CONTENT --- */}
      <div className="content-area">
        <LayoutGroup>
          <AnimatePresence mode="wait">
            
            {/* ГЛАВНАЯ */}
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, filter: 'blur(5px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="page"
              >
                <div className="greeting-block">
                  <h2>{t('hello')}, {user?.first_name}! 👋</h2>
                  <p>{t('subtitle')}</p>
                </div>

                <div className="news-section">
                   <motion.div layoutId="empty-news" className="empty-card glass-panel">
                      <motion.img 
                        src="/chibi.png" className="chibi-img" 
                        animate={{ y: [0, -8, 0] }} // ЛЕВИТАЦИЯ
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      />
                      <div className="empty-text">
                        <h3>{t('news_empty')}</h3>
                        <p>{t('news_sub')}</p>
                      </div>
                    </motion.div>
                </div>

                {/* НАГАДУВАННЯ УБРАНО ВРЕМЕННО */}
              </motion.div>
            )}

            {/* МАРАФОНЫ */}
            {activeTab === 'marathons' && (
              <motion.div 
                key="marathons"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={iosSpring}
                className="page"
              >
                <h2 className="page-title">{t('m_title')}</h2>
                <motion.div className="empty-card glass-panel" style={{ minHeight: '320px' }}>
                     <div className="premium-icon-box">
                        <motion.img 
                          src="/logo.png" className="prem-img" 
                          style={{ borderRadius: '16px' }}
                          animate={{ rotate: [0, 3, -3, 0] }} 
                          transition={{ repeat: Infinity, duration: 6 }}
                        />
                     </div>
                     <div className="empty-text">
                        <h3>{t('m_empty')}</h3>
                        <p>{t('m_empty_sub')}</p>
                     </div>
                </motion.div>
              </motion.div>
            )}

            {/* ЗДОРОВЬЕ */}
            {activeTab === 'health' && (
              <motion.div 
                key="health"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={iosSpring}
                className="page center-page"
              >
                <motion.div 
                  className="placeholder-circle"
                  animate={{ boxShadow: ["0 0 0 0px rgba(255,45,85,0.2)", "0 0 0 15px rgba(255,45,85,0)"] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Lock size={32} color="#FF4081" />
                </motion.div>
                <h3>{t('h_title')}</h3>
                <p>{t('h_sub')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* --- MENU ISLAND --- */}
      <div className="bottom-nav-container">
        <motion.div 
          className="nav-island"
          initial={{ y: 50 }} animate={{ y: 0 }} transition={iosSpring}
        >
          {['home', 'marathons', 'health'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
              {tab === 'home' && <Home size={24} />}
              {tab === 'marathons' && <Zap size={24} />}
              {tab === 'health' && <Activity size={24} />}
              {activeTab === tab && <motion.div layoutId="bubble" className="nav-bg-bubble" transition={iosSpring} />}
            </button>
          ))}
        </motion.div>
      </div>

      {/* --- PROFILE MODAL (SWIPEABLE) --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div 
              className="backdrop" onClick={() => setProfileOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            
            <motion.div 
              className="modal glass-panel"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={iosSpring}
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.05} // РЕЗИНКА
              onDragEnd={(_, info) => { if (info.offset.y > 100) setProfileOpen(false) }} // СВАЙП ВНИЗ ЗАКРЫВАЕТ
            >
              {/* ПОЛОСКА СВАЙПА (ДЛЯ КРАСОТЫ) */}
              <div className="modal-top">
                <motion.div className="bar" animate={{ backgroundColor: ["#e5e5ea", "#d1d1d6", "#e5e5ea"] }} transition={{ duration: 2, repeat: Infinity }} />
              </div>
              
              <AnimatePresence mode="wait" initial={false}>
                {!showSettings ? (
                  // --- ПРОФИЛЬ ---
                  <motion.div key="prof" initial={{opacity:0, x:-50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-50}} transition={iosSpring} className="profile-content">
                    
                    {/* АВАТАРКА + ЦЕНТРОВКА */}
                    <div className="profile-header-center">
                      <motion.div className="big-avatar" whileTap={{ scale: 1.1 }}>
                        {user?.photo_url ? <img src={user.photo_url}/> : <User size={40}/>}
                      </motion.div>
                      <h3>{user?.first_name}</h3>
                      <div className="username-tag">@{user?.username || 'user'}</div>
                      
                      {/* ID ПО ЦЕНТРУ */}
                      <motion.div whileTap={{ scale: 0.95 }} className="id-pill" onClick={copyId}>
                        <span>ID: {user?.id}</span>
                        {copied ? <span style={{color:'#34C759', fontWeight:'bold', marginLeft:5}}>OK</span> : <Copy size={12} style={{marginLeft:5, opacity:0.5}}/>}
                      </motion.div>
                    </div>

                    <div className="menu-list">
                      <motion.div whileTap={{scale:0.98}} className="menu-item" onClick={() => setShowSettings(true)}>
                        <Settings size={20} /> {t('settings')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                      </motion.div>
                      {user?.id === ADMIN_ID && <motion.div whileTap={{scale:0.98}} className="menu-item admin-item"><Lock size={20} /> {t('admin')}</motion.div>}
                    </div>
                  </motion.div>
                ) : (
                  // --- НАСТРОЙКИ ---
                  <motion.div key="sett" initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:50}} transition={iosSpring} className="settings-content">
                    <h3 style={{marginBottom: 20, textAlign: 'center'}}>{t('settings')}</h3>
                    
                    <motion.div whileTap={{scale:0.98}} className="menu-item" onClick={toggleTheme}>
                      {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
                      {t('theme')}
                      <div className="toggle-switch" data-active={theme === 'dark'}></div>
                    </motion.div>
                    
                    <motion.div whileTap={{scale:0.98}} className="menu-item" onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}>
                      <Globe size={20}/>
                      {t('lang')}
                    </motion.div>
                    
                    <SpringButton className="back-btn" onClick={() => setShowSettings(false)}>
                      <ArrowLeft size={20} /> Назад
                    </SpringButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;