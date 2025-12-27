import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Lock, Moon, Sun, Globe, ArrowLeft, ChevronRight, Sparkles, Instagram, Send, Users, CalendarHeart, Utensils, Scale, CreditCard, HelpCircle, X, BookOpen, Check, Search, FileText, Flame } from 'lucide-react';
import './App.css';

const ADMIN_ID = 8297304095;

const MONTHS_UK = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const NEWS_THEMES = [
  { bg: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', text: '#fff' },
  { bg: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', text: '#000' },
  { bg: 'linear-gradient(135deg, #333 0%, #000 100%)', text: '#fff' }
];

const MENU_CATEGORIES = [
  { id: '1400', label: '1400 ККАЛ' },
  { id: '1600', label: '1600 ККАЛ' }
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
    faq_title: "Інфо", faq_text: "Обирай 'Standard' для поточного місяця або 'Early Bird' для запису на майбутні зі знижкою!",
    add_news: "Додати новину", news_title: "Заголовок", news_body: "Текст",
    pub: "Опублікувати", del: "Видалити",
    menu_buy: "Купити", menu_empty: "Меню ще не готове", menu_soon: "Слідкуй за оновленнями!",
    manage_menu: "Додати Меню", menu_desc: "Опис меню", menu_price: "Ціна", upload_pdf: "Завантажити PDF",
    collection: "Моя колекція", purchased: "Придбано", open_pdf: "Відкрити PDF",
    search: "Пошук меню...", empty_coll: "Тут поки порожньо"
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
    faq_title: "Info", faq_text: "Choose 'Standard' for current month or 'Early Bird' for future months with discount!",
    add_news: "Add News", news_title: "Title", news_body: "Body",
    pub: "Publish", del: "Delete",
    menu_buy: "Buy", menu_empty: "Menu not ready yet", menu_soon: "Stay tuned!",
    manage_menu: "Add Menu", menu_desc: "Menu Description", menu_price: "Price", upload_pdf: "Upload PDF",
    collection: "My Collection", purchased: "Purchased", open_pdf: "Open PDF",
    search: "Search menu...", empty_coll: "It's empty here"
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const tg = window.Telegram.WebApp;
    tg.ready(); tg.expand();
    setUser(tg.initDataUnsafe?.user || { first_name: 'User', username: 'user', id: 8297304095 });
  }, []);

  const handleLink = (url, isTg) => { if(isTg) window.Telegram.WebApp.openTelegramLink(url); else window.Telegram.WebApp.openLink(url); };
  const copyId = () => { if(user?.id) { navigator.clipboard.writeText(user.id.toString()); }};

  const getMarathonMonths = () => {
    const res = [];
    for(let i=0; i<4; i++) {
      const idx = (currentMonthIdx + i) % 12;
      res.push({ name: monthsList[idx], isEarly: i > 0, idx: i });
    }
    return res;
  };

  // ФУНКЦИИ
  const addNews = () => {
    if(!newArticle.title) return;
    const theme = NEWS_THEMES[newArticle.themeIdx];
    const updated = [{...newArticle, id: Date.now(), date: new Date().toLocaleDateString(), bg: theme.bg, text: theme.text}, ...news];
    setNews(updated); localStorage.setItem('app_news', JSON.stringify(updated));
    setNewArticle({ title: '', body: '', themeIdx: 0 });
  };
  const deleteNews = (id) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated); localStorage.setItem('app_news', JSON.stringify(updated));
  };
  const saveMenu = () => {
    if(!newMenu.title) return;
    const menu = { ...newMenu, id: Date.now() };
    const updated = [...menus, menu];
    setMenus(updated); localStorage.setItem('app_menus', JSON.stringify(updated));
    setNewMenu({ title: '', desc: '', price: '', cat: '1400' });
  };
  const deleteMenu = (id) => {
    const updated = menus.filter(m => m.id !== id);
    setMenus(updated); localStorage.setItem('app_menus', JSON.stringify(updated));
  };
  const buyMenu = (m) => {
    const updated = [...myCollection, m];
    setMyCollection(updated); localStorage.setItem('app_collection', JSON.stringify(updated));
    setViewMenu(false); setViewCollection(true);
  };
  const handleMenuScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
    setActiveMenuIndex(index);
  };

  const filteredMenus = menus.filter(m => m.cat === activeCategory);
  const filteredCollection = myCollection.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="app-container">
      <div className="particles-container"><div className="particle p1"></div><div className="particle p2"></div></div>
      
      {['home', 'marathons', 'health'].includes(activeTab) && (
        <header className="fixed-header">
          <div></div>
          <div className="header-center">
            <div className="logo-glow-wrapper"><div className="logo-glow"></div><img src="1.png" className="app-logo"/></div>
            <span className="header-title">Trainery</span>
          </div>
          <div className="profile-btn" onClick={() => setActiveTab('profile')}>
            {user?.photo_url ? <img src={user.photo_url}/> : <User size={22}/>}
          </div>
        </header>
      )}

      <div className="page-wrapper">
        <AnimatePresence mode="wait">
          
          {activeTab === 'home' && (
            <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{width:'100%'}}>
              <div className="section-header"><h2>{t('hello')}</h2><p>{t('sub')}</p></div>
              {news.length > 0 ? (
                <div className="news-carousel">
                  {news.map(item => (
                    <div key={item.id} className="news-card" style={{background: item.bg, color: item.text}} onClick={() => setViewArticle(item)}>
                      <div className="news-date">{item.date}</div><div className="news-title">{item.title}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card"><h3>{t('empty_news')}</h3><p>{t('empty_sub')}</p></div>
              )}
            </motion.div>
          )}

          {activeTab === 'marathons' && (
            <motion.div key="marathons" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{width:'100%'}}>
               <div className="section-header"><h2>{t('m_title')}</h2><p>{t('m_sub')}</p></div>
               <div className="glass-card marathon-card">
                 <div className="faq-btn" onClick={()=>setShowFaq(!showFaq)}><HelpCircle size={18}/></div>
                 {showFaq && <div className="faq-tooltip">{t('faq_text')}</div>}
                 <div className="month-grid">
                   {getMarathonMonths().map((m) => (
                     <div key={m.idx} className={`month-card ${selectedMonth === m.idx ? 'selected' : ''}`} onClick={() => setSelectedMonth(m.idx)}>
                       <div className="month-name">{m.name}</div>
                       <div className="month-price">{m.isEarly ? t('price_early') : t('price_cur')}</div>
                       <div className={`month-tag ${m.isEarly ? 'tag-early' : 'tag-standard'}`}>{m.isEarly ? t('early') : t('standard')}</div>
                     </div>
                   ))}
                 </div>
                 <button className="action-btn">{t('buy_btn')}</button>
               </div>
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div key="health" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{width:'100%'}}>
               <div className="section-header"><h2>{t('h_title')}</h2><p>{t('h_sub')}</p></div>
               <div className="health-banner" style={{background:'linear-gradient(135deg, #FF9966, #FF5E62)'}}><div className="health-text"><h3>{t('cal')}</h3></div><Flame size={28} color="white"/></div>
               <div className="health-banner" style={{background:'linear-gradient(135deg, #F6D365, #FDA085)'}}><div className="health-text"><h3>{t('cyc')}</h3></div><CalendarHeart size={28} color="white"/></div>
               <div className="health-banner" style={{background:'linear-gradient(135deg, #a18cd1, #fbc2eb)'}}><div className="health-text"><h3>{t('bod')}</h3></div><Scale size={28} color="white"/></div>
               <div className="health-banner" onClick={()=>setViewMenu(true)} style={{background:'linear-gradient(135deg, #36D1DC, #5B86E5)'}}><div className="health-text"><h3>{t('menu')}</h3></div><Utensils size={28} color="white"/></div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
             <motion.div key="profile" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} style={{width:'100%'}}>
               <div className="section-header"><h2>{t('prof')}</h2></div>
               <div className="avatar-section">{user?.photo_url ? <img src={user.photo_url} className="avatar-big"/> : <User size={50}/>}</div>
               <div className="menu-stack">
                 <div className="menu-row" onClick={()=>setViewCollection(true)}><BookOpen size={20}/> {t('collection')}</div>
                 <div className="menu-row" onClick={()=>setActiveTab('settings')}><Settings size={20}/> {t('set')}</div>
                 {user?.id === ADMIN_ID && <div className="menu-row" onClick={()=>setActiveTab('admin')}><Lock size={20}/> {t('adm')}</div>}
               </div>
               <button className="action-btn" style={{marginTop:30, background:'transparent', color:'var(--text)', border:'1px solid var(--border)'}} onClick={()=>setActiveTab('home')}>Back</button>
             </motion.div>
          )}

          {viewMenu && (
            <motion.div key="menu-view" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fullscreen-page" style={{zIndex:200, background:'var(--bg)'}}>
              <div className="page-nav-header"><div className="back-btn-circle" onClick={()=>setViewMenu(false)}><X size={24}/></div></div>
              <div className="scroll-content">
                <div className="category-switcher">{MENU_CATEGORIES.map(c => <div key={c.id} className={`cat-btn ${activeCategory===c.id?'active':''}`} onClick={()=>setActiveCategory(c.id)}>{c.label}</div>)}</div>
                {filteredMenus.length > 0 ? (
                  <>
                  <div className="menu-carousel" onScroll={handleMenuScroll}>
                    {filteredMenus.map(m => (
                      <div key={m.id} className="menu-card-swipe">
                        <div style={{fontSize:24, fontWeight:800}}>{m.title}</div>
                        <div className="menu-desc-clamp">{m.desc}</div>
                        <button className="menu-price-tag" onClick={()=>buyMenu(m)}>{t('menu_buy')} {m.price}</button>
                      </div>
                    ))}
                  </div>
                  <div className="pagination-dots">{filteredMenus.map((_, i)=><div key={i} className={`dot ${i===activeMenuIndex?'active':''}`}/>)}</div>
                  </>
                ) : <div className="glass-card"><h3>{t('menu_empty')}</h3></div>}
              </div>
            </motion.div>
          )}

          {viewCollection && (
            <motion.div key="collection" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="fullscreen-page" style={{zIndex:200, background:'var(--bg)'}}>
               <div className="page-nav-header"><div className="back-btn-circle" onClick={()=>setViewCollection(false)}><ArrowLeft size={24}/></div></div>
               <div className="scroll-content">
                 <div className="input-group"><div className="input-with-icon"><Search size={20} className="input-icon"/><input className="custom-input has-icon" placeholder={t('search')} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div></div>
                 {myCollection.filter(m=>m.title.toLowerCase().includes(searchTerm.toLowerCase())).map((m,i)=>(
                   <div key={i} className="collection-card">
                     <div><div style={{fontWeight:800}}>{m.title}</div></div><div className="pdf-btn">{t('open_pdf')}</div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
             <div className="scroll-content" style={{paddingTop:80}}>
               <div className="admin-tab-switch"><div className={`tab-btn ${adminTab==='news'?'active':''}`} onClick={()=>setAdminTab('news')}>News</div><div className={`tab-btn ${adminTab==='menu'?'active':''}`} onClick={()=>setAdminTab('menu')}>Menu</div></div>
               {adminTab === 'news' ? (
                 <div className="admin-card">
                   <div className="input-group"><input className="custom-input" placeholder="Title" value={newArticle.title} onChange={e=>setNewArticle({...newArticle, title:e.target.value})}/></div>
                   <button className="action-btn" onClick={addNews}>Add News</button>
                   {news.map(n=><div key={n.id} style={{display:'flex',justifyContent:'space-between',marginTop:10}}>{n.title} <Trash2 onClick={()=>deleteNews(n.id)}/></div>)}
                 </div>
               ) : (
                 <div className="admin-card">
                    <div className="admin-cat-grid">{MENU_CATEGORIES.map(c=><div key={c.id} className={`cat-select-btn ${newMenu.cat===c.id?'active':''}`} onClick={()=>setNewMenu({...newMenu, cat:c.id})}>{c.label}</div>)}</div>
                    <div className="input-group"><input className="custom-input" placeholder="Title" value={newMenu.title} onChange={e=>setNewMenu({...newMenu, title:e.target.value})}/></div>
                    <div className="input-group"><input className="custom-input" placeholder="Desc" value={newMenu.desc} onChange={e=>setNewMenu({...newMenu, desc:e.target.value})}/></div>
                    <div className="input-group"><input className="custom-input" placeholder="Price" value={newMenu.price} onChange={e=>setNewMenu({...newMenu, price:e.target.value})}/></div>
                    <button className="action-btn" onClick={saveMenu}>Add Menu</button>
                    {menus.map(m=><div key={m.id} style={{marginTop:10, display:'flex', justifyContent:'space-between'}}>{m.title} <Trash2 onClick={()=>deleteMenu(m.id)}/></div>)}
                 </div>
               )}
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="scroll-content" style={{paddingTop:80}}>
               <div className="menu-row" onClick={toggleTheme}>{theme==='light'?<Moon/>:<Sun/>} Theme</div>
               <div className="menu-row" onClick={()=>setLang(lang==='uk'?'en':'uk')}><Globe/> Lang</div>
               <button className="action-btn" style={{marginTop:20, background:'transparent', color:'var(--text)', border:'1px solid var(--border)'}} onClick={()=>setActiveTab('profile')}>Back</button>
             </div>
          )}

        </AnimatePresence>
      </div>

      {['home', 'marathons', 'health'].includes(activeTab) && (
        <div className="bottom-nav">
          <div className="nav-island">
            <button onClick={()=>setActiveTab('home')} className={`nav-btn ${activeTab==='home'?'active':''}`}><Home/></button>
            <button onClick={()=>setActiveTab('marathons')} className={`nav-btn ${activeTab==='marathons'?'active':''}`}><Zap/></button>
            <button onClick={()=>setActiveTab('health')} className={`nav-btn ${activeTab==='health'?'active':''}`}><Activity/></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;