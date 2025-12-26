import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, Scale, CalendarHeart, Utensils, Dumbbell, HeartPulse } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;
const premiumSpring = { type: "spring", stiffness: 350, damping: 30, mass: 1 };

const T = {
  uk: {
    hello: "Привіт, Чемпіонко!", subtitle: "Твій простір сили та краси ✨",
    hero_m_title: "Марафони", hero_m_sub: "Твій шлях до мети",
    hero_h_title: "Здоров'я", hero_h_sub: "Контроль та турбота",
    news_empty: "Тут поки тихо...", news_sub: "Але скоро будуть гарячі новини 🔥",
    m_empty: "Запис закрито 🍂", m_empty_sub: "Чекай на анонси нових програм!",
    profile: "Профіль", settings: "Налаштування", admin: "Адмін",
    copied: "Скопійовано!", theme: "Темна тема", lang: "English",
    socials: "Спільнота", comm_bot: "Канал Trainery", comm_mom: "Канал Juls", insta: "Instagram",
    card_cal: "Калорії", card_cal_sub: "Лічильник КБЖВ",
    card_cycle: "Цикл", card_cycle_sub: "Календар та прогнози",
    card_body: "Заміри", card_body_sub: "Трекер прогресу"
  },
  en: {
    hello: "Hello, Champion!", subtitle: "Your space of power & beauty ✨",
    hero_m_title: "Marathons", hero_m_sub: "Your path to the goal",
    hero_h_title: "Health", hero_h_sub: "Control & care",
    news_empty: "Quiet here...", news_sub: "Hot news coming soon 🔥",
    m_empty: "Closed 🍂", m_empty_sub: "Wait for new program announcements!",
    profile: "Profile", settings: "Settings", admin: "Admin",
    copied: "Copied!", theme: "Dark Mode", lang: "Ukrainian",
    socials: "Community", comm_channel_bot: "Trainery Channel", comm_channel_mom: "Juls Channel", insta: "Instagram",
    card_cal: "Calories", card_cal_sub: "Nutrition tracker",
    card_cycle: "My Cycle", card_cycle_sub: "Calendar & forecast",
    card_body: "Body", card_body_sub: "Progress tracker"
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

  const handleLink = (url, isTg) => {
    if (isTg) window.Telegram.WebApp.openTelegramLink(url);
    else window.Telegram.WebApp.openLink(url);
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="loading-screen" exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}>
             <div className="loading-wrapper">
               {!imgError.logo ? <motion.img src="1.png" className="loading-logo" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} onError={() => setImgError(p=>({...p, logo:true}))} /> : <Zap size={80} color="#7B3494"/>}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div key={theme} className={`app-container ${isProfileOpen ? 'blurred' : ''}`} initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
        
        <div className="particles-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        {/* НОВЫЙ GRID ХЕДЕР */}
        <header className="fixed-header">
          <div className="header-left-spacer"></div> {/* Пустой блок для баланса */}
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
                <motion.div key="home" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={premiumSpring} className="page">
                  <div className="greeting-block">
                    <motion.h2 key={lang} initial={{opacity:0}} animate={{opacity:1}} className="gradient-text" style={{fontSize: 34, lineHeight: 1.2}}>{t('hello')}</motion.h2>
                    <p>{t('subtitle')}</p>
                  </div>
                  <motion.div whileTap={{scale: 0.98}} className="empty-card glass-panel">
                      {/* НОВАЯ ОБЕРТКА ДЛЯ СВЕЧЕНИЯ */}
                      <div className="image-glow-wrapper">
                        {!imgError.chibi ? <motion.img src="2.png" className="chibi-img" animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} onError={() => setImgError(p=>({...p, chibi:true}))} /> : <Sparkles size={70} color="#7B3494"/>}
                      </div>
                      <div className="empty-text"><h3>{t('news_empty')}</h3><p>{t('news_sub')}</p></div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'marathons' && (
                <motion.div key="marathons" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={premiumSpring} className="page">
                  {/* ИСПРАВЛЕННЫЙ HERO ЗАГОЛОВОК */}
                  <div className="hero-header">
                    <div className="hero-icon-container"><Dumbbell size={28} color="white"/></div>
                    <div className="hero-text-container"><h2 className="hero-title gradient-text">{t('hero_m_title')}</h2><p className="hero-subtitle">{t('hero_m_sub')}</p></div>
                  </div>

                  <motion.div whileTap={{scale: 0.98}} className="empty-card glass-panel" style={{ minHeight: '420px' }}>
                       {/* НОВАЯ ОБЕРТКА ДЛЯ СВЕЧЕНИЯ */}
                       <div className="image-glow-wrapper">
                          {!imgError.premium ? <motion.img src="1.png" className="prem-img" animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 6 }} onError={() => setImgError(p=>({...p, premium:true}))} /> : <Zap size={70} color="#7B3494"/>}
                       </div>
                       <div className="empty-text"><h3>{t('m_empty')}</h3><p>{t('m_empty_sub')}</p></div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'health' && (
                <motion.div key="health" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={premiumSpring} className="page">
                  {/* ИСПРАВЛЕННЫЙ HERO ЗАГОЛОВОК */}
                  <div className="hero-header">
                    <div className="hero-icon-container"><HeartPulse size={28} color="white"/></div>
                    <div className="hero-text-container"><h2 className="hero-title gradient-text">{t('hero_h_title')}</h2><p className="hero-subtitle">{t('hero_h_sub')}</p></div>
                  </div>
                  
                  <motion.div whileTap={{scale:0.97}} className="health-card" style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
                    <div className="decorative-circle"></div>
                    <div className="h-text"><h3>{t('card_cal')}</h3><p>{t('card_cal_sub')}</p></div><Utensils size={38} />
                  </motion.div>

                  <motion.div whileTap={{scale:0.97}} className="health-card" style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
                    <div className="decorative-circle"></div>
                    <div className="h-text"><h3>{t('card_cycle')}</h3><p>{t('card_cycle_sub')}</p></div><CalendarHeart size={38} />
                  </motion.div>

                  <motion.div whileTap={{scale:0.97}} className="health-card" style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
                    <div className="decorative-circle"></div>
                    <div className="h-text"><h3>{t('card_body')}</h3><p>{t('card_body_sub')}</p></div><Scale size={38} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>

        <div className="bottom-nav-container">
          <motion.div className="nav-island" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.3, stiffness: 200 }}>
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}><Home size={28} />{activeTab==='home'&&<motion.div layoutId="bub" className="nav-bg-bubble" transition={premiumSpring}/>}</button>
            <button onClick={() => setActiveTab('marathons')} className={activeTab === 'marathons' ? 'active' : ''}><Zap size={28} />{activeTab==='marathons'&&<motion.div layoutId="bub" className="nav-bg-bubble" transition={premiumSpring}/>}</button>
            <button onClick={() => setActiveTab('health')} className={activeTab === 'health' ? 'active' : ''}><Activity size={28} />{activeTab==='health'&&<motion.div layoutId="bub" className="nav-bg-bubble" transition={premiumSpring}/>}</button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div className="backdrop" onClick={() => setProfileOpen(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration: 0.3}} />
            <motion.div 
              className="modal" 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={premiumSpring}
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.y > 150) setProfileOpen(false) }}
            >
              <div className="modal-header-fixed" onClick={() => setProfileOpen(false)}><div className="bar"></div></div>

              <div className="modal-scrollable-content">
                {/* ВАЖНО: mode="wait" и ПЛАВНАЯ анимация без смещения */}
                <AnimatePresence mode="wait" initial={false}>
                  {!showSettings ? (
                    <motion.div key="p" initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.95}} transition={premiumSpring} className="profile-center">
                      <div className="big-avatar-wrapper">
                         {/* Свечение теперь через псевдо-элемент в CSS */}
                         <div className="big-avatar">{user?.photo_url ? <img src={user.photo_url}/> : <User size={50} />}</div>
                      </div>
                      <h3 className="gradient-text">{user?.first_name}</h3>
                      <div className="username-tag">@{user?.username || 'user'}</div>
                      <motion.div whileTap={{ scale: 0.95 }} className="id-pill" onClick={copyId}><span>ID: {user?.id}</span> {copied ? <span style={{color: 'var(--accent)'}}>OK</span> : <Copy size={14}/>}</motion.div>
                      
                      <div className="menu-list" style={{marginTop: 35}}>
                        <motion.div whileTap={{scale:0.98}} className="menu-item" onClick={() => setShowSettings(true)}><Settings size={22}/> {t('settings')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.4}}/></motion.div>
                        {user?.id === ADMIN_ID && <motion.div whileTap={{scale:0.98}} className="menu-item admin-item"><Lock size={22}/> {t('admin')}</motion.div>}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="s" initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale: 1}} exit={{opacity:0, scale: 0.95}} transition={premiumSpring} className="settings-content">
                      <h3 className="gradient-text" style={{textAlign:'center', marginBottom: 25}}>{t('settings')}</h3>
                      
                      <div className="settings-grid">
                        <motion.div whileTap={{scale:0.97}} className="menu-item menu-item-center" onClick={toggleTheme}>
                           {theme==='light'?<Moon size={26}/>:<Sun size={26}/>} 
                           <span style={{fontSize:14, fontWeight:700}}>{t('theme')}</span>
                           <div className="toggle-switch" data-active={theme==='dark'}></div>
                        </motion.div>
                        <motion.div whileTap={{scale:0.97}} className="menu-item menu-item-center" onClick={() => setLang(lang==='uk'?'en':'uk')}>
                           <Globe size={26}/>
                           <span style={{fontSize:14, fontWeight:700}}>{t('lang')}</span>
                           <div style={{fontWeight:'bold', opacity:0.6}}>{lang.toUpperCase()}</div>
                        </motion.div>
                      </div>
                      
                      <h4 style={{marginTop: 25, marginBottom: 12, opacity: 0.6, fontSize: 14, paddingLeft: 12, fontWeight: 700, width: '100%', maxWidth: '340px'}}>{t('socials')}</h4>
                      <div className="menu-list">
                        <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://www.instagram.com/hharbarr?igsh=NmM3bjBnejlpMHpl&utm_source=qr', false)}><Instagram size={22} color="#E1306C"/> {t('insta')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>
                        <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://t.me/trainery_community', true)}><Users size={22} color="#0088cc"/> {t('comm_channel_bot')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>
                        <motion.div whileTap={{scale:0.98}} className="menu-item social-item" onClick={() => handleLink('https://t.me/julschannelua', true)}><Send size={22} color="#0088cc"/> {t('comm_channel_mom')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>
                      </div>

                      <motion.button className="back-btn" whileTap={{scale:0.96}} onClick={() => setShowSettings(false)}>
                        <ArrowLeft size={22}/> Назад
                      </motion.button>
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