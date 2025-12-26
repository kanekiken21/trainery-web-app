import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, PawPrint } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

// 🔥 НОВА, БІЛЬШ ПРУЖИНА ФІЗИКА
const ultraSpring = { type: "spring", stiffness: 400, damping: 25, mass: 1 };

const T = {
  uk: {
    hello: "Привіт", subtitle: "Твій особистий фітнес-простір ✨",
    news_empty: "Тут поки тихо...", news_sub: "Але скоро з'являться гарячі новини 🔥",
    m_title: "Програми ⚡️", m_empty: "Запис закрито 🍂", m_empty_sub: "Чекай на анонси нових марафонів!",
    h_title: "В розробці 🛠️", h_sub: "Тут будуть твої графіки ваги та календар",
    profile: "Мій профіль", settings: "Налаштування", admin: "Адмін-панель",
    copied: "Скопійовано!", theme: "Темна тема", lang: "English Language",
    socials: "Спільнота", comm_channel_bot: "Канал Trainery", comm_channel_mom: "Канал Juls", insta: "Instagram"
  },
  en: {
    hello: "Hello", subtitle: "Your personal fitness space ✨",
    news_empty: "It's quiet here...", news_sub: "But hot news is coming soon 🔥",
    m_title: "Programs ⚡️", m_empty: "Closed 🍂", m_empty_sub: "Wait for new marathon announcements!",
    h_title: "Coming Soon 🛠️", h_sub: "Your weight charts will be here",
    profile: "My Profile", settings: "Settings", admin: "Admin Panel",
    copied: "Copied!", theme: "Dark Mode", lang: "Українська мова",
    socials: "Community", comm_channel_bot: "Trainery Channel", comm_channel_mom: "Juls Channel", insta: "Instagram"
  }
};

function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lang, setLang] = useState('uk');
  const [theme, setTheme] = useState('light');
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState({ logo: false, chibi: false, premium: false });

  const t = (key) => T[lang][key];

  useEffect(() => {
    setTimeout(() => setLoading(false), 2200);
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    // Більше не блокуємо body тут, це робить CSS
    // document.body.style.overflow = 'hidden';

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

  const handleLink = (url, isTelegram = false) => {
    if (isTelegram) window.Telegram.WebApp.openTelegramLink(url);
    else window.Telegram.WebApp.openLink(url);
  };

  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
      transition={ultraSpring} onClick={onClick} className={`spring-btn ${className || ''}`}
    >
      {children}
    </motion.button>
  );

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="loading-screen" exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.4 }}>
             {!imgError.logo ? (
               <motion.img
                 src="1.png" className="loading-logo"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 onError={() => setImgError(prev => ({...prev, logo: true}))}
               />
             ) : (
               <Zap size={64} color="#7B3494" />
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`app-container ${isProfileOpen ? 'blurred' : ''}`}>

        <header className="fixed-header">
          <motion.div className="header-logo" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={ultraSpring}>
             {!imgError.logo ? <img src="1.png" className="app-logo" onError={() => setImgError(prev => ({...prev, logo: true}))}/> : <div className="app-logo-fallback"><Zap size={20} color="white"/></div>}
             <h1>Trainery</h1>
          </motion.div>
          <motion.div className="profile-bubble" whileTap={{ scale: 0.9 }} onClick={() => { setProfileOpen(true); setShowSettings(false); }}>
             {user?.photo_url ? <img src={user.photo_url} /> : <User size={24} />}
          </motion.div>
        </header>

        <div className="content-area">
          <LayoutGroup>
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div key="home" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={ultraSpring} className="page">
                  <div className="greeting-block">
                    <AnimatePresence mode="wait">
                      <motion.h2 key={lang} initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} transition={ultraSpring}>{t('hello')}, {user?.first_name}! 👋</motion.h2>
                    </AnimatePresence>
                    <p>{t('subtitle')}</p>
                  </div>
                  <div className="empty-card glass-panel">
                      {!imgError.chibi ? (
                        <motion.img src="2.png" className="chibi-img" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} onError={() => setImgError(prev => ({...prev, chibi: true}))} />
                      ) : (
                        <div className="icon-fallback"><Sparkles size={50} color="#7B3494"/></div>
                      )}
                      <div className="empty-text"><h3>{t('news_empty')}</h3><p>{t('news_sub')}</p></div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'marathons' && (
                <motion.div key="marathons" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={ultraSpring} className="page">
                  <h2 className="page-title">{t('m_title')}</h2>
                  <motion.div className="empty-card glass-panel" style={{ minHeight: '320px' }}>
                       {!imgError.premium ? (
                         <motion.img src="3.png" className="prem-img" style={{borderRadius: 16}} animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 6 }} onError={() => setImgError(prev => ({...prev, premium: true}))} />
                       ) : (
                         // Тут використано іконку, яка буде світлішати в темній темі завдяки CSS
                         <div className="icon-fallback"><PawPrint size={50} /></div>
                       )}
                       <div className="empty-text"><h3>{t('m_empty')}</h3><p>{t('m_empty_sub')}</p></div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'health' && (
                <motion.div key="health" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={ultraSpring} className="page center-page">
                  <motion.div className="placeholder-circle" animate={{ boxShadow: ["0 0 0 0px rgba(123, 52, 148, 0.2)", "0 0 0 20px rgba(123, 52, 148, 0)"] }} transition={{ repeat: Infinity, duration: 2 }}><Lock size={32} color="#7B3494" /></motion.div>
                  <h3>{t('h_title')}</h3><p>{t('h_sub')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>

        <div className="bottom-nav-container">
          <motion.div className="nav-island" initial={{ y: 50 }} animate={{ y: 0 }} transition={ultraSpring}>
            {['home', 'marathons', 'health'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
                {tab === 'home' && <Home size={24} />}
                {tab === 'marathons' && <Zap size={24} />}
                {tab === 'health' && <Activity size={24} />}
                {activeTab === tab && <motion.div layoutId="bubble" className="nav-bg-bubble" transition={ultraSpring} />}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div className="backdrop" onClick={() => setProfileOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            {/* МОДАЛКА З НОВОЮ АНІМАЦІЄЮ ПОЯВИ */}
            <motion.div
              className="modal glass-panel"
              layout
              initial={{ y: '110%', scale: 0.95 }} // Починаємо трохи нижче і менше
              animate={{ y: 0, scale: 1 }} // Виїжджаємо і збільшуємось
              exit={{ y: '110%', scale: 0.95 }}
              transition={ultraSpring}
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.1}
              onDragEnd={(_, info) => { if (info.offset.y > 100) setProfileOpen(false) }}
            >
              <div className="modal-content-wrapper">
                <div className="modal-top" onClick={() => setProfileOpen(false)}><div className="bar"></div></div>

                <AnimatePresence mode="wait" initial={false}>
                  {!showSettings ? (
                    // ПРОФИЛЬ
                    <motion.div
                      key="prof"
                      initial={{opacity:0, x:-50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-50}}
                      transition={ultraSpring}
                      className="profile-content"
                    >
                      <div className="profile-header-center">
                        <div className="big-avatar">{user?.photo_url ? <img src={user.photo_url}/> : <User size={48} />}</div>
                        <h3>{user?.first_name}</h3>
                        <div className="username-tag">@{user?.username || 'user'}</div>
                        <motion.div whileTap={{ scale: 0.95 }} className="id-pill" onClick={copyId}><span>ID: {user?.id}</span>{copied ? <span style={{color:'#7B3494', fontWeight:'bold', marginLeft:5}}>OK</span> : <Copy size={12} style={{marginLeft:5, opacity:0.5}}/>}</motion.div>
                      </div>

                      <div className="menu-list">
                        <motion.div whileTap={{scale:0.98}} className="menu-item" onClick={() => setShowSettings(true)}>
                          <Settings size={20} /> {t('settings')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                        </motion.div>
                        {user?.id === ADMIN_ID && <motion.div whileTap={{scale:0.98}} className="menu-item admin-item"><Lock size={20} /> {t('admin')}</motion.div>}
                      </div>
                    </motion.div>
                  ) : (
                    // НАСТРОЙКИ
                    <motion.div
                      key="sett"
                      initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:50}}
                      transition={ultraSpring}
                      className="settings-content"
                    >
                      <h3 style={{marginBottom: 15, textAlign: 'center'}}>{t('settings')}</h3>

                      <div className="settings-group">
                          <motion.div layout whileTap={{scale:0.98}} className="menu-item" onClick={toggleTheme}>
                          {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
                          {t('theme')}
                          <div className="toggle-switch" data-active={theme === 'dark'}></div>
                          </motion.div>

                          <motion.div layout whileTap={{scale:0.98}} className="menu-item" onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}>
                          <Globe size={20}/>
                          {t('lang')}
                          <div className="lang-badge">{lang.toUpperCase()}</div>
                          </motion.div>
                      </div>

                      <h4 style={{margin: '20px 0 10px', opacity: 0.5, fontSize: 13, paddingLeft: 10}}>{t('socials')}</h4>
                      <div className="settings-group">
                          <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://www.instagram.com/hharbarr?igsh=NmM3bjBnejlpMHpl&utm_source=qr', false)}>
                              <Instagram size={20} color="#E1306C" /> {t('insta')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                          </motion.div>
                          <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://t.me/trainery_community', true)}>
                              <Users size={20} color="#0088cc" /> {t('comm_channel_bot')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                          </motion.div>
                          <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://t.me/julschannelua', true)}>
                              <Send size={20} color="#0088cc" /> {t('comm_channel_mom')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/>
                          </motion.div>
                      </div>

                      <SpringButton className="back-btn" onClick={() => setShowSettings(false)}>
                        <ArrowLeft size={20} /> Назад
                      </SpringButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;