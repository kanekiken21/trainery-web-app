import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', textAlign: 'center' }}>
      <h1>TRAINERY 🇺🇦</h1>
      <p>Фитнес-простір для дівчат</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '16px',
        backgroundColor: '#f5f5f7'
      }}>
        <h3>Осінній Марафон</h3>
        <p>Старт: 20 жовтня</p>
        <p><b>Ціна: 500 грн</b></p>
        <button style={{
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Приєднатися
        </button>
      </div>
    </div>
  )
}

export default App