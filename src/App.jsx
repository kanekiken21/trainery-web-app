import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, Settings, Sparkles, Lock } from 'lucide-react';
import './App.css';

// --- ДАННЫЕ (Управляешь ими здесь) ---

// Если массив пустой [], будет показана заглушка "Скоро"
// Максимум 3 элемента!
const NEWS = [
  // { id: 1, title: 'Як пити воду?', color: '#4facfe' }, 
  // { id: 2, title: 'Нове тренування', color: '#ff9a9e' },
];

const MARATHONS = [
  { id: 1, type: 'standard', title: 'Жиротоп: Жовтень', desc: 'Старт 20.10 • 21 день', price: 650 },
  { id: 2, type: 'early', title: 'Рання пташка 🐣', desc: 'Листопад / Грудень', price: 550 }
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    // 1. Инициализация Телеграма
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // Принудительный фуллскрин
    
    // Настройка цветов хедера под тему
    tg.setHeaderColor('#F2F2F7'); 
    tg.setBackgroundColor('#F2F2F7');

    // 2. Получение данных юзера
    const tgUser = tg.initDataUnsafe?.user;
    
    if (tgUser) {
      setUser(tgUser);
    } else {
      // Фейк данные ДЛЯ ТЕСТА В БРАУЗЕРЕ (чтобы ты видел верстку)
      // В реальном боте они заменятся на настоящие
      setUser({ 
        first_name: 'Чемпіонка', 
        username: 'super_girl', 
        id: 12345678, 
        photo_url: null 
      });
    }
  }, []);

  // --- АНИМАЦИИ ---
  // Каскадное появление элементов (по очереди)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const SpringButton = ({ children, onClick, className }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400 }}
      onClick={onClick}
      className={`spring-btn ${className || ''}`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="app-container">
      
      {/* --- ШАПКА --- */}
      <header className="fixed-header">
        <div className="header-text">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
          >
            Trainery
          </motion.h1>
        </div>
        <motion.div 
          className="profile-bubble"
          whileTap={{ scale: 0.85 }}
          onClick={() => setProfileOpen(true)}
        >
           {user?.photo_url ? (
             <img src={user.photo_url} alt="Ava" />
           ) : (
             <User size={20} color="#333"/>
           )}
        </motion.div>
      </header>

      {/* --- КОНТЕНТ --- */}
      <div className="content-area">
        <AnimatePresence mode="wait">
          
          {/* 1. ГЛАВНАЯ */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              variants={containerVariants}
              initial="hidden" animate="show" exit="hidden"
              className="page"
            >
              <motion.div variants={itemVariants} className="greeting-block">
                <h2>Привіт, {user?.first_name}! 👋</h2>
                <p>Твій фітнес-простір</p>
              </motion.div>

              {/* СЛАЙДЕР НОВОСТЕЙ */}
              <motion.div variants={itemVariants} className="news-section">
                {NEWS.length > 0 ? (
                  // Если есть новости
                  <div className="news-slider">
                    {NEWS.slice(0, 3).map(item => (
                      <div 
                        key={item.id} 
                        className="news-card"
                        style={{ background: `linear-gradient(135deg, ${item.color} 0%, #fff 180%)` }}
                      >
                        <h3>{item.title}</h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Если новостей нет (Заглушка)
                  <div className="empty-news-card">
                    <Sparkles size={32} color="#FFD700" />
                    <div className="empty-text">
                      <h3>Новини готуються... 🤫</h3>
                      <p>Тут з'являться корисні поради</p>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="daily-tip">
                <span className="emoji">💧</span>
                <div className="text">
                  <b>Нагадування</b>
                  <p>Не забудь випити склянку води!</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 2. МАРАФОНЫ */}
          {activeTab === 'marathons' && (
            <motion.div 
              key="marathons"
              variants={containerVariants}
              initial="hidden" animate="show" exit="hidden"
              className="page"
            >
              <motion.h2 variants={itemVariants} className="page-title">Марафони ⚡️</motion.h2>
              
              {MARATHONS.map((item) => (
                <motion.div variants={itemVariants} key={item.id} className={`marathon-card ${item.type}`}>
                  <div className="m-header">
                    <h3>{item.title}</h3>
                    {item.type === 'standard' && <span className="tag">ХІТ 🔥</span>}
                  </div>
                  <p className="m-desc">{item.desc}</p>
                  <div className="m-footer">
                    <span className="m-price">{item.price} ₴</span>
                    <SpringButton className="m-btn">
                      {item.type === 'standard' ? 'Купити' : 'Бронь'}
                    </SpringButton>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 3. ЗДОРОВЬЕ (ЗАГЛУШКА) */}
          {activeTab === 'health' && (
            <motion.div 
              key="health"
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="page center-page"
            >
              <div className="placeholder-circle">
                <Lock size={32} color="#FF4081" />
              </div>
              <h3>Розділ в розробці</h3>
              <p>Графіки ваги та цикл з'являться тут</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- НИЖНИЙ ОСТРОВ --- */}
      <div className="bottom-nav-container">
        <div className="nav-island">
          <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>
            <Home size={24} strokeWidth={2.5} />
            {activeTab === 'home' && <motion.div layoutId="dot" className="nav-dot" />}
          </button>
          
          <button onClick={() => setActiveTab('marathons')} className={activeTab === 'marathons' ? 'active' : ''}>
            <Zap size={24} strokeWidth={2.5} />
            {activeTab === 'marathons' && <motion.div layoutId="dot" className="nav-dot" />}
          </button>
          
          <button onClick={() => setActiveTab('health')} className={activeTab === 'health' ? 'active' : ''}>
            <Activity size={24} strokeWidth={2.5} />
            {activeTab === 'health' && <motion.div layoutId="dot" className="nav-dot" />}
          </button>
        </div>
      </div>

      {/* --- ПРОФИЛЬ (МОДАЛКА) --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div 
              className="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
            />
            <motion.div 
              className="modal"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="modal-top" onClick={() => setProfileOpen(false)}>
                <div className="bar"></div>
              </div>
              
              <div className="profile-content">
                <div className="big-avatar">
                   {user?.photo_url ? <img src={user.photo_url} alt="Me" /> : <User size={40} />}
                </div>
                
                <h3>{user?.first_name} {user?.last_name}</h3>
                <div className="user-details">
                  <span className="chip">@{user?.username || 'user'}</span>
                  <span className="chip">ID: {user?.id}</span>
                </div>

                <div className="menu-list">
                  <div className="menu-item">
                    <Settings size={20} /> Налаштування
                  </div>
                  <div className="menu-item" style={{color: '#FF2D55'}}>
                    <Lock size={20} /> Адмін-панель (скоро)
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;