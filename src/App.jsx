import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, CalendarHeart, Utensils, Scale, Dumbbell, HeartPulse, ShieldCheck, Flame } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

const spring = { type: "spring", stiffness: 300, damping: 25 };
const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: spring } };

const T = {
  uk: {
    hello: "Привіт, Чемпіонко!", sub: "Твій простір сили ✨",
    m_title: "Марафони", m_sub: "Шлях до мети",
    h_title: "Здоров'я", h_sub: "Твій контроль",
    empty_news: "Тут поки тихо...", empty_sub: "Скоро будуть новини 🔥",
    m_closed: "Запис закрито", m_wait: "Чекай на анонси!",
    prof: "Профіль", set: "Налаштування", adm: "Адмін",
    theme: "Темна тема", lang: "English",
    insta: "Instagram", tg_bot: "Канал Trainery", tg_mom: "Канал Juls",
    cal: "Калорії", cyc: "Цикл", bod: "Заміри", 
    menu: "Меню" // НОВЫЙ ЗАГОЛОВОК
  },
  en: {
    hello: "Hello, Champion!", sub: "Your power space ✨",
    m_title: "Programs", m_sub: "Path to goal",
    h_title: "Health", h_sub: "Your control",
    empty_news: "Quiet here...", empty_sub: "News coming soon 🔥",
    m_closed: "Closed now", m_wait: "Wait for announcements!",
    prof: "Profile", set: "Settings", adm: "Admin",
    theme: "Dark Mode", lang: "Ukrainian",
    insta: "Instagram", tg_bot: "Trainery Channel", tg_mom: "Juls Channel",
    cal: "Calories", cyc: "Cycle", bod: "Body", 
    menu: "Menu" // НОВЫЙ ЗАГОЛОВОК
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  
  // ИНИЦИАЛИЗАЦИЯ ИЗ ПАМЯТИ
  const [lang, setLangState] = useState(() => localStorage.getItem('app_lang') || 'uk');
  const [theme, setThemeState] = useState(() => localStorage.getItem('app_theme') || 'light');
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  // Функции с сохранением
  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('app_lang', l);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const t = (key) => T[lang][key];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    const tg = window.Telegram.WebApp;
    tg.ready(); tg.expand();
    setUser(tg.initDataUnsafe?.user || { first_name: 'User', username: 'user', id: 8297304095 });

    return () => clearInterval(interval);
  }, []);

  const handleLink = (url, isTg) => {
    if(isTg) window.Telegram.WebApp.openTelegramLink(url);
    else window.Telegram.WebApp.openLink(url);
  };

  const copyId = () => {
    if(user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="noise-overlay"></div>
      <div className="ambient-bg"></div>

      <AnimatePresence>
        {loading && (
          <motion.div className="loading-screen" exit={{ opacity: 0 }}>
             {!imgErr ? <img src="1.png" className="loading-logo-img" onError={()=>setImgErr(true)}/> : <Zap size={80} color="#8B5CF6"/>}
             <div className="progress-container">
               <div className="progress-bar" style={{width: `${progress}%`}}></div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-container">
        
        {['home', 'marathons', 'health'].includes(activeTab) && (
          <header className="fixed-header">
            <div></div>
            <div className="header-center">
              {!imgErr ? <img src="1.png" className="app-logo" onError={()=>setImgErr(true)}/> : <Zap color="#8B5CF6"/>}
              <span className="header-title">Trainery</span>
            </div>
            <motion.div className="profile-btn" whileTap={{scale:0.9}} onClick={() => setActiveTab('profile')}>
              {user?.photo_url ? <img src={user.photo_url}/> : <User size={22}/>}
            </motion.div>
          </header>
        )}

        <div className="content-area">
          <AnimatePresence mode="wait">
            
            {activeTab === 'home' && (
              <motion.div key="home" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}>
                  <h2>{t('hello')}</h2>
                  <p>{t('sub')}</p>
                </motion.div>
                <motion.div className="glass-card" variants={itemVars}>
                  <div className="icon-glow-container"><Sparkles size={55}/></div>
                  <h3>{t('empty_news')}</h3><p>{t('empty_sub')}</p>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'marathons' && (
              <motion.div key="marathons" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}>
                  <h2>{t('m_title')}</h2>
                  <p>{t('m_sub')}</p>
                </motion.div>
                <motion.div className="glass-card" variants={itemVars}>
                  <div className="icon-glow-container" style={{background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 10px 30px rgba(217, 119, 6, 0.4)'}}><Dumbbell size={55}/></div>
                  <h3>{t('m_closed')}</h3><p>{t('m_wait')}</p>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'health' && (
              <motion.div key="health" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}>
                  <h2>{t('h_title')}</h2>
                  <p>{t('h_sub')}</p>
                </motion.div>
                <motion.div variants={itemVars}>
                  {/* БАННЕР 1: КАЛОРИИ (ОГОНЬ) */}
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-1"></div></div>
                    <div className="health-text"><h3>{t('cal')}</h3></div>
                    <div className="health-icon-anim"><Flame size={32}/></div>
                  </motion.div>
                  
                  {/* БАННЕР 2: ЦИКЛ */}
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-2"></div></div>
                    <div className="health-text"><h3>{t('cyc')}</h3></div>
                    <div className="health-icon-anim"><CalendarHeart size={32}/></div>
                  </motion.div>
                  
                  {/* БАННЕР 3: ЗАМЕРЫ */}
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-1" style={{left:-20}}></div></div>
                    <div className="health-text"><h3>{t('bod')}</h3></div>
                    <div className="health-icon-anim"><Scale size={32}/></div>
                  </motion.div>
                  
                  {/* БАННЕР 4: МЕНЮ (НОВЫЙ) */}
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #36D1DC, #5B86E5)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-2" style={{top: -20, right: 20}}></div></div>
                    <div className="health-text"><h3>{t('menu')}</h3></div>
                    <div className="health-icon-anim"><Utensils size={32}/></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ПРОФИЛЬ */}
            {activeTab === 'profile' && (
              <motion.div key="profile" className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25, stiffness:300}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('home')}><ArrowLeft size={24}/></motion.div>
                  <div className="page-nav-title">{t('prof')}</div>
                  <div></div>
                </div>
                <div className="scroll-content">
                  <img src={user?.photo_url} className="avatar-big" />
                  <h2 className="user-name">{user?.first_name}</h2>
                  <p className="user-handle">@{user?.username}</p>
                  <motion.div className="id-chip" whileTap={{scale:0.95}} onClick={copyId}>
                    <ShieldCheck size={16}/> ID: {user?.id} {copied && "✓"}
                  </motion.div>

                  <div className="menu-stack">
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setActiveTab('settings')}>
                      <Settings size={24}/> {t('set')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    {user?.id === ADMIN_ID && 
                      <motion.div className="menu-row" whileTap={{scale:0.98}} style={{color: 'var(--accent)'}}>
                        <Lock size={24}/> {t('adm')}
                      </motion.div>
                    }
                  </div>
                </div>
              </motion.div>
            )}

            {/* НАСТРОЙКИ */}
            {activeTab === 'settings' && (
              <motion.div key="settings" className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25, stiffness:300}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('profile')}><ArrowLeft size={24}/></motion.div>
                  <div className="page-nav-title">{t('set')}</div>
                  <div></div>
                </div>
                <div className="scroll-content">
                  <div className="settings-grid">
                    <motion.div className="grid-item" whileTap={{scale:0.95}} onClick={toggleTheme}>
                      {theme==='light'?<Moon size={32}/>:<Sun size={32}/>} {t('theme')}
                    </motion.div>
                    <motion.div className="grid-item" whileTap={{scale:0.95}} onClick={()=>setLang(lang==='uk'?'en':'uk')}>
                      <Globe size={32}/> {lang.toUpperCase()}
                    </motion.div>
                  </div>

                  <h4 style={{width:'100%', opacity:0.5, marginBottom:12, paddingLeft:5, fontWeight: 700}}>Community</h4>
                  <div className="menu-stack">
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://www.instagram.com/hharbarr?igsh=NmM3bjBnejlpMHpl&utm_source=qr', false)}>
                      <Instagram size={24} color="#E1306C"/> {t('insta')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/trainery_community', true)}>
                      <Users size={24} color="#0088cc"/> {t('tg_bot')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/julschannelua', true)}>
                      <Send size={24} color="#0088cc"/> {t('tg_mom')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {['home', 'marathons', 'health'].includes(activeTab) && (
          <div className="bottom-nav">
            <div className="nav-island">
              <button onClick={()=>setActiveTab('home')} className={`nav-btn ${activeTab==='home'?'active':''}`}><Home size={26}/></button>
              <button onClick={()=>setActiveTab('marathons')} className={`nav-btn ${activeTab==='marathons'?'active':''}`}><Zap size={26}/></button>
              <button onClick={()=>setActiveTab('health')} className={`nav-btn ${activeTab==='health'?'active':''}`}><Activity size={26}/></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;