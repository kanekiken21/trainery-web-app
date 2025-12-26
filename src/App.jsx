import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, CalendarHeart, Utensils, Scale, Dumbbell, HeartPulse, ShieldCheck } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

// АНИМАЦИИ
const spring = { type: "spring", stiffness: 300, damping: 25 };
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVars = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring }
};

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
    cal: "Калорії", cyc: "Цикл", bod: "Заміри"
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
    cal: "Calories", cyc: "Cycle", bod: "Body"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('uk');
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const t = (key) => T[lang][key];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    const tg = window.Telegram.WebApp;
    tg.ready(); tg.expand();
    setUser(tg.initDataUnsafe?.user || { first_name: 'User', username: 'user', id: 8297304095 });
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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
             <Zap size={60} color="#8B5CF6"/>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-container">
        
        {/* ХЕДЕР (Только на главных) */}
        {['home', 'marathons', 'health'].includes(activeTab) && (
          <header className="fixed-header">
            <Zap size={28} color="var(--accent)"/>
            <div className="header-center">
              <span className="header-title">Trainery</span>
            </div>
            <motion.div className="profile-btn" whileTap={{scale:0.9}} onClick={() => setActiveTab('profile')}>
              {user?.photo_url ? <img src={user.photo_url}/> : <User size={20}/>}
            </motion.div>
          </header>
        )}

        <div className="content-area">
          <AnimatePresence mode="wait">
            
            {/* ГЛАВНАЯ */}
            {activeTab === 'home' && (
              <motion.div key="home" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}>
                  <h2>{t('hello')}</h2>
                  <p>{t('sub')}</p>
                </motion.div>
                <motion.div className="glass-card" variants={itemVars}>
                  <div className="icon-glow-container"><Sparkles size={50}/></div>
                  <h3>{t('empty_news')}</h3><p>{t('empty_sub')}</p>
                </motion.div>
              </motion.div>
            )}

            {/* МАРАФОНЫ */}
            {activeTab === 'marathons' && (
              <motion.div key="marathons" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}>
                  <h2>{t('m_title')}</h2>
                  <p>{t('m_sub')}</p>
                </motion.div>
                <motion.div className="glass-card" variants={itemVars}>
                  <div className="icon-glow-container" style={{background: 'linear-gradient(135deg, #F59E0B, #D97706)'}}><Dumbbell size={50}/></div>
                  <h3>{t('m_closed')}</h3><p>{t('m_wait')}</p>
                </motion.div>
              </motion.div>
            )}

            {/* ЗДОРОВЬЕ */}
            {activeTab === 'health' && (
              <motion.div key="health" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}>
                  <h2>{t('h_title')}</h2>
                  <p>{t('h_sub')}</p>
                </motion.div>
                <motion.div variants={itemVars}>
                  <div className="health-row" style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
                    <div><h3>{t('cal')}</h3><p>Kcal</p></div><Utensils size={32}/><div className="decor-blur"></div>
                  </div>
                  <div className="health-row" style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
                    <div><h3>{t('cyc')}</h3><p>28 days</p></div><CalendarHeart size={32}/><div className="decor-blur"></div>
                  </div>
                  <div className="health-row" style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
                    <div><h3>{t('bod')}</h3><p>Kg / Cm</p></div><Scale size={32}/><div className="decor-blur"></div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ПРОФИЛЬ */}
            {activeTab === 'profile' && (
              <motion.div key="profile" className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25, stiffness:300}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('home')}><ArrowLeft size={22}/></motion.div>
                  <div className="page-nav-title">{t('prof')}</div>
                  <div></div>
                </div>
                <div className="scroll-content">
                  <img src={user?.photo_url} className="avatar-big" />
                  <h2 className="user-name">{user?.first_name}</h2>
                  <p className="user-handle">@{user?.username}</p>
                  <motion.div className="id-chip" whileTap={{scale:0.95}} onClick={copyId}>
                    <ShieldCheck size={14}/> ID: {user?.id} {copied && "✓"}
                  </motion.div>

                  <div className="menu-stack">
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setActiveTab('settings')}>
                      <Settings size={22}/> {t('set')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    {user?.id === ADMIN_ID && 
                      <motion.div className="menu-row" whileTap={{scale:0.98}} style={{color: 'var(--accent)'}}>
                        <Lock size={22}/> {t('adm')}
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
                  <motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('profile')}><ArrowLeft size={22}/></motion.div>
                  <div className="page-nav-title">{t('set')}</div>
                  <div></div>
                </div>
                <div className="scroll-content">
                  <div className="settings-grid">
                    <motion.div className="grid-item" whileTap={{scale:0.95}} onClick={toggleTheme}>
                      {theme==='light'?<Moon size={28}/>:<Sun size={28}/>} {t('theme')}
                    </motion.div>
                    <motion.div className="grid-item" whileTap={{scale:0.95}} onClick={()=>setLang(lang==='uk'?'en':'uk')}>
                      <Globe size={28}/> {lang.toUpperCase()}
                    </motion.div>
                  </div>

                  <h4 style={{width:'100%', opacity:0.5, marginBottom:10, paddingLeft:5}}>{t('socials')}</h4>
                  <div className="menu-stack">
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://instagram.com', false)}>
                      <Instagram size={22} color="#E1306C"/> {t('insta')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/trainery', true)}>
                      <Users size={22} color="#0088cc"/> {t('tg_bot')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
                    </motion.div>
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/juls', true)}>
                      <Send size={22} color="#0088cc"/> {t('tg_mom')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/>
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
              <button onClick={()=>setActiveTab('home')} className={`nav-btn ${activeTab==='home'?'active':''}`}><Home size={24}/></button>
              <button onClick={()=>setActiveTab('marathons')} className={`nav-btn ${activeTab==='marathons'?'active':''}`}><Zap size={24}/></button>
              <button onClick={()=>setActiveTab('health')} className={`nav-btn ${activeTab==='health'?'active':''}`}><Activity size={24}/></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;