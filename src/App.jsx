import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Copy, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, CalendarHeart, Utensils, Scale, Dumbbell, HeartPulse, ShieldCheck, Flame, Plus, Trash2, CreditCard, HelpCircle, X, BookOpen, Check, Search, FileText } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

const spring = { type: "spring", stiffness: 300, damping: 25 };
const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVars = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: spring } };

// ПОЛНЫЕ МЕСЯЦЫ
const MONTHS_UK = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const NEWS_THEMES = [
  { bg: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #333 0%, #000 100%)', text: '#fff' }
];

const MENU_CATEGORIES = [
  { id: '1400', label: '1400 ККАЛ', color: '#FF9A44' },
  { id: '1600', label: '1600 ККАЛ', color: '#10B981' }
];

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
    standard: "Standard", early: "Early Bird",
    price_cur: "650 ₴", price_early: "550 ₴",
    buy_btn: "Оплатити", enter_data: "Введи дані",
    inp_inst: "Твій Instagram", inp_tg: "Твій Telegram",
    faq_title: "Що це таке?", faq_text: "Обирай 'Standard' для поточного місяця або 'Early Bird' для запису на майбутні зі знижкою!",
    add_news: "Додати новину", news_title: "Заголовок (макс 50)", news_body: "Текст (макс 200)",
    pub: "Опублікувати", del: "Видалити",
    menu_buy: "Купити", menu_empty: "Меню ще не готове", menu_soon: "Слідкуй за оновленнями!",
    manage_menu: "Додати Меню", menu_desc: "Опис меню", menu_price: "Ціна", upload_pdf: "Завантажити PDF",
    collection: "Моя колекція", purchased: "Придбано", open_pdf: "Відкрити PDF",
    search: "Пошук меню...", empty_coll: "Тут поки порожньо", menu_cat: "Категорія"
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
    cal: "Calories", cyc: "Cycle", bod: "Body", menu: "Menu",
    standard: "Standard", early: "Early Bird",
    price_cur: "650 ₴", price_early: "550 ₴",
    buy_btn: "Pay Now", enter_data: "Enter details",
    inp_inst: "Your Instagram", inp_tg: "Your Telegram",
    faq_title: "What is this?", faq_text: "Choose 'Standard' for current month or 'Early Bird' for future months with discount!",
    add_news: "Add News", news_title: "Title (max 50)", news_body: "Body (max 200)",
    pub: "Publish", del: "Delete",
    menu_buy: "Buy", menu_empty: "Menu not ready yet", menu_soon: "Stay tuned!",
    manage_menu: "Add Menu", menu_desc: "Menu Description", menu_price: "Price", upload_pdf: "Upload PDF",
    collection: "My Collection", purchased: "Purchased", open_pdf: "Open PDF",
    search: "Search menu...", empty_coll: "It's empty here", menu_cat: "Category"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  
  const [lang, setLangState] = useState(() => localStorage.getItem('app_lang') || 'uk');
  const [theme, setThemeState] = useState(() => localStorage.getItem('app_theme') || 'light');
  
  const [news, setNews] = useState(() => JSON.parse(localStorage.getItem('app_news') || '[]'));
  const [menus, setMenus] = useState(() => JSON.parse(localStorage.getItem('app_menus') || '[]'));
  const [myCollection, setMyCollection] = useState(() => JSON.parse(localStorage.getItem('app_collection') || '[]'));

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(0); 
  const [formData, setFormData] = useState({ insta: '', tg: '' });
  const [viewArticle, setViewArticle] = useState(null);
  const [showFaq, setShowFaq] = useState(false);
  const [viewMenu, setViewMenu] = useState(false);
  const [viewCollection, setViewCollection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('1400');
  const [activeMenuIndex, setActiveMenuIndex] = useState(0); 

  const [adminTab, setAdminTab] = useState('news');
  const [newArticle, setNewArticle] = useState({ title: '', body: '', themeIdx: 0 });
  const [newMenu, setNewMenu] = useState({ title: '', desc: '', price: '', cat: '1400' });

  const t = (key) => T[lang][key];
  const monthsList = lang === 'uk' ? MONTHS_UK : MONTHS_EN;
  const currentMonthIdx = new Date().getMonth();

  const setLang = (l) => { setLangState(l); localStorage.setItem('app_lang', l); };
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme); localStorage.setItem('app_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const addNews = () => {
    if(!newArticle.title || !newArticle.body) return;
    const theme = NEWS_THEMES[newArticle.themeIdx];
    const updated = [{...newArticle, id: Date.now(), date: new Date().toLocaleDateString(), bg: theme.bg, text: theme.text}, ...news];
    setNews(updated);
    localStorage.setItem('app_news', JSON.stringify(updated));
    setNewArticle({ title: '', body: '', themeIdx: 0 });
    setActiveTab('home');
  };

  const deleteNews = (id) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    localStorage.setItem('app_news', JSON.stringify(updated));
  };

  const saveMenu = () => {
    if(!newMenu.title || !newMenu.price) return;
    const menu = { ...newMenu, id: Date.now() };
    const updated = [...menus, menu];
    setMenus(updated);
    localStorage.setItem('app_menus', JSON.stringify(updated));
    setNewMenu({ title: '', desc: '', price: '', cat: '1400' });
    alert("Menu added!");
  };

  const deleteMenu = (id) => {
    const updated = menus.filter(m => m.id !== id);
    setMenus(updated);
    localStorage.setItem('app_menus', JSON.stringify(updated));
  };

  const buyMenu = (m) => {
    const updatedCollection = [...myCollection, m];
    setMyCollection(updatedCollection);
    localStorage.setItem('app_collection', JSON.stringify(updatedCollection));
    setViewMenu(false);
    setViewCollection(true);
  };

  const isPurchased = (id) => myCollection.some(m => m.id === id);
  const filteredCollection = myCollection.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredMenus = menus.filter(m => m.cat === activeCategory);

  const handleMenuScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveMenuIndex(index);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        return next;
      });
    }, 50);
    const tg = window.Telegram.WebApp;
    tg.ready(); tg.expand();
    setUser(tg.initDataUnsafe?.user || { first_name: 'User', username: 'user', id: 8297304095 });
    return () => clearInterval(interval);
  }, []);

  const handleLink = (url, isTg) => { if(isTg) window.Telegram.WebApp.openTelegramLink(url); else window.Telegram.WebApp.openLink(url); };
  const copyId = () => { if(user?.id) { navigator.clipboard.writeText(user.id.toString()); setCopied(true); setTimeout(()=>setCopied(false), 2000); }};

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
      <div className="particles-container">
        <div className="particle p1"></div><div className="particle p2"></div><div className="particle p3"></div>
      </div>
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
              <div className="logo-glow-wrapper">
                <div className="logo-glow"></div>
                {!imgErr ? <img src="1.png" className="app-logo" onError={()=>setImgErr(true)}/> : <Zap color="#8B5CF6"/>}
              </div>
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
                <motion.div className="section-header" variants={itemVars}><h2>{t('hello')}</h2><p>{t('sub')}</p></motion.div>
                {news.length > 0 ? (
                  <motion.div className="news-carousel" variants={itemVars}>
                    {news.map(item => (
                      <motion.div key={item.id} className="news-card" style={{background: item.bg, color: item.text}} whileTap={{scale:0.95}} onClick={() => setViewArticle(item)}>
                        <div className="news-date">{item.date}</div><div className="news-title">{item.title}</div>
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

            {activeTab === 'marathons' && (
              <motion.div key="marathons" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}><h2>{t('m_title')}</h2><p>{t('m_sub')}</p></motion.div>
                <div className="glass-card marathon-card">
                  <motion.div className="faq-btn" whileTap={{scale:0.9}} onClick={()=>setShowFaq(!showFaq)}><HelpCircle size={18}/></motion.div>
                  <AnimatePresence>{showFaq && <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="faq-tooltip"><strong>{t('faq_title')}</strong><br/>{t('faq_text')}</motion.div>}</AnimatePresence>
                  <div className="month-grid">
                    {getMarathonMonths().map((m) => (
                      <motion.div key={m.idx} className={`month-card ${selectedMonth === m.idx ? 'selected' : ''}`} onClick={() => setSelectedMonth(m.idx)} whileTap={{scale:0.95}}>
                        <div className="month-name">{m.name}</div>
                        <div className="month-price">{m.isEarly ? t('price_early') : t('price_cur')}</div>
                        <div className={`month-tag ${m.isEarly ? 'tag-early' : 'tag-standard'}`}>{m.isEarly ? t('early') : t('standard')}</div>
                      </motion.div>
                    ))}
                  </div>
                  <h3 style={{marginBottom:15, marginTop:10}}>{t('enter_data')}</h3>
                  <div className="input-group"><label className="input-label">{t('inp_inst')}</label><div className="input-with-icon"><Instagram size={18} className="input-icon"/><input className="custom-input has-icon" placeholder="@instagram" value={formData.insta} onChange={e=>setFormData({...formData, insta: e.target.value})}/></div></div>
                  <div className="input-group"><label className="input-label">{t('inp_tg')}</label><div className="input-with-icon"><Send size={18} className="input-icon"/><input className="custom-input has-icon" placeholder="@telegram" value={formData.tg} onChange={e=>setFormData({...formData, tg: e.target.value})}/></div></div>
                  <motion.button whileTap={{scale:0.95}} className="action-btn"><CreditCard size={20}/> {t('buy_btn')} — {selectedMonth === 0 ? t('price_cur') : t('price_early')}</motion.button>
                </div>
              </motion.div>
            )}

            {activeTab === 'health' && (
              <motion.div key="health" className="page-wrapper" variants={containerVars} initial="hidden" animate="visible" exit={{opacity:0, y:-10}}>
                <motion.div className="section-header" variants={itemVars}><h2>{t('h_title')}</h2><p>{t('h_sub')}</p></motion.div>
                <motion.div variants={itemVars}>
                  <motion.div className="health-banner" whileTap={{scale:0.95}} style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-1"></div></div><div className="health-text"><h3>{t('cal')}</h3></div><div className="health-icon-anim"><Flame size={32}/></div>
                  </motion.div>
                  <motion.div className="health-banner" whileTap={{scale:0.95}} style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-2"></div></div><div className="health-text"><h3>{t('cyc')}</h3></div><div className="health-icon-anim"><CalendarHeart size={32}/></div>
                  </motion.div>
                  <motion.div className="health-banner" whileTap={{scale:0.95}} style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-1" style={{left:-20}}></div></div><div className="health-text"><h3>{t('bod')}</h3></div><div className="health-icon-anim"><Scale size={32}/></div>
                  </motion.div>
                  <motion.div className="health-banner" whileTap={{scale:0.95}} onClick={()=>setViewMenu(true)} style={{background:'linear-gradient(135deg, #36D1DC, #5B86E5)'}}>
                    <div className="banner-anim-container"><div className="banner-decor bd-2" style={{top:-20}}></div></div><div className="health-text"><h3>{t('menu')}</h3></div><div className="health-icon-anim"><Utensils size={32}/></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* ПРОСМОТР МЕНЮ */}
            {viewMenu && (
              <motion.div className="fullscreen-page" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:"spring", damping:25}} style={{zIndex:300}}>
                <div className="page-nav-header">
                  <motion.div className="back-btn-circle" onClick={()=>setViewMenu(false)}><X size={24}/></motion.div>
                  <div className="page-nav-title">{t('menu')}</div><div></div>
                </div>
                <div className="scroll-content">
                  <div className="category-switcher">
                    {MENU_CATEGORIES.map(cat => (
                      <div key={cat.id} className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={()=>setActiveCategory(cat.id)}>{cat.label}</div>
                    ))}
                  </div>

                  {filteredMenus.length > 0 ? (
                    <>
                      <div className="menu-carousel" onScroll={handleMenuScroll}>
                        {filteredMenus.map(m => {
                          const cat = MENU_CATEGORIES.find(c => c.id === m.cat);
                          return (
                            <motion.div key={m.id} className="menu-card-swipe" whileTap={{scale:0.98}}>
                              <div className="icon-glow-container"><Utensils size={50}/></div>
                              <h2 style={{margin:'10px 0', fontSize:24, fontWeight:800}}>{m.title}</h2>
                              <div className="menu-cat-neon" style={{color: cat?.color || '#8B5CF6'}}>{cat?.label}</div>
                              <p className="menu-desc-clamp">{m.desc}</p>
                              {!isPurchased(m.id) ? (
                                <button className="menu-buy-btn" onClick={() => buyMenu(m)}><CreditCard size={20}/> {t('menu_buy')} — {m.price} ₴</button>
                              ) : (
                                <div style={{background:'green', color:'white', padding:'10px 20px', borderRadius:16, fontWeight:700}}>✓ {t('purchased')}</div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="pagination-dots">
                        {filteredMenus.map((_, i) => <div key={i} className={`dot ${i===activeMenuIndex?'active':''}`}/>)}
                      </div>
                    </>
                  ) : (
                    <div className="glass-card" style={{width:'100%', minHeight:200, marginTop:10}}>
                      <div className="icon-glow-container" style={{background:'var(--accent)'}}><Lock size={50}/></div>
                      <h3>{t('menu_empty')}</h3><p>{t('menu_soon')}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ПРОФИЛЬ */}
            {activeTab === 'profile' && (
              <motion.div key="profile" className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25, stiffness:300}}>
                <div className="page-nav-header"><motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('home')}><ArrowLeft size={24}/></motion.div><div className="page-nav-title">{t('prof')}</div><div></div></div>
                <div className="scroll-content">
                  <div className="avatar-section">{user?.photo_url ? <img src={user.photo_url} className="avatar-big"/> : <User size={50}/>}</div><h2 className="user-name">{user?.first_name}</h2><p className="user-handle">@{user?.username}</p><motion.div className="id-chip" onClick={copyId} whileTap={{scale:0.95}}><ShieldCheck size={16}/> ID: {user?.id} {copied && "✓"}</motion.div>
                  <div className="menu-stack"><motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setViewCollection(true)}><BookOpen size={24} color="#FF9A44"/> {t('collection')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div><motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setActiveTab('settings')}><Settings size={24}/> {t('set')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div>{user?.id === ADMIN_ID && <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setActiveTab('admin')} style={{color: 'var(--accent)'}}><Lock size={24}/> {t('adm')}</motion.div>}</div>
                </div>
              </motion.div>
            )}

            {/* МОЯ КОЛЛЕКЦИЯ */}
            {viewCollection && (
              <motion.div className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25}} style={{zIndex:210}}>
                <div className="page-nav-header"><motion.div className="back-btn-circle" onClick={()=>setViewCollection(false)}><ArrowLeft size={24}/></motion.div><div className="page-nav-title">{t('collection')}</div><div></div></div>
                <div className="scroll-content">
                  <div className="input-group"><div className="input-with-icon"><Search size={20} className="input-icon" style={{position:'absolute', top:18, left:18}}/><input className="custom-input" style={{paddingLeft:50}} placeholder={t('search')} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div></div>
                  {filteredCollection.length > 0 ? filteredCollection.map((m, i) => (
                    <motion.div key={i} className="collection-card" whileTap={{scale:0.98}}>
                      <div style={{display:'flex', alignItems:'center', gap:12}}>
                        <div className="coll-icon"><Utensils size={24}/></div>
                        <div><div style={{fontWeight:800, fontSize:18}}>{m.title}</div><div style={{fontSize:13, opacity:0.8}}>{m.price} UAH</div></div>
                      </div>
                      <div className="pdf-btn">{t('open_pdf')}</div>
                    </motion.div>
                  )) : (
                    <div className="glass-card" style={{width:'100%', minHeight:200}}><div className="icon-glow-container" style={{background:'var(--accent)'}}><Lock size={40}/></div><h3>{t('empty_coll')}</h3></div>
                  )}
                </div>
              </motion.div>
            )}

            {/* НАСТРОЙКИ */}
            {activeTab === 'settings' && (
              <motion.div key="settings" className="fullscreen-page" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:"spring", damping:25, stiffness:300}}>
                <div className="page-nav-header"><motion.div className="back-btn-circle" whileTap={{scale:0.9}} onClick={()=>setActiveTab('profile')}><ArrowLeft size={24}/></motion.div><div className="page-nav-title">{t('set')}</div><div></div></div>
                <div className="scroll-content">
                  <div className="menu-stack" style={{marginBottom: 30}}>
                     <motion.div className="menu-row" whileTap={{scale:0.98}} onClick={toggleTheme}>{theme==='light'?<Moon size={24}/>:<Sun size={24}/>}<span style={{flex:1, textAlign:'left'}}>{t('theme')}</span></motion.div><motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>setLang(lang==='uk'?'en':'uk')}><Globe size={24}/><span style={{flex:1, textAlign:'left'}}>{t('lang')}</span><span style={{opacity:0.6, fontWeight: 800}}>{lang.toUpperCase()}</span></motion.div>
                  </div>
                  <h4 style={{width:'100%', opacity:0.5, marginBottom:12, paddingLeft:5, fontWeight: 700}}>Community</h4>
                  <div className="menu-stack"><motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://www.instagram.com/hharbarr?igsh=NmM3bjBnejlpMHpl&utm_source=qr', false)}><Instagram size={24} color="#E1306C"/> {t('insta')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div><motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/trainery_community', true)}><Users size={24} color="#0088cc"/> {t('tg_bot')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div><motion.div className="menu-row" whileTap={{scale:0.98}} onClick={()=>handleLink('https://t.me/julschannelua', true)}><Send size={24} color="#0088cc"/> {t('tg_mom')} <ChevronRight size={20} style={{marginLeft:'auto', opacity:0.3}}/></motion.div></div>
                </div>
              </motion.div>
            )}

            {/* АДМИНКА */}
            {activeTab === 'admin' && (
              <motion.div key="admin" className="fullscreen-page" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:"spring", damping:25}}>
                <div className="page-nav-header"><motion.div className="back-btn-circle" onClick={()=>setActiveTab('profile')}><ArrowLeft size={24}/></motion.div><div className="page-nav-title">{t('adm')}</div><div></div></div>
                <div className="scroll-content">
                  <div className="admin-tab-switch"><div className={`tab-btn ${adminTab==='news'?'active':''}`} onClick={()=>setAdminTab('news')}>Новини</div><div className={`tab-btn ${adminTab==='menu'?'active':''}`} onClick={()=>setAdminTab('menu')}>Меню</div></div>
                  {adminTab === 'news' ? (
                    <><div className="admin-card"><div className="admin-header"><h3>{t('add_news')}</h3></div><div className="color-picker">{NEWS_THEMES.map((th, i) => <motion.div key={i} whileTap={{scale:0.9}} className={`color-btn ${newArticle.themeIdx===i?'active':''}`} style={{background:th.bg}} onClick={()=>setNewArticle({...newArticle, themeIdx:i})}/>)}</div><div className="input-group"><input className="custom-input" placeholder={t('news_title')} value={newArticle.title} onChange={e=>setNewArticle({...newArticle, title:e.target.value})} maxLength={50}/></div><div className="input-group"><textarea className="custom-input" rows={4} placeholder={t('news_body')} value={newArticle.body} onChange={e=>setNewArticle({...newArticle, body:e.target.value})} maxLength={200}/></div><motion.button whileTap={{scale:0.95}} className="action-btn" onClick={addNews}><Plus size={20}/> {t('pub')}</motion.button></div>{news.map(n => (<div key={n.id} className="list-item-compact"><span>{n.title}</span><Trash2 size={20} color="red" onClick={()=>deleteNews(n.id)}/></div>))}</>
                  ) : (
                    <div className="admin-card"><div className="admin-header"><h3>{t('manage_menu')}</h3></div><div className="admin-cat-grid">{MENU_CATEGORIES.map(cat => (<div key={cat.id} className={`cat-select-btn ${newMenu.cat === cat.id ? 'active' : ''}`} onClick={()=>setNewMenu({...newMenu, cat: cat.id})}>{cat.label}</div>))}</div><div className="input-group"><input className="custom-input" placeholder="Назва меню" value={newMenu.title} onChange={e=>setNewMenu({...newMenu, title:e.target.value})}/></div><div className="input-group"><textarea className="custom-input" placeholder={t('menu_desc')} value={newMenu.desc} onChange={e=>setNewMenu({...newMenu, desc:e.target.value})}/></div><div className="input-group"><input className="custom-input" type="number" placeholder={t('menu_price')} value={newMenu.price} onChange={e=>setNewMenu({...newMenu, price:e.target.value})}/></div><motion.button whileTap={{scale:0.95}} className="action-btn file-btn"><FileText size={20}/> {t('upload_pdf')}</motion.button><motion.button whileTap={{scale:0.95}} className="action-btn" onClick={saveMenu}><Plus size={20}/> Зберегти меню</motion.button>{menus.map(m => (<div key={m.id} className="list-item-compact" style={{marginTop:10}}><div><div style={{fontWeight:800}}>{m.title}</div><div style={{opacity:0.7, fontSize:12}}>{m.price} ₴ / {MENU_CATEGORIES.find(c=>c.id===m.cat)?.label}</div></div><Trash2 size={20} color="red" onClick={()=>deleteMenu(m.id)}/></div>))}</div>
                  )}
                </div>
              </motion.div>
            )}

            {viewArticle && (
              <motion.div className="fullscreen-page" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:"spring", damping:25}} style={{zIndex:300}}>
                <div className="page-nav-header"><motion.div className="back-btn-circle" onClick={()=>setViewArticle(null)}><X size={24}/></motion.div><div className="page-nav-title">News</div><div></div></div>
                <div className="scroll-content" style={{alignItems:'flex-start', paddingTop: 20}}><div className="news-card" style={{background: viewArticle.bg, color: viewArticle.text, width:'100%', marginBottom:20, height:'auto', minHeight:120}}><div className="news-date">{viewArticle.date}</div><div className="news-title" style={{fontSize:24}}>{viewArticle.title}</div></div><div style={{fontSize:16, lineHeight:1.6, whiteSpace:'pre-wrap'}}>{viewArticle.body}</div></div>
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