import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, ChevronRight } from 'lucide-react';
import './App.css';

// --- ДАННЫЕ (Потом подключим БД) ---
const MARATHONS = [
  { id: 1, type: 'standard', title: 'Жиротоп: Жовтень', desc: 'Старт 20.10 • 21 день', price: 650 },
  { id: 2, type: 'early', title: 'Рання пташка 🐣', desc: 'Бронюй листопад/грудень', price: 550 }
];

// Новости (Слайдер на главной)
const NEWS = [
  { id: 1, title: 'Як пити воду?', text: '5 порад для новачків', color: '#4facfe' },
  { id: 2, title: 'Нове тренування', text: 'Вже на YouTube каналі', color: '#ff9a9e' },
  { id: 3, title: 'Рецепт сніданку', text: 'Білковий омлет за 5 хв', color: '#66a6ff' }
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    window.Telegram?.WebApp?.expand();
    window.Telegram?.WebApp?.ready();
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    setUser(tgUser || { first_name: 'Чемпіонка', username: 'fit_girl' });
  }, []);

  // Анимация страниц
  const pageVariants = {
    initial: { opacity: 0, scale: 0.96 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.04 }
  };

  // Компонент: Пружинная кнопка
  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400 }}
      onClick={onClick}
      className={`spring-btn ${className || ''}`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="app-container">
      
      {/* --- ВЕРХНЯЯ ШАПКА (ВСЕГДА ВИДНА) --- */}
      <header className="fixed-header">
        <div className="header-text">
          <h1>Trainery</h1>
        </div>
        <motion.div 
          className="profile-bubble"
          whileTap={{ scale: 0.8 }}
          onClick={() => setProfileOpen(true)}
        >
           {user?.photo_url ? <img src={user.photo_url} /> : <User size={20} color="#333"/>}
        </motion.div>
      </header>

      {/* --- ОСНОВНОЙ КОНТЕНТ (СМЕНА ВКЛАДОК) --- */}
      <div className="content-area">
        <AnimatePresence mode="wait">
          
          {/* 1. ГЛАВНАЯ (НОВОСТИ) */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial="initial" animate="in" exit="out"
              variants={pageVariants} transition={{ duration: 0.2 }}
              className="page"
            >
              <div className="greeting-block">
                <h2>Привіт, {user?.first_name}! 👋</h2>
                <p>Твій дайджест на сьогодні</p>
              </div>

              {/* СЛАЙДЕР НОВОСТЕЙ (Горизонтальный скролл) */}
              <div className="news-slider">
                {NEWS.map(item => (
                  <motion.div 
                    key={item.id} 
                    className="news-card"
                    style={{ background: `linear-gradient(135deg, ${item.color} 0%, #fff 150%)` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <div className="news-icon"><ChevronRight size={18}/></div>
                  </motion.div>
                ))}
              </div>

              <div className="daily-tip">
                <span className="emoji">💡</span>
                <div className="text">
                  <b>Порада дня:</b>
                  <p>Зроби 5000 кроків до обіду!</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. МАРАФОНЫ */}
          {activeTab === 'marathons' && (
            <motion.div 
              key="marathons"
              initial="initial" animate="in" exit="out"
              variants={pageVariants} transition={{ duration: 0.2 }}
              className="page"
            >
              <h2 className="page-title">Марафони</h2>
              {MARATHONS.map((item) => (
                <div key={item.id} className={`marathon-card ${item.type}`}>
                  <div className="m-header">
                    <h3>{item.title}</h3>
                    {item.type === 'standard' && <span className="tag">🔥 ХІТ</span>}
                  </div>
                  <p className="m-desc">{item.desc}</p>
                  <div className="m-footer">
                    <span className="m-price">{item.price} ₴</span>
                    <SpringButton className="m-btn">
                      {item.type === 'standard' ? 'Купити' : 'Забронювати'}
                    </SpringButton>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 3. ЗДОРОВЬЕ (ЗАГЛУШКА) */}
          {activeTab === 'health' && (
            <motion.div 
              key="health"
              initial="initial" animate="in" exit="out"
              variants={pageVariants} transition={{ duration: 0.2 }}
              className="page center-page"
            >
              <div className="placeholder-circle">
                <Activity size={40} color="#FF4081" />
              </div>
              <h3>Здоров'я</h3>
              <p>Тут будуть твої графіки ваги та календар циклу</p>
              <SpringButton className="demo-btn">Скоро...</SpringButton>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- НИЖНИЙ ОСТРОВ (МЕНЮ) --- */}
      <div className="bottom-nav-container">
        <div className="nav-island">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
            <Home size={24} />
            {activeTab === 'home' && <motion.div layoutId="dot" className="nav-dot" />}
          </button>
          
          <button onClick={() => setActiveTab('marathons')} className={activeTab === 'marathons' ? 'active' : ''}>
            <Zap size={24} />
            {activeTab === 'marathons' && <motion.div layoutId="dot" className="nav-dot" />}
          </button>
          
          <button onClick={() => setActiveTab('health')} className={activeTab === 'health' ? 'active' : ''}>
            <Activity size={24} />
            {activeTab === 'health' && <motion.div layoutId="dot" className="nav-dot" />}
          </button>
        </div>
      </div>

      {/* --- ПРОФИЛЬ (МОДАЛКА) --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileOpen(false)}/>
            <motion.div className="modal" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25 }}>
              <div className="modal-top" onClick={() => setProfileOpen(false)}><div className="bar"></div></div>
              <div className="profile-content">
                <div className="big-avatar"><User size={40}/></div>
                <h3>{user?.first_name}</h3>
                <p>@{user?.username}</p>
                <button className="settings-row"><Settings size={18}/> Налаштування</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;