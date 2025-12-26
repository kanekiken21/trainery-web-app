import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, Scale, CalendarHeart, Utensils } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;
const spring = { type: "spring", stiffness: 350, damping: 30 };

const T = {
  uk: {
    hello: "Привіт", subtitle: "Твій особистий фітнес-простір ✨",
    news_empty: "Тут поки тихо...", news_sub: "Але скоро з'являться гарячі новини 🔥",
    m_title: "Програми ⚡️", m_empty: "Запис закрито 🍂", m_empty_sub: "Чекай на анонси нових марафонів!",
    h_title: "Здоров'я ❤️", h_sub: "Твій контроль тіла",
    profile: "Профіль", settings: "Налаштування", admin: "Адмін-панель",
    copied: "Скопійовано!", theme: "Темна", lang: "English",
    socials: "Спільнота", comm_channel_bot: "Канал Trainery", comm_channel_mom: "Канал Juls", insta: "Instagram",
    card_cal: "Калорії", card_cal_sub: "Лічильник КБЖВ",
    card_cycle: "Мій цикл", card_cycle_sub: "Календар та прогнози",
    card_body: "Заміри тіла", card_body_sub: "Трекер прогресу"
  },
  en: {
    hello: "Hello", subtitle: "Your personal fitness space ✨",
    news_empty: "It's quiet here...", news_sub: "But hot news is coming soon 🔥",
    m_title: "Programs ⚡️", m_empty: "Closed 🍂", m_empty_sub: "Wait for new marathon announcements!",
    h_title: "Health ❤️", h_sub: "Body control",
    profile: "Profile", settings: "Settings", admin: "Admin Panel",
    copied: "Copied!", theme: "Dark", lang: "Ukrainian",
    socials: "Community", comm_channel_bot: "Trainery Channel", comm_channel_mom: "Juls Channel", insta: "Instagram",
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
    const tgUser = tg.initDataUnsafe?.user;
    setUser(tgUser || { first_name: 'Чемпіонка', username: 'fit_user', id: 8297304095 });
    document.documentElement.setAttribute('data-theme', 'light');
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

  const handleLink = (url, isTg) => {
    if (isTg) window.Telegram.WebApp.openTelegramLink(url);
    else window.Telegram.WebApp.openLink(url);
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="loading-screen" exit={{ opacity: 0 }}>
             {!imgError.logo ? <motion.img src="1.png" className="loading-logo" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} onError={() => setImgError(p=>({...p, logo:true}))} /> : <Zap size={80} color="#7B3494"/>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`app-container ${isProfileOpen ? 'blurred' : ''}`}>
        
        <div className="particles-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <header className="fixed-header">
          <div style={{width: 48}}></div>
          <div className="header-center">
             {!imgError.logo ? <img src="1.png" className="app-logo" onError={() => setImgError(p=>({...p, logo:true}))} /> : <Zap color="#7B3494"/>}
             <h1 className="gradient-text">Trainery</h1>
          </div>
          <div className="profile-btn-wrap">
            <motion.div className="profile-bubble" whileTap={{ scale: 0.9 }} onClick={() => { setProfileOpen(true); setShowSettings(false); }}>
               {user?.photo_url ? <img src={user.photo_url} /> : <User size={24} />}
            </motion.div>
          </div>
        </header>

        <div className="content-area">
          <LayoutGroup>
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div key="home" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={spring} className="page">
                  <div className="greeting-block">
                    <h2>{t('hello')}, {user?.first_name}! 👋</h2>
                    <p>{t('subtitle')}</p>
                  </div>
                  <div className="empty-card glass-panel">
                      {!imgError.chibi ? <motion.img src="2.png" className="chibi-img" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} onError={() => setImgError(p=>({...p, chibi:true}))} /> : <Sparkles size={60} color="#7B3494"/>}
                      <div className="empty-text"><h3>{t('news_empty')}</h3><p>{t('news_sub')}</p></div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'marathons' && (
                <motion.div key="marathons" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={spring} className="page">
                  <h2 className="page-title">{t('m_title')}</h2>
                  <motion.div className="empty-card glass-panel" style={{ minHeight: '320px' }}>
                       {!imgError.premium ? <motion.img src="1.png" className="prem-img" animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 6 }} onError={() => setImgError(p=>({...p, premium:true}))} /> : <Zap size={60} color="#7B3494"/>}
                       <div className="empty-text"><h3>{t('m_empty')}</h3><p>{t('m_empty_sub')}</p></div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'health' && (
                <motion.div key="health" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={spring} className="page">
                  <h2 className="page-title">{t('h_title')}</h2>
                  
                  <motion.div whileTap={{scale:0.98}} className="health-card" style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
                    <div className="decorative-circle"></div>
                    <div className="h-text"><h3>{t('card_cal')}</h3><p>{t('card_cal_sub')}</p></div><Utensils size={32} />
                  </motion.div>

                  <motion.div whileTap={{scale:0.98}} className="health-card" style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
                    <div className="decorative-circle"></div>
                    <div className="h-text"><h3>{t('card_cycle')}</h3><p>{t('card_cycle_sub')}</p></div><CalendarHeart size={32} />
                  </motion.div>

                  <motion.div whileTap={{scale:0.98}} className="health-card" style={{background:'linear-gradient(135deg, #84fab0, #8fd3f4)'}}>
                    <div className="decorative-circle"></div>
                    <div className="h-text"><h3>{t('card_body')}</h3><p>{t('card_body_sub')}</p></div><Scale size={32} />
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
            <motion.div className="backdrop" onClick={() => setProfileOpen(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
            <motion.div 
              className="modal" 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.1}
              onDragEnd={(_, info) => { if (info.offset.y > 100) setProfileOpen(false) }}
            >
              <div className="modal-header-fixed" onClick={() => setProfileOpen(false)}><div className="bar"></div></div>

              <div className="modal-scrollable-content">
                <AnimatePresence mode="wait" initial={false}>
                  {!showSettings ? (
                    <motion.div key="p" initial={{x:-50, opacity:0}} animate={{x:0, opacity:1}} exit={{x:-50, opacity:0}} transition={spring} className="profile-center">
                      <div className="big-avatar-wrapper">
                         <div className="big-avatar-glow"></div>
                         <div className="big-avatar">{user?.photo_url ? <img src={user.photo_url}/> : <User size={50} />}</div>
                      </div>
                      <h3>{user?.first_name}</h3>
                      <div className="username-tag">@{user?.username || 'user'}</div>
                      <div className="id-pill" onClick={copyId}><span>ID: {user?.id}</span> {copied ? <span style={{color:'green'}}>OK</span> : <Copy size={12}/>}</div>
                      
                      <div className="menu-list" style={{marginTop: 30}}>
                        <div className="menu-item" onClick={() => setShowSettings(true)}><Settings size={20}/> {t('settings')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.5}}/></div>
                        {user?.id === ADMIN_ID && <div className="menu-item admin-item"><Lock size={20}/> {t('admin')}</div>}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="s" initial={{x:50, opacity:0}} animate={{x:0, opacity:1}} exit={{x:50, opacity:0}} transition={spring} className="settings-content">
                      <h3 style={{textAlign:'center', marginBottom: 20}}>{t('settings')}</h3>
                      
                      {/* НОВАЯ СЕТКА КНОПОК */}
                      <div className="settings-grid">
                        <div className="menu-item menu-item-center" onClick={toggleTheme}>
                           {theme==='light'?<Moon size={24}/>:<Sun size={24}/>} 
                           <span style={{fontSize:13}}>{t('theme')}</span>
                           <div className="toggle-switch" data-active={theme==='dark'}></div>
                        </div>
                        <div className="menu-item menu-item-center" onClick={() => setLang(lang==='uk'?'en':'uk')}>
                           <Globe size={24}/>
                           <span style={{fontSize:13}}>{t('lang')}</span>
                           <div style={{fontWeight:'bold', opacity:0.5}}>{lang.toUpperCase()}</div>
                        </div>
                      </div>
                      
                      <h4 style={{marginTop: 20, marginBottom: 10, opacity: 0.5, fontSize: 13, paddingLeft: 10}}>{t('socials')}</h4>
                      <div className="menu-list">
                        <div className="menu-item social-item" onClick={() => handleLink('https://www.instagram.com/hharbarr?igsh=NmM3bjBnejlpMHpl&utm_source=qr', false)}><Instagram size={22} color="#E1306C"/> {t('insta')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/></div>
                        <div className="menu-item social-item" onClick={() => handleLink('https://t.me/trainery_community', true)}><Users size={22} color="#0088cc"/> {t('comm_channel_bot')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/></div>
                        <div className="menu-item social-item" onClick={() => handleLink('https://t.me/julschannelua', true)}><Send size={22} color="#0088cc"/> {t('comm_channel_mom')} <ChevronRight size={16} style={{marginLeft:'auto', opacity:0.3}}/></div>
                      </div>

                      <motion.div className="back-btn" whileTap={{scale:0.95}} onClick={() => setShowSettings(false)}>
                        <ArrowLeft size={20}/> Назад
                      </motion.div>
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