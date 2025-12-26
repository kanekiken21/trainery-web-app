import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, Scale, CalendarHeart, Utensils } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095; 

// 🔥 УЛЬТРА-ПРУЖИНА (М'якша і плавніша)
const spring = { type: "spring", stiffness: 250, damping: 25, mass: 1 };

const T = {
  uk: {
    hello: "Привіт", subtitle: "Твій особистий фітнес-простір ✨",
    news_empty: "Тут поки тихо...", news_sub: "Але скоро з'являться гарячі новини 🔥",
    m_title: "Програми ⚡️", m_empty: "Запис закрито 🍂", m_empty_sub: "Чекай на анонси нових марафонів!",
    h_title: "Здоров'я ❤️", h_sub: "Твій контроль тіла",
    profile: "Мій профіль", settings: "Налаштування", admin: "Адмін-панель",
    copied: "Скопійовано!", theme: "Темна тема", lang: "English Language",
    socials: "Спільнота", comm_channel_bot: "Канал Trainery", comm_channel_mom: "Канал Juls", insta: "Instagram",
    // ЗДОРОВ'Я
    card_cal: "Калорії", card_cal_sub: "Лічильник КБЖВ",
    card_cycle: "Мій цикл", card_cycle_sub: "Календар та прогнози",
    card_body: "Заміри тіла", card_body_sub: "Трекер прогресу"
  },
  en: {
    hello: "Hello", subtitle: "Your personal fitness space ✨",
    news_empty: "It's quiet here...", news_sub: "But hot news is coming soon 🔥",
    m_title: "Programs ⚡️", m_empty: "Closed 🍂", m_empty_sub: "Wait for new marathon announcements!",
    h_title: "Health ❤️", h_sub: "Body control",
    profile: "My Profile", settings: "Settings", admin: "Admin Panel",
    copied: "Copied!", theme: "Dark Mode", lang: "Українська мова",
    socials: "Community", comm_channel_bot: "Trainery Channel", comm_channel_mom: "Juls Channel", insta: "Instagram",
    // HEALTH
    card_cal: "Calories", card_cal_sub: "Nutrition tracker",
    card_cycle: "My Cycle", card_cycle_sub: "Calendar & forecast",
    card_body: "Body Size", card_body_sub: "Progress tracker"
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
    setTimeout(() => setLoading(false), 2000);
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Блокуємо скрол боді, скролимо тільки контент
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

  const handleLink = (url, isTelegram = false) => {
    if (isTelegram) window.Telegram.WebApp.openTelegramLink(url);
    else window.Telegram.WebApp.openLink(url);
  };

  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
      transition={spring} onClick={onClick} className={`spring-btn ${className || ''}`}
    >
      {children}
    </motion.button>
  );

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="loading-screen" exit={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.5 }}>
             {!imgError.logo ? (
               <motion.img 
                 src="1.png" className="loading-logo"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: [1, 1.1, 1], opacity: 1 }} 
                 transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                 onError={() => setImgError(prev => ({...prev, logo: true}))}
               />
             ) : (
               <Zap size={80} color="#7B3494" />
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`app-container ${isProfileOpen ? 'blurred' : ''}`}>
        
        {/* ФОНОВІ ЧАСТИНКИ (АТМОСФЕРА) */}
        <div className="particles">
          <div className="particle p1"></div>
          <div className="particle p2"></div>
          <div className="particle p3"></div>
        </div>

        <header className="fixed-header">
          <motion.div className="header-logo" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={spring}>
             {!imgError.logo ? <img src="1.png" className="app-logo" onError={() => setImgError(prev => ({...prev, logo: true}))}/> : <div className="app-logo-fallback"><Zap size={24} color="white"/></div>}
             <h1>Trainery</h1>
          </motion.div>
          <motion.div className="profile-bubble" whileTap={{ scale: 0.9 }} onClick={() => { setProfileOpen(true); setShowSettings(false); }}>
             {user?.photo_url ? <img src={user.photo_url} /> : <User size={26} />}
          </motion.div>
        </header>

        <div className="content-area">
          <LayoutGroup>
            <AnimatePresence mode="wait">
              
              {/* --- ГОЛОВНА --- */}
              {activeTab === 'home' && (
                <motion.div key="home" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={spring} className="page">
                  <div className="greeting-block">
                    <AnimatePresence mode="wait">
                      <motion.h2 key={lang} initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}}>{t('hello')}, {user?.first_name}! 👋</motion.h2>
                    </AnimatePresence>
                    <p>{t('subtitle')}</p>
                  </div>
                  <div className="empty-card glass-panel">
                      {!imgError.chibi ? (
                        <motion.img src="2.png" className="chibi-img" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} onError={() => setImgError(prev => ({...prev, chibi: true}))} />
                      ) : (
                        <div className="icon-fallback"><Sparkles size={60} /></div>
                      )}
                      <div className="empty-text"><h3>{t('news_empty')}</h3><p>{t('news_sub')}</p></div>
                  </div>
                </motion.div>
              )}

              {/* --- МАРАФОНИ --- */}
              {activeTab === 'marathons' && (
                <motion.div key="marathons" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={spring} className="page">
                  <h2 className="page-title">{t('m_title')}</h2>
                  <motion.div className="empty-card glass-panel" style={{ minHeight: '320px' }}>
                       {!imgError.premium ? (
                         <motion.img src="1.png" className="prem-img" style={{borderRadius: 16}} animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 6 }} onError={() => setImgError(prev => ({...prev, premium: true}))} />
                       ) : (
                         <div className="icon-fallback"><Zap size={60} /></div>
                       )}
                       <div className="empty-text"><h3>{t('m_empty')}</h3><p>{t('m_empty_sub')}</p></div>
                  </motion.div>
                </motion.div>
              )}

              {/* --- ЗДОРОВ'Я (НОВІ БАНЕРИ) --- */}
              {activeTab === 'health' && (
                <motion.div key="health" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={spring} className="page">
                  <h2 className="page-title">{t('h_title')}</h2>
                  
                  {/* Банер 1: Калорії */}
                  <motion.div whileTap={{ scale: 0.98 }} className="health-card glass-panel" style={{background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)'}}>
                    <div className="h-text">
                      <h3>{t('card_cal')}</h3>
                      <p>{t('card_cal_sub')}</p>
                    </div>
                    <div className="h-icon">🥗</div>
                  </motion.div>

                  {/* Банер 2: Цикл */}
                  <motion.div whileTap={{ scale: 0.98 }} className="health-card glass-panel" style={{background: 'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)'}}>
                    <div className="h-text">
                      <h3>{t('card_cycle')}</h3>
                      <p>{t('card_cycle_sub')}</p>
                    </div>
                    <div className="h-icon">🌸</div>
                  </motion.div>

                  {/* Банер 3: Тіло */}
                  <motion.div whileTap={{ scale: 0.98 }} className="health-card glass-panel" style={{background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'}}>
                    <div className="h-text">
                      <h3>{t('card_body')}</h3>
                      <p>{t('card_body_sub')}</p>
                    </div>
                    <div className="h-icon">📏</div>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>

        <div className="bottom-nav-container">
          <motion.div className="nav-island" initial={{ y: 50 }} animate={{ y: 0 }} transition={spring}>
            {['home', 'marathons', 'health'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
                {tab === 'home' && <Home size={26} />}
                {tab === 'marathons' && <Zap size={26} />}
                {tab === 'health' && <Activity size={26} />}
                {activeTab === tab && <motion.div layoutId="bubble" className="nav-bg-bubble" transition={spring} />}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div className="backdrop" onClick={() => setProfileOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div 
              className="modal glass-panel"
              layout
              initial={{ y: '110%', scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: '110%', scale: 0.96 }}
              transition={spring}
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.1}
              onDragEnd={(_, info) => { if (info.offset.y > 100) setProfileOpen(false) }}
            >
              <div className="modal-content-wrapper">
                <div className="modal-top" onClick={() => setProfileOpen(false)}><div className="bar"></div></div>
                
                <AnimatePresence mode="wait" initial={false}>
                  {!showSettings ? (
                    <motion.div key="prof" initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-30}} transition={spring} className="profile-content">
                      <div className="profile-header-center">
                        <div className="big-avatar-wrapper">
                           <div className="big-avatar">
                             {user?.photo_url ? <img src={user.photo_url}/> : <User size={50} />}
                           </div>
                        </div>
                        <h3>{user?.first_name}</h3>
                        <div className="username-tag">@{user?.username || 'user'}</div>
                        <motion.div whileTap={{ scale: 0.95 }} className="id-pill" onClick={copyId}><span>ID: {user?.id}</span>{copied ? <span style={{color:'#7B3494', fontWeight:'bold', marginLeft:5}}>OK</span> : <Copy size={14} style={{marginLeft:5, opacity:0.5}}/>}</motion.div>
                      </div>

                      <div className="menu-list">
                        <motion.div whileTap={{scale:0.98}} className="menu-item" onClick={() => setShowSettings(true)}>
                          <Settings size={22} /> {t('settings')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
                        </motion.div>
                        {user?.id === ADMIN_ID && <motion.div whileTap={{scale:0.98}} className="menu-item admin-item"><Lock size={22} /> {t('admin')}</motion.div>}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="sett" initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} exit={{opacity:0, x:30}} transition={spring} className="settings-content">
                      <h3 style={{marginBottom: 20, textAlign: 'center'}}>{t('settings')}</h3>
                      
                      <div className="settings-group">
                          <motion.div layout whileTap={{scale:0.98}} className="menu-item" onClick={toggleTheme}>
                          {theme === 'light' ? <Moon size={22}/> : <Sun size={22}/>}
                          {t('theme')}
                          <div className="toggle-switch" data-active={theme === 'dark'}></div>
                          </motion.div>
                          
                          <motion.div layout whileTap={{scale:0.98}} className="menu-item" onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}>
                          <Globe size={22}/>
                          {t('lang')}
                          <div className="lang-badge">{lang.toUpperCase()}</div>
                          </motion.div>
                      </div>

                      <h4 style={{margin: '25px 0 10px', opacity: 0.5, fontSize: 14, paddingLeft: 10}}>{t('socials')}</h4>
                      <div className="settings-group">
                          <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://www.instagram.com/hharbarr?igsh=NmM3bjBnejlpMHpl&utm_source=qr', false)}>
                              <Instagram size={22} color="#E1306C" /> {t('insta')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
                          </motion.div>
                          <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://t.me/trainery_community', true)}>
                              <Users size={22} color="#0088cc" /> {t('comm_channel_bot')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
                          </motion.div>
                          <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://t.me/julschannelua', true)}>
                              <Send size={22} color="#0088cc" /> {t('comm_channel_mom')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
                          </motion.div>
                      </div>
                      
                      <SpringButton className="back-btn" onClick={() => setShowSettings(false)}>
                        <ArrowLeft size={22} /> Назад
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