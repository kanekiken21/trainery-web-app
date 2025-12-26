import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, CalendarHeart, Utensils, Scale, Dumbbell, HeartPulse } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

const T = {
  uk: {
    hello: "Привіт, Чемпіонко!", sub: "Твій простір сили ✨",
    m_title: "Марафони", m_sub: "Твій шлях до мети",
    h_title: "Здоров'я", h_sub: "Контроль та турбота",
    empty_news: "Тут поки тихо...", empty_sub: "Скоро будуть новини 🔥",
    m_closed: "Запис закрито 🍂", m_wait: "Чекай на анонси!",
    prof: "Профіль", set: "Налаштування", adm: "Адмін",
    theme: "Темна тема", lang: "English",
    insta: "Instagram", tg_bot: "Канал Trainery", tg_mom: "Канал Juls",
    cal: "Калорії", cyc: "Цикл", bod: "Заміри"
  },
  en: {
    hello: "Hello, Champion!", sub: "Your power space ✨",
    m_title: "Programs", m_sub: "Path to your goal",
    h_title: "Health", h_sub: "Control & care",
    empty_news: "Quiet here...", empty_sub: "News coming soon 🔥",
    m_closed: "Closed 🍂", m_wait: "Wait for announcements!",
    prof: "Profile", set: "Settings", adm: "Admin",
    theme: "Dark Mode", lang: "Ukrainian",
    insta: "Instagram", tg_bot: "Trainery Channel", tg_mom: "Juls Channel",
    cal: "Calories", cyc: "Cycle", bod: "Body"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, marathons, health, profile, settings
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('uk');
  const [theme, setTheme] = useState('light');
  const [imgErr, setImgErr] = useState({});

  const t = (key) => T[lang][key];

  useEffect(() => {
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

  // Компонент Хедера (показываем только на главных вкладках)
  const Header = () => (
    <header className="fixed-header">
      <div className="header-center">
        {!imgErr.logo ? <img src="1.png" className="app-logo" onError={()=>setImgErr({...imgErr, logo:true})}/> : <Zap color="#7B3494"/>}
        <h1 className="gradient-text">Trainery</h1>
      </div>
      <div className="profile-bubble" onClick={() => setActiveTab('profile')}>
        {user?.photo_url ? <img src={user.photo_url}/> : <User size={20}/>}
      </div>
    </header>
  );

  return (
    <div className="app-container">
      <div className="particles-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {['home', 'marathons', 'health'].includes(activeTab) && <Header />}

      <AnimatePresence mode="wait">
        
        {/* --- ГЛАВНАЯ --- */}
        {activeTab === 'home' && (
          <motion.div key="home" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="page-wrapper">
            <div className="section-header">
              <div className="sh-text"><h2>{t('hello')}</h2><p>{t('sub')}</p></div>
            </div>
            <div className="glass-card empty-state">
              <div className="glow-container">
                <svg className="glow-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#7B3494"/></svg>
                {!imgErr.chibi ? <img src="2.png" className="chibi-big" onError={()=>setImgErr({...imgErr, chibi:true})}/> : <Sparkles size={80} color="#7B3494"/>}
              </div>
              <h3>{t('empty_news')}</h3><p>{t('empty_sub')}</p>
            </div>
          </motion.div>
        )}

        {/* --- МАРАФОНЫ --- */}
        {activeTab === 'marathons' && (
          <motion.div key="marathons" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="page-wrapper">
            <div className="section-header">
              <div className="sh-icon"><Dumbbell size={28}/></div>
              <div className="sh-text"><h2>{t('m_title')}</h2><p>{t('m_sub')}</p></div>
            </div>
            <div className="glass-card empty-state">
               <div className="glow-container">
                 <svg className="glow-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#7B3494"/></svg>
                 {!imgErr.prem ? <img src="1.png" className="chibi-big" onError={()=>setImgErr({...imgErr, prem:true})}/> : <Zap size={80} color="#7B3494"/>}
               </div>
               <h3>{t('m_closed')}</h3><p>{t('m_wait')}</p>
            </div>
          </motion.div>
        )}

        {/* --- ЗДОРОВЬЕ --- */}
        {activeTab === 'health' && (
          <motion.div key="health" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="page-wrapper">
            <div className="section-header">
              <div className="sh-icon"><HeartPulse size={28}/></div>
              <div className="sh-text"><h2>{t('h_title')}</h2><p>{t('h_sub')}</p></div>
            </div>
            
            <div className="health-row" style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
              <div><h3>{t('card_cal')}</h3><p>Kcal</p></div><Utensils size={32}/><div className="decor-circle"></div>
            </div>
            <div className="health-row" style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
              <div><h3>{t('card_cycle')}</h3><p>28 days</p></div><CalendarHeart size={32}/><div className="decor-circle"></div>
            </div>
            <div className="health-row" style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
              <div><h3>{t('card_body')}</h3><p>Kg / Cm</p></div><Scale size={32}/><div className="decor-circle"></div>
            </div>
          </motion.div>
        )}

        {/* --- ПРОФИЛЬ (ПОЛНОЦЕННАЯ СТРАНИЦА) --- */}
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="page-wrapper profile-page">
            <div className="avatar-section">
              <svg className="avatar-glow-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#7B3494" filter="url(#blur)"/><defs><filter id="blur"><feGaussianBlur stdDeviation="10"/></filter></defs></svg>
              {user?.photo_url ? <img src={user.photo_url} className="avatar-image"/> : <User size={50}/>}
            </div>
            <h2 className="profile-name">{user?.first_name}</h2>
            <p className="profile-tag">@{user?.username}</p>

            <div className="menu-group">
              <div className="menu-btn" onClick={() => setActiveTab('settings')}><Settings size={22}/> {t('set')} <ChevronRight size={18} style={{marginLeft:'auto', opacity:0.3}}/></div>
              {user?.id === ADMIN_ID && <div className="menu-btn" style={{color:'#7B3494', background:'rgba(123,52,148,0.1)'}}><Lock size={22}/> {t('adm')}</div>}
            </div>

            <div className="menu-btn" onClick={() => setActiveTab('home')}><ArrowLeft size={22}/> Назад</div>
          </motion.div>
        )}

        {/* --- НАСТРОЙКИ (ПОЛНОЦЕННАЯ СТРАНИЦА) --- */ }
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:50}} className="page-wrapper">
            <div className="settings-header" onClick={() => setActiveTab('profile')}>
              <div className="back-circle"><ArrowLeft size={20}/></div>
              <h2>{t('set')}</h2>
            </div>

            <div className="menu-group">
              <div className="menu-btn" onClick={toggleTheme}>
                {theme==='light'?<Moon size={22}/>:<Sun size={22}/>} {t('theme')}
                <div style={{marginLeft:'auto', width:40, height:24, background:theme==='dark'?'#7B3494':'#ccc', borderRadius:20, position:'relative'}}>
                  <div style={{width:20, height:20, background:'white', borderRadius:'50%', position:'absolute', top:2, left:theme==='dark'?18:2, transition:'0.3s'}}></div>
                </div>
              </div>
              <div className="menu-btn" onClick={() => setLang(lang==='uk'?'en':'uk')}>
                <Globe size={22}/> {t('lang')} <span style={{marginLeft:'auto', opacity:0.5}}>{lang.toUpperCase()}</span>
              </div>
            </div>

            <h4 style={{opacity:0.5, marginLeft:10, marginBottom:10}}>{t('socials')}</h4>
            <div className="menu-group">
              <div className="menu-btn" onClick={()=>handleLink('https://instagram.com', false)}><Instagram size={22} color="#E1306C"/> {t('insta')} <ChevronRight style={{marginLeft:'auto', opacity:0.3}}/></div>
              <div className="menu-btn" onClick={()=>handleLink('https://t.me/trainery', true)}><Users size={22} color="#0088cc"/> {t('tg_bot')} <ChevronRight style={{marginLeft:'auto', opacity:0.3}}/></div>
              <div className="menu-btn" onClick={()=>handleLink('https://t.me/juls', true)}><Send size={22} color="#0088cc"/> {t('tg_mom')} <ChevronRight style={{marginLeft:'auto', opacity:0.3}}/></div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* НИЖНЕЕ МЕНЮ (ТОЛЬКО НА ГЛАВНЫХ СТРАНИЦАХ) */}
      {['home', 'marathons', 'health'].includes(activeTab) && (
        <div className="bottom-nav">
          <div className="nav-island">
            <button onClick={() => setActiveTab('home')} className={`nav-btn ${activeTab==='home'?'active':''}`}><Home size={26}/>{activeTab==='home'&&<motion.div layoutId="n" className="nav-active-bg"/>}</button>
            <button onClick={() => setActiveTab('marathons')} className={`nav-btn ${activeTab==='marathons'?'active':''}`}><Zap size={26}/>{activeTab==='marathons'&&<motion.div layoutId="n" className="nav-active-bg"/>}</button>
            <button onClick={() => setActiveTab('health')} className={`nav-btn ${activeTab==='health'?'active':''}`}><Activity size={26}/>{activeTab==='health'&&<motion.div layoutId="n" className="nav-active-bg"/>}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;