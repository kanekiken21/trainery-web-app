import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, CalendarHeart, Utensils, Scale, Dumbbell, HeartPulse } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

const T = {
  uk: {
    hello: "Привіт, Чемпіонко!", sub: "Твій простір сили та краси",
    m_title: "Марафони", m_sub: "Обери свій шлях до мети",
    h_title: "Здоров'я", h_sub: "Повний контроль твого тіла",
    empty_news: "Тут поки що тихо", empty_sub: "Але скоро з'являться гарячі новини",
    m_closed: "Запис закрито", m_wait: "Чекай на анонси нових програм!",
    prof: "Мій Профіль", set: "Налаштування", adm: "Адмін-панель",
    theme: "Темна тема", lang: "English",
    insta: "Instagram", tg_bot: "Канал Trainery", tg_mom: "Канал Juls",
    cal: "Калорії", cyc: "Цикл", bod: "Заміри"
  },
  en: {
    hello: "Hello, Champion!", sub: "Your space of power & beauty",
    m_title: "Programs", m_sub: "Choose your path to the goal",
    h_title: "Health", h_sub: "Full control of your body",
    empty_news: "It's quiet here yet", empty_sub: "But hot news is coming soon",
    m_closed: "Closed now", m_wait: "Wait for new program announcements!",
    prof: "My Profile", set: "Settings", adm: "Admin Panel",
    theme: "Dark Mode", lang: "Ukrainian",
    insta: "Instagram", tg_bot: "Trainery Channel", tg_mom: "Juls Channel",
    cal: "Calories", cyc: "Cycle", bod: "Body"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('uk');
  const [theme, setTheme] = useState('light');
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState(false);

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

  const copyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLink = (url, isTg) => {
    if(isTg) window.Telegram.WebApp.openTelegramLink(url);
    else window.Telegram.WebApp.openLink(url);
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="loading-screen" exit={{ opacity: 0 }}>
             {!imgErr ? <img src="1.png" className="app-logo" style={{width:80, height:80}} onError={()=>setImgErr(true)}/> : <Zap size={80} color="#7B3494"/>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app-container">
        <div className="ambient-bg"></div>

        <header className="fixed-header">
          <div></div> 
          <div className="header-center">
            {!imgErr ? <img src="1.png" className="app-logo" onError={()=>setImgErr(true)}/> : <Zap color="#7B3494"/>}
            <h1 className="header-title">Trainery</h1>
          </div>
          <div className="profile-btn" onClick={() => setShowProfile(true)}>
            {user?.photo_url ? <img src={user.photo_url}/> : <User size={22}/>}
          </div>
        </header>

        <div className="content-area">
          <AnimatePresence mode="wait">
            
            {activeTab === 'home' && (
              <motion.div key="home" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="page-header">
                  <h2 className="page-title">{t('hello')}</h2>
                  <p className="page-subtitle">{t('sub')}</p>
                </div>
                <div className="card-large">
                  {/* НОВАЯ СТАБИЛЬНАЯ ПОДКЛАДКА ВМЕСТО КАРТИНКИ */}
                  <div className="icon-container-large">
                    <Sparkles size={70} />
                  </div>
                  <h3>{t('empty_news')}</h3><p>{t('empty_sub')}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'marathons' && (
              <motion.div key="marathons" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="page-header">
                  <h2 className="page-title">{t('m_title')}</h2>
                  <p className="page-subtitle">{t('m_sub')}</p>
                </div>
                <div className="card-large">
                   <div className="icon-container-large" style={{background: 'var(--grad-warm)'}}>
                     <Dumbbell size={70} />
                   </div>
                   <h3>{t('m_closed')}</h3><p>{t('m_wait')}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'health' && (
              <motion.div key="health" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="page-header">
                  <h2 className="page-title">{t('h_title')}</h2>
                  <p className="page-subtitle">{t('h_sub')}</p>
                </div>
                <div className="health-banner" style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
                  <div><h3>{t('cal')}</h3><p>Kcal tracker</p></div><Utensils size={36}/>
                </div>
                <div className="health-banner" style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
                  <div><h3>{t('cyc')}</h3><p>Calendar & Forecast</p></div><CalendarHeart size={36}/>
                </div>
                <div className="health-banner" style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
                  <div><h3>{t('bod')}</h3><p>Measurements</p></div><Scale size={36}/>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="bottom-nav">
          <div className="nav-island">
            <button onClick={() => setActiveTab('home')} className={`nav-btn ${activeTab==='home'?'active':''}`}><Home size={26}/></button>
            <button onClick={() => setActiveTab('marathons')} className={`nav-btn ${activeTab==='marathons'?'active':''}`}><Zap size={26}/></button>
            <button onClick={() => setActiveTab('health')} className={`nav-btn ${activeTab==='health'?'active':''}`}><Activity size={26}/></button>
          </div>
        </div>

        {/* --- ЭКРАН ПРОФИЛЯ --- */}
        <AnimatePresence>
          {showProfile && (
            <motion.div className="full-screen-cover" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping: 25, stiffness: 250}}>
              <div className="cover-header">
                <div className="back-circle" onClick={() => setShowProfile(false)}><ArrowLeft size={22}/></div>
                <h2 className="cover-title">{t('prof')}</h2>
                <div></div> 
              </div>
              <div className="cover-content">
                <div className="avatar-container-stable">
                  {user?.photo_url ? <img src={user.photo_url} className="avatar-img"/> : <User size={55} color="white"/>}
                </div>
                <h3 className="user-name">{user?.first_name}</h3>
                <p className="user-tag">@{user?.username}</p>
                <div className="id-badge" onClick={copyId}>ID: {user?.id} {copied ? <span style={{color:'var(--accent)'}}>OK</span> : <Copy size={14}/>}</div>
                
                <div className="menu-list" style={{marginTop: 35}}>
                  <div className="menu-btn" onClick={() => setShowSettings(true)}><Settings size={24}/> {t('set')} <ChevronRight style={{marginLeft:'auto', opacity:0.3}}/></div>
                  {user?.id === ADMIN_ID && <div className="menu-btn" style={{color:'#7B3494', background:'rgba(123,52,148,0.08)', border:'none'}}><Lock size={24}/> {t('adm')}</div>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ЭКРАН НАСТРОЕК --- */}
        <AnimatePresence>
          {showSettings && (
            <motion.div className="full-screen-cover" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping: 25, stiffness: 250}}>
              <div className="cover-header">
                <div className="back-circle" onClick={() => setShowSettings(false)}><ArrowLeft size={22}/></div>
                <h2 className="cover-title">{t('set')}</h2>
                <div></div>
              </div>
              <div className="cover-content">
                <div className="settings-grid">
                  <div className="menu-btn grid-btn" onClick={toggleTheme}>
                    {theme==='light'?<Moon size={26}/>:<Sun size={26}/>} {t('theme')}
                    <div className="switch" data-active={theme==='dark'}></div>
                  </div>
                  <div className="menu-btn grid-btn" onClick={() => setLang(lang==='uk'?'en':'uk')}>
                    <Globe size={26}/> {t('lang')} <span style={{opacity:0.5, fontWeight:800}}>{lang.toUpperCase()}</span>
                  </div>
                </div>

                <h4 style={{width:'100%', textAlign:'left', opacity:0.5, marginBottom:12, paddingLeft:5, fontWeight: 700}}>Community</h4>
                <div className="menu-list">
                  <div className="menu-btn" onClick={()=>handleLink('https://instagram.com', false)}><Instagram size={24} color="#E1306C"/> {t('insta')} <ChevronRight style={{marginLeft:'auto', opacity:0.3}}/></div>
                  <div className="menu-btn" onClick={()=>handleLink('https://t.me/trainery', true)}><Users size={24} color="#0088cc"/> {t('tg_bot')} <ChevronRight style={{marginLeft:'auto', opacity:0.3}}/></div>
                  <div className="menu-btn" onClick={()=>handleLink('https://t.me/juls', true)}><Send size={24} color="#0088cc"/> {t('tg_mom')} <ChevronRight style={{marginLeft:'auto', opacity:0.3}}/></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}

export default App;