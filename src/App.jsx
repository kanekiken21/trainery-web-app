import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, Activity, User, ChevronRight } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('Чемпіонка');

  // Пытаемся достать имя из Телеграма
  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name) {
      setUsername(window.Telegram.WebApp.initDataUnsafe.user.first_name);
    }
    // Сообщаем Телеграму, что приложение готово (убирает белый экран загрузки)
    window.Telegram?.WebApp?.ready();
    // Растягиваем на весь экран
    window.Telegram?.WebApp?.expand();
  }, []);

  // Компонент "Пружинная кнопка"
  const SpringButton = ({ children, onClick, className, style }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={onClick}
      className={`spring-btn ${className || ''}`}
      style={style}
    >
      {children}
    </motion.button>
  );

  // Анимация смены страниц
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.02 }
  };

  const pageTransition = {
    type: "tween",
    ease: "circOut",
    duration: 0.3
  };

  return (
    <div className="app-container">
      
      {/* --- ОСНОВНАЯ ОБЛАСТЬ КОНТЕНТА --- */}
      <div className="content-scrollable">
        <AnimatePresence mode="wait">
          
          {/* 1. ГЛАВНАЯ */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial="initial" animate="in" exit="out"
              variants={pageVariants} transition={pageTransition}
              className="page-content"
            >
              <header className="top-header">
                <div>
                  <h1 className="greeting">Привіт, {username}! 👋</h1>
                  <p className="subtitle">Готова до тренування?</p>
                </div>
                <div className="avatar-placeholder">
                  <User size={20} color="#fff"/>
                </div>
              </header>

              <div className="section-title">Актуальне</div>
              
              {/* Баннер (как сторис или важное событие) */}
              <motion.div 
                className="hero-card"
                whileTap={{ scale: 0.98 }}
              >
                <div className="hero-text">
                  <h3>Осінній Марафон</h3>
                  <p>Старт 20 жовтня</p>
                </div>
                <div className="hero-icon">🔥</div>
              </motion.div>

              <div className="info-grid">
                <div className="info-card">
                  <span>💧</span>
                  <p>Вода</p>
                  <b>0.5 л</b>
                </div>
                <div className="info-card">
                  <span>👣</span>
                  <p>Кроки</p>
                  <b>2,300</b>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. МАРАФОНЫ */}
          {activeTab === 'marathons' && (
            <motion.div 
              key="marathons"
              initial="initial" animate="in" exit="out"
              variants={pageVariants} transition={pageTransition}
              className="page-content"
            >
              <h2 className="page-title">Марафони</h2>
              
              <div className="program-card">
                <div className="card-image-placeholder" style={{background: '#FF9966'}}>
                  <span>21 день</span>
                </div>
                <div className="card-body">
                  <h3>Схуднення Pro</h3>
                  <p>Інтенсивні тренування та меню</p>
                  <div className="card-footer">
                    <span className="price">500 ₴</span>
                    <SpringButton className="buy-btn">Приєднатися</SpringButton>
                  </div>
                </div>
              </div>

              <div className="program-card">
                <div className="card-image-placeholder" style={{background: '#a18cd1'}}>
                  <span>14 днів</span>
                </div>
                <div className="card-body">
                  <h3>Здорова спина</h3>
                  <p>Йога та розтяжка</p>
                  <div className="card-footer">
                    <span className="price">350 ₴</span>
                    <SpringButton className="buy-btn">Приєднатися</SpringButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. ЗДОРОВЬЕ */}
          {activeTab === 'health' && (
            <motion.div 
              key="health"
              initial="initial" animate="in" exit="out"
              variants={pageVariants} transition={pageTransition}
              className="page-content"
            >
              <h2 className="page-title">Моє здоров'я</h2>
              
              <div className="stat-row">
                <div className="stat-card">
                  <p>Вага</p>
                  <h3>58.4 <span className="unit">кг</span></h3>
                </div>
                <div className="stat-card">
                  <p>Талія</p>
                  <h3>62 <span className="unit">см</span></h3>
                </div>
              </div>

              <div className="long-card">
                <div className="card-row">
                  <div>
                    <h3>Календар циклу</h3>
                    <p style={{color: '#ff4081'}}>3-й день циклу</p>
                  </div>
                  <ChevronRight color="#ccc" />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- НИЖНИЙ ОСТРОВ (МЕНЮ) --- */}
      <div className="bottom-nav-container">
        <div className="nav-island">
          <button 
            className={activeTab === 'home' ? 'active' : ''} 
            onClick={() => setActiveTab('home')}
          >
            <Home size={24} strokeWidth={activeTab === 'home' ? 3 : 2} />
            {activeTab === 'home' && <motion.div layoutId="bubble" className="bubble" />}
          </button>
          
          <button 
            className={activeTab === 'marathons' ? 'active' : ''} 
            onClick={() => setActiveTab('marathons')}
          >
            <Zap size={24} strokeWidth={activeTab === 'marathons' ? 3 : 2} />
            {activeTab === 'marathons' && <motion.div layoutId="bubble" className="bubble" />}
          </button>
          
          <button 
            className={activeTab === 'health' ? 'active' : ''} 
            onClick={() => setActiveTab('health')}
          >
            <Activity size={24} strokeWidth={activeTab === 'health' ? 3 : 2} />
            {activeTab === 'health' && <motion.div layoutId="bubble" className="bubble" />}
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;