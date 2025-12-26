import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, CalendarHeart, Utensils, Scale, Dumbbell, HeartPulse, ShieldCheck, Flame, Plus, Trash2, CheckCircle, CreditCard } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

const spring = { type: "spring", stiffness: 300, damping: 25 };
const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: spring } };

const MONTHS_UK = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Цвета для новостей
const NEWS_COLORS = ['linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)'];

const T = {
  uk: {
    hello: "Привіт, Чемпіонко!", sub: "Твій простір сили ✨",
    m_title: "Марафони", m_sub: "Шлях до мети",
    h_title: "Здоров'я", h_sub: "Твій контроль",
    empty_news: "Тут поки тихо...", empty_sub: "Скоро будуть новини 🔥",
    prof: "Профіль", set: "Налаштування", adm: "Адмін",
    theme: "Темна тема", lang: "English",
    insta: "Instagram", tg_bot: "Канал Trainery", tg_mom: "Канал Juls",
    cal: "Калорії", cyc: "Цикл", bod: "Заміри", menu: "Меню",
    // MARATHON
    standard: "Standard", early: "Early Bird",
    price_cur: "650 ₴", price_early: "550 ₴",
    buy_btn: "Оплатити", enter_data: "Введи дані",
    inp_inst: "Твій Instagram", inp_tg: "Твій Telegram",
    // ADMIN
    add_news: "Додати новину", news_title: "Заголовок", news_body: "Текст статті",
    pub: "Опублікувати", del: "Видалити"
  },
  en: {
    hello: "Hello, Champion!", sub: "Your power space ✨",
    m_title: "Programs", m_sub: "Path to goal",
    h_title: "Health", h_sub: "Your control",
    empty_news: "Quiet here...", empty_sub: "News coming soon 🔥",
    prof: "Profile", set: "Settings", adm: "Admin",
    theme: "Dark Mode", lang: "Ukrainian",
    insta: "Instagram", tg_bot: "Trainery Channel", tg_mom: "Juls Channel",
    cal: "Calories", cyc: "Cycle", bod: "Body", menu: "Menu",
    // MARATHON
    standard: "Standard", early: "Early Bird",
    price_cur: "650 ₴", price_early: "550 ₴",
    buy_btn: "Pay Now", enter_data: "Enter details",
    inp_inst: "Your Instagram", inp_tg: "Your Telegram",
    // ADMIN
    add_news: "Add News", news_title: "Title", news_body: "Body Text",
    pub: "Publish", del: "Delete"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  
  // СОСТОЯНИЯ
  const [lang, setLangState] = useState(() => localStorage.getItem('app_lang') || 'uk');
  const [theme, setThemeState] = useState(() => localStorage.getItem('app_theme') || 'light');
  const [news, setNews] = useState(() => JSON.parse(localStorage.getItem('app_news') || '[]'));
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  // ВРЕМЕННЫЕ ДАННЫЕ (Для форм)
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = текущий, 1,2,3 = следующие
  const [formData, setFormData] = useState({ insta: '', tg: '' });
  const [viewArticle, setViewArticle] = useState(null); // Какую статью читаем

  // АДМИНСКИЕ ДАННЫЕ
  const [newArticle, setNewArticle] = useState({ title: '', body: '', color: NEWS_COLORS[0] });

  const t = (key) => T[lang][key];
  const monthsList = lang === 'uk' ? MONTHS_UK : MONTHS_EN;
  const currentMonthIdx = new Date().getMonth();

  // Функции сохранения
  const setLang = (l) => { setLangState(l); localStorage.setItem('app_lang', l); };
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme); localStorage.setItem('app_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Админ функции
  const addNews = () => {
    if(!newArticle.title || !newArticle.body) return;
    const updated = [{...newArticle, id: Date.now(), date: new Date().toLocaleDateString()}, ...news];
    setNews(updated);
    localStorage.setItem('app_news', JSON.stringify(updated));
    setNewArticle({ title: '', body: '', color: NEWS_COLORS[0] });
    setActiveTab('home'); // Вернуться на главную
  };

  const deleteNews = (id) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    localStorage.setItem('app_news', JSON.stringify(updated));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(() => setLoading(false), 500); return 100; }
        return prev + 10;
      });
    }, 50);
    const tg = window.Telegram.WebApp;
    tg.ready(); tg.expand();
    setUser(tg.initDataUnsafe?.user || { first_name: 'User', username: 'user', id: 8297304095 });
    return () => clearInterval(interval);
  }, []);

  const handleLink = (url, isTg) => { if(isTg) window.Telegram.WebApp.openTelegramLink(url); else window.Telegram.WebApp.openLink(url); };
  const copyId = () => { if(user?.id) { navigator.clipboard.writeText(user.id.toString()); setCopied(true); setTimeout(()=>setCopied(false), 2000); }};

  // Логика марафонов (след 4 месяца)
  const getMarathonMonths = () => {
    const res = [];
    for(let i=0; i<4; i++) {
      const idx = (currentMonthIdx + i) % 12;
      res.push({ name: monthsList[idx], isEarly: i > 0, idx: i });
    }
    return res;
  };

  return (
    <>
      <div className="noise-overlay"></div>
      <div className="ambient-bg"></div>

      <AnimatePresence>
        {loading && (
          <motion.div className="loading-screen" exit={{ opacity: 0 }}>
             {!imgErr ? <img src="1.png" className="loading-logo-img" onError={()=>setImgErr(true)}/> : <Zap size={80} color="#8B5CF6"/>}
             <div className="progress-container"><div className="progress-bar" style={{width: `${progress}%`}}></div></div>
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
            
            {/* --- ГЛАВНАЯ --- */}
            {activeTab === 'home' && (
              <motion.div key="home" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}>
                  <h2>{t('hello')}</h2><p>{t('sub')}</p>
                </motion.div>
                
                {/* НОВОСТИ ИЛИ ЗАГЛУШКА */}
                {news.length > 0 ? (
                  <motion.div className="news-carousel" variants={itemVars}>
                    {news.map(item => (
                      <motion.div key={item.id} className="news-card" style={{background: item.color}} whileTap={{scale:0.95}} onClick={() => setViewArticle(item)}>
                        <div className="news-date">{item.date}</div>
                        <div className="news-title">{item.title}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div className="glass-card" variants={itemVars}>
                    <div className="icon-glow-container"><Sparkles size={55}/></div>
                    <h3>{t('empty_news')}</h3><p>{t('empty_sub')}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* --- МАРАФОНЫ --- */}
            {activeTab === 'marathons' && (
              <motion.div key="marathons" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}><h2>{t('m_title')}</h2><p>{t('m_sub')}</p></motion.div>
                
                {/* ВЫБОР МЕСЯЦА */}
                <div className="month-grid">
                  {getMarathonMonths().map((m) => (
                    <motion.div key={m.idx} className={`month-card ${selectedMonth === m.idx ? 'selected' : ''}`} onClick={() => setSelectedMonth(m.idx)} whileTap={{scale:0.98}}>
                      <div className="month-name">{m.name}</div>
                      <div className="month-price">{m.isEarly ? t('price_early') : t('price_cur')}</div>
                      <div className={`month-tag ${m.isEarly ? 'tag-early' : 'tag-standard'}`}>{m.isEarly ? t('early') : t('standard')}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="glass-card">
                  <h3 style={{marginBottom:20}}>{t('enter_data')}</h3>
                  <div className="input-group">
                    <label className="input-label">{t('inp_inst')}</label>
                    <input className="custom-input" placeholder="@instagram" value={formData.insta} onChange={e=>setFormData({...formData, insta: e.target.value})}/>
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t('inp_tg')}</label>
                    <input className="custom-input" placeholder="@telegram" value={formData.tg} onChange={e=>setFormData({...formData, tg: e.target.value})}/>
                  </div>
                  <button className="action-btn"><CreditCard size={20}/> {t('buy_btn')} - {selectedMonth === 0 ? t('price_cur') : t('price_early')}</button>
                </div>
              </motion.div>
            )}

            {/* --- ЗДОРОВЬЕ --- */}
            {activeTab === 'health' && (
              <motion.div key="health" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}><h2>{t('h_title')}</h2><p>{t('h_sub')}</p></motion.div>
                <motion.div variants={itemVars}>
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-1"></div></div>
                    <div className="health-text"><h3>{t('cal')}</h3></div><div className="health-icon-anim"><Flame size={32}/></div>
                  </motion.div>
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-2"></div></div>
                    <div className="health-text"><h3>{t('cyc')}</h3></div><div className="health-icon-anim"><CalendarHeart size={32}/></div>
                  </motion.div>
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-1" style={{left:-20}}></div></div>
                    <div className="health-text"><h3>{t('bod')}</h3></div><div className="health-icon-anim"><Scale size={32}/></div>
                  </motion.div>
                  <motion.div className="health-banner" whileTap={{scale:0.98}} style={{background:'linear-gradient(135deg, #36D1DC, #5B86E5)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-2" style={{top:-20}}></div></div>
                    <div className="health-text"><h3>{t('menu')}</h3></div><div className="health-icon-anim"><Utensils size={32}/></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* --- ПРОФИЛЬ --- */}
            {activeTab === 'profile' && (
              <motion.div key="profile" className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('home')}><ArrowLeft size={24}/></motion.div>
                  <div className="page-nav-title">{t('prof')}</div><div></div>
                </div>
                <div className="scroll-content">
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={spring} className="avatar-section">
                     {user?.photo_url ? <img src={user.photo_url} className="avatar-img"/> : <User size={50}/>}
                  </motion.div>
                  <h2 className="user-name">{user?.first_name}</h2>
                  <p className="user-handle">@{user?.username}</p>
                  <motion.div className="id-chip" onClick={copyId}><ShieldCheck size={16}/> ID: {user?.id} {copied && "✓"}</motion.div>
                  <div className="menu-stack">
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setActiveTab('settings')}><Settings size={24}/> {t('set')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>
                    {user?.id === ADMIN_ID && <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setActiveTab('admin')} style={{color: 'var(--accent)'}}><Lock size={24}/> {t('adm')}</motion.div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- АДМИН ПАНЕЛЬ --- */}
            {activeTab === 'admin' && (
              <motion.div key="admin" className="fullscreen-page" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:"spring", damping:25}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" onClick={()=>setActiveTab('profile')}><ArrowLeft size={24}/></motion.div>
                  <div className="page-nav-title">{t('adm')}</div><div></div>
                </div>
                <div className="scroll-content">
                  {/* Добавление новостей */}
                  <div className="admin-section">
                    <div className="admin-title">{t('add_news')}</div>
                    <div className="color-picker">
                      {NEWS_COLORS.map(c => <div key={c} className={`color-btn ${newArticle.color===c?'active':''}`} style={{background:c}} onClick={()=>setNewArticle({...newArticle, color:c})}/>)}
                    </div>
                    <div className="input-group">
                      <input className="custom-input" placeholder={t('news_title')} value={newArticle.title} onChange={e=>setNewArticle({...newArticle, title:e.target.value})} maxLength={40}/>
                    </div>
                    <div className="input-group">
                      <textarea className="custom-input" rows={4} placeholder={t('news_body')} value={newArticle.body} onChange={e=>setNewArticle({...newArticle, body:e.target.value})}/>
                    </div>
                    <button className="action-btn" onClick={addNews}><Plus size={20}/> {t('pub')}</button>
                  </div>

                  {/* Список новостей */}
                  <div className="admin-section">
                    <div className="admin-title">Активні новини</div>
                    {news.map(n => (
                      <div key={n.id} className="menu-row" style={{marginBottom:10, justifyContent:'space-between'}}>
                        <span>{n.title}</span>
                        <Trash2 size={20} color="red" onClick={()=>deleteNews(n.id)}/>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- ПРОСМОТР СТАТЬИ --- */}
            {viewArticle && (
              <motion.div className="fullscreen-page" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:"spring", damping:25}} style={{zIndex:300}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" onClick={()=>setViewArticle(null)}><ArrowLeft size={24}/></motion.div>
                  <div className="page-nav-title">Новина</div><div></div>
                </div>
                <div className="scroll-content" style={{alignItems:'flex-start'}}>
                  <div className="news-card" style={{background: viewArticle.color, width:'100%', marginBottom:20, height:'auto', minHeight:120}}>
                    <div className="news-date">{viewArticle.date}</div>
                    <div className="news-title" style={{fontSize:24}}>{viewArticle.title}</div>
                  </div>
                  <div className="article-body">{viewArticle.body}</div>
                </div>
              </motion.div>
            )}

            {/* --- НАСТРОЙКИ --- */}
            {activeTab === 'settings' && (
              <motion.div key="settings" className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('profile')}><ArrowLeft size={24}/></motion.div>
                  <div className="page-nav-title">{t('set')}</div><div></div>
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
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://instagram.com', false)}><Instagram size={24} color="#E1306C"/> {t('insta')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/trainery', true)}><Users size={24} color="#0088cc"/> {t('tg_bot')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>
                    <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/juls', true)}><Send size={24} color="#0088cc"/> {t('tg_mom')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>
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