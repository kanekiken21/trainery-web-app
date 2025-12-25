import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Sparkles, Lock, Copy, Moon, Sun, Globe, ChevronRight } from 'lucide-react';
import './App.css';

// --- НАСТРОЙКИ ---
const ADMIN_ID = 8297304095; 

// ⚙️ ГЛАВНАЯ ПРУЖИНА (ФИЗИКА)
// stiffness: жесткость (выше = резче), damping: сопротивление (ниже = больше качается)
const spring = { type: "spring", stiffness: 350, damping: 25 };
const softSpring = { type: "spring", stiffness: 200, damping: 20 };

// СЛОВАРЬ
const T = {
  uk: {
    hello: "Привіт", subtitle: "Твій фітнес-простір",
    news_empty: "Новини готуються...", news_sub: "Тут з'являться корисні поради",
    tip_title: "Нагадування", tip_text: "Не забудь випити склянку води!",
    tab_home: "Головна", tab_marathon: "Марафони", tab_health: "Здоров'я",
    m_title: "Марафони ⚡️", m_empty: "Сезон закрито 🍂", m_empty_sub: "Скоро анонсуємо нові програми",
    m_buy: "Купити", m_book: "Бронь",
    h_title: "Незабаром", h_sub: "Графіки ваги та цикл з'являться тут",
    profile: "Мій профіль", settings: "Налаштування", admin: "Адмін-панель",
    copied: "Скопійовано!", theme: "Темна тема", lang: "English Language"
  },
  en: {
    hello: "Hello", subtitle: "Your fitness space",
    news_empty: "News coming soon...", news_sub: "Useful tips will appear here",
    tip_title: "Reminder", tip_text: "Don't forget to drink water!",
    tab_home: "Home", tab_marathon: "Programs", tab_health: "Health",
    m_title: "Programs ⚡️", m_empty: "Season closed 🍂", m_empty_sub: "New programs coming soon",
    m_buy: "Join", m_book: "Book",
    h_title: "Coming Soon", h_sub: "Weight charts and cycle tracker here",
    profile: "My Profile", settings: "Settings", admin: "Admin Panel",
    copied: "Copied!", theme: "Dark Mode", lang: "Українська мова"
  }
};

const NEWS = []; 
const MARATHONS = []; // Оставь пустым для проверки "чиби" заглушки

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

  const copyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Кнопка с сильной отдачей
  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.90 }}
      transition={spring}
      onClick={onClick}
      className={`spring-btn ${className || ''}`}
    >
      {children}
    </motion.button>
  );

  // Варианты анимации для Списка (чтобы вылетали по очереди)
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 } // Задержка между элементами
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: spring }
  };

  return (
    <div className="app-container">
      
      {/* --- HEADER --- */}
      <header className="fixed-header">
        <motion.div 
          className="header-logo"
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={softSpring}
        >
           <img src="/logo.png" alt="Logo" className="app-logo" onError={(e) => e.target.style.display='none'} />
           <h1>Trainery</h1>
        </motion.div>
        
        <motion.div 
          className="profile-bubble"
          whileTap={{ scale: 0.8 }} transition={spring}
          onClick={() => { setProfileOpen(true); setShowSettings(false); }}
        >
           {user?.photo_url ? <img src={user.photo_url} /> : <User size={20} />}
        </motion.div>
      </header>

      {/* --- CONTENT --- */}
      <div className="content-area">
        <AnimatePresence mode="wait">
          
          {/* ГЛАВНАЯ */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              variants={listVariants} initial="hidden" animate="show" exit="hidden"
              className="page"
            >
              <motion.div variants={itemVariants} className="greeting-block">
                <h2>{t('hello')}, {user?.first_name}! 👋</h2>
                <p>{t('subtitle')}</p>
              </motion.div>

              <motion.div variants={itemVariants} className="news-section">
                {NEWS.length > 0 ? (
                  <div className="news-slider">
                    {NEWS.map(item => (
                      <div key={item.id} className="news-card"><h3>{item.title}</h3></div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-card glass-panel">
                    <motion.img 
                      src="/chibi.png" alt="Chibi" className="chibi-img" 
                      animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} // ЛЕГКОЕ ПАРЕНИЕ
                      onError={(e) => e.target.style.display='none'} 
                    />
                    {!user && <Sparkles size={32} color="#FFD700" />}
                    <div className="empty-text">
                      <h3>{t('news_empty')}</h3>
                      <p>{t('news_sub')}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="daily-tip glass-panel">
                <span className="emoji">💧</span>
                <div className="text">
                  <b>{t('tip_title')}</b>
                  <p>{t('tip_text')}</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* МАРАФОНЫ */}
          {activeTab === 'marathons' && (
            <motion.div 
              key="marathons"
              variants={listVariants} initial="hidden" animate="show" exit="hidden"
              className="page"
            >
              <motion.h2 variants={itemVariants} className="page-title">{t('m_title')}</motion.h2>
              
              {MARATHONS.length > 0 ? (
                MARATHONS.map((item) => (
                  <motion.div variants={itemVariants} key={item.id} className={`marathon-card ${item.type}`}>
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
                  </motion.div>
                ))
              ) : (
                <motion.div variants={itemVariants} className="empty-card glass-panel" style={{borderColor: 'rgba(255,45,85,0.2)'}}>
                   <div className="premium-icon-box">
                      <motion.img 
                        src="/premium.png" alt="Premium" className="prem-img" 
                        animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                        onError={(e) => e.target.style.display='none'}
                      />
                   </div>
                   <div className="empty-text">
                      <h3>{t('m_empty')}</h3>
                      <p>{t('m_empty_sub')}</p>
                   </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ЗДОРОВЬЕ */}
          {activeTab === 'health' && (
            <motion.div 
              key="health"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={spring}
              className="page center-page"
            >
              <motion.div 
                className="placeholder-circle"
                animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              >
                <Lock size={32} color="#FF4081" />
              </motion.div>
              <h3>{t('h_title')}</h3>
              <p>{t('h_sub')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- НИЖНЕЕ МЕНЮ (ISLAND) --- */}
      <div className="bottom-nav-container">
        <motion.div 
          className="nav-island"
          initial={{ y: 50 }} animate={{ y: 0 }} transition={{ delay: 0.5, ...spring }}
        >
          {['home', 'marathons', 'health'].map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
              {tab === 'home' && <Home size={24} />}
              {tab === 'marathons' && <Zap size={24} />}
              {tab === 'health' && <Activity size={24} />}
              
              {activeTab === tab && (
                <motion.div 
                  layoutId="bubble" 
                  className="nav-bg-bubble"
                  transition={spring}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* --- ПРОФИЛЬ + НАСТРОЙКИ --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div 
              className="backdrop" 
              onClick={() => setProfileOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            
            <motion.div 
              className="modal glass-panel"
              initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
              transition={spring}
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2} 
              onDragEnd={(_, info) => { if (info.offset.y > 100) setProfileOpen(false) }}
            >
              <div className="modal-top"><div className="bar"></div></div>
              
              {!showSettings ? (
                <motion.div 
                  key="main-profile"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="profile-content"
                >
                  <div className="big-avatar">
                     {user?.photo_url ? <img src={user.photo_url}/> : <User size={40}/>}
                  </div>
                  <h3>{user?.first_name}</h3>
                  
                  <motion.div whileTap={{ scale: 0.95 }} className="id-row" onClick={copyId}>
                    <span>ID: {user?.id}</span>
                    {copied ? <span style={{color:'#34C759', marginLeft:5}}>{t('copied')}</span> : <Copy size={14} style={{marginLeft:5, opacity:0.5}}/>}
                  </motion.div>

                  <div className="menu-list">
                    <motion.div whileTap={{ scale: 0.98 }} className="menu-item" onClick={() => setShowSettings(true)}>
                      <Settings size={20} /> {t('settings')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    
                    {user?.id === ADMIN_ID && (
                      <motion.div whileTap={{ scale: 0.98 }} className="menu-item admin-item">
                        <Lock size={20} /> {t('admin')}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="settings-content"
                >
                  <h3 style={{marginBottom: 20}}>{t('settings')}</h3>
                  
                  <motion.div whileTap={{ scale: 0.98 }} className="menu-item" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
                    {t('theme')}
                    <div className="toggle-switch" data-active={theme === 'dark'}></div>
                  </motion.div>

                  <motion.div whileTap={{ scale: 0.98 }} className="menu-item" onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}>
                    <Globe size={20}/>
                    {t('lang')}
                  </div>

                  <SpringButton className="back-btn" onClick={() => setShowSettings(false)}>
                    Назад
                  </SpringButton>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;