import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Sparkles, Lock, Copy, Moon, Sun, Globe, ChevronRight } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095; 

// 🌊 iOS PHYSICS (Настройка "Дорогой" анимации)
const iosSpring = { type: "spring", stiffness: 400, damping: 30, mass: 1 };
const bounce = { type: "spring", stiffness: 500, damping: 15 }; // Для кнопок

// СЛОВАРЬ
const T = {
  uk: {
    hello: "Привіт", subtitle: "Твій фітнес-простір",
    news_empty: "Новини готуються...", news_sub: "Зараз тут тихо, але скоро буде цікаво",
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
    news_empty: "News coming soon...", news_sub: "It's quiet here, but stay tuned",
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

    // Загрузка данных
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

  // Пружинная кнопка с защитой от "дребезга"
  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.85 }}
      transition={bounce}
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
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={iosSpring}
        >
           <motion.img 
             src="/logo.png" alt="Logo" className="app-logo" 
             whileTap={{ rotate: 10, scale: 0.9 }}
             onError={(e) => e.target.style.display='none'} 
           />
           <h1>Trainery</h1>
        </motion.div>
        
        <motion.div 
          className="profile-bubble"
          whileTap={{ scale: 0.8 }} transition={bounce}
          onClick={() => { setProfileOpen(true); setShowSettings(false); }}
        >
           {user?.photo_url ? <img src={user.photo_url} /> : <User size={20} />}
        </motion.div>
      </header>

      {/* --- CONTENT --- */}
      <div className="content-area">
        {/* LayoutGroup позволяет элементам плавно менять размер при смене табов */}
        <LayoutGroup>
          <AnimatePresence mode="wait">
            
            {/* ГЛАВНАЯ */}
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.3 }}
                className="page"
              >
                <motion.div layout className="greeting-block">
                  <AnimatePresence mode="wait">
                    <motion.h2 
                      key={lang + 'h2'} // Анимация при смене языка
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    >
                      {t('hello')}, {user?.first_name}! 👋
                    </motion.h2>
                  </AnimatePresence>
                  <p>{t('subtitle')}</p>
                </motion.div>

                {/* Блок новостей с фиксированной высотой (чтобы не прыгал) */}
                <motion.div layout className="news-section">
                  {NEWS.length > 0 ? (
                    <div className="news-slider">
                      {NEWS.map(item => (
                        <div key={item.id} className="news-card"><h3>{item.title}</h3></div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      layoutId="empty-news" 
                      className="empty-card glass-panel"
                    >
                      {/* ЛЕТАЮЩИЙ ЧИБИ */}
                      <motion.img 
                        src="/chibi.png" alt="Chibi" className="chibi-img" 
                        animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }} 
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        onError={(e) => e.target.style.display='none'} 
                      />
                      <div className="empty-text">
                        <motion.h3 key={lang+'t1'} initial={{opacity:0}} animate={{opacity:1}}>{t('news_empty')}</motion.h3>
                        <motion.p key={lang+'t2'} initial={{opacity:0}} animate={{opacity:1}}>{t('news_sub')}</motion.p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div layout className="daily-tip glass-panel">
                  <span className="emoji">💧</span>
                  <div className="text">
                    <motion.b key={lang+'tip1'} initial={{opacity:0}} animate={{opacity:1}}>{t('tip_title')}</motion.b>
                    <motion.p key={lang+'tip2'} initial={{opacity:0}} animate={{opacity:1}}>{t('tip_text')}</motion.p>
                  </div>
                </motion.div>
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
                <motion.h2 layout className="page-title">{t('m_title')}</motion.h2>
                
                {MARATHONS.length > 0 ? (
                   MARATHONS.map((item) => (<div>...</div>))
                ) : (
                  <motion.div layout className="empty-card glass-panel" style={{ minHeight: '300px' }}>
                     <div className="premium-icon-box">
                        <motion.img 
                          src="/logo.png" alt="Logo" className="prem-img" 
                          style={{ borderRadius: '12px' }}
                          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }} 
                          transition={{ repeat: Infinity, duration: 3 }}
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
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={iosSpring}
                className="page center-page"
              >
                <motion.div 
                  className="placeholder-circle"
                  animate={{ boxShadow: ["0 0 0 0px rgba(255,45,85,0.2)", "0 0 0 20px rgba(255,45,85,0)"] }}
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
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, ...iosSpring }}
        >
          {['home', 'marathons', 'health'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
              {tab === 'home' && <Home size={24} />}
              {tab === 'marathons' && <Zap size={24} />}
              {tab === 'health' && <Activity size={24} />}
              
              {activeTab === tab && (
                <motion.div 
                  layoutId="bubble" 
                  className="nav-bg-bubble"
                  transition={iosSpring}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* --- PROFILE MODAL --- */}
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
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.1}
              onDragEnd={(_, info) => { if (info.offset.y > 80) setProfileOpen(false) }}
            >
              <div className="modal-top"><div className="bar"></div></div>
              
              {!showSettings ? (
                <motion.div key="prof" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="profile-content">
                  <div className="big-avatar">
                     {user?.photo_url ? <img src={user.photo_url}/> : <User size={40}/>}
                  </div>
                  <h3>{user?.first_name}</h3>
                  <motion.div whileTap={{scale:0.95}} className="id-row" onClick={copyId}>
                    <span>ID: {user?.id}</span>
                    {copied && <span style={{color:'#34C759', marginLeft:5}}>{t('copied')}</span>}
                  </motion.div>

                  <div className="menu-list">
                    <motion.div whileTap={{scale:0.98}} className="menu-item" onClick={() => setShowSettings(true)}>
                      <Settings size={20} /> {t('settings')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    {user?.id === ADMIN_ID && <motion.div whileTap={{scale:0.98}} className="menu-item admin-item"><Lock size={20} /> {t('admin')}</motion.div>}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="sett" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="settings-content">
                  <h3 style={{marginBottom: 20}}>{t('settings')}</h3>
                  <motion.div layout whileTap={{scale:0.98}} className="menu-item" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
                    {t('theme')}
                    <div className="toggle-switch" data-active={theme === 'dark'}></div>
                  </motion.div>
                  <motion.div layout whileTap={{scale:0.98}} className="menu-item" onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}>
                    <Globe size={20}/>
                    {t('lang')}
                  </motion.div>
                  <SpringButton className="back-btn" onClick={() => setShowSettings(false)}>Back</SpringButton>
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