import React, { useState, useEffect } from 'react';
import './index.css';
import { Tienda } from './pages/Tienda';
import { Luchadores } from './pages/Luchadores';
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [noticias, setNoticias] = useState([
    {
      id: 1,
      tag: "OFICIAL",
      titulo: "BAYLEY LLEGA A MÉXICO PARA AYUDAR A LA CATALINA Y LOLA VICE EN AAA WORLDWIDE",
      resumen: "La ex campeona de WWE aparece en AAA para respaldar a La Catalina y Lola Vice en su guerra contra las rudas y encender la división femenil rumbo al Reina de Reinas.",
      foto: "https://i.ytimg.com/vi/FWr3zD4DWf4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAErDnlCVhrm_-5Uge1LWTNxCB-jQ"
    },
    {
      id: 2,
      tag: "EVENTO",
      titulo: "PSYCHO CLOWN YA NO CONFÍA EN PAGANO",
      resumen: "Las sospechas siguen creciendo tras los ataques a Psycho Circus y la tensión entre los campeones en pareja ya comienza a explotar en AAA Worldwide.",
      foto: "https://i.ytimg.com/vi/KtmJxRwAVko/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBvS9y1A7q_v5O8t5R21Z8eN-AblA"
    },
    {
      id: 3,
      tag: "ESTELAR",
      titulo: "OFICIAL: GRANDE AMERICANO VS ORIGINAL GRANDE AMERICANO",
      resumen: "Las tensiones explotaron tras el ataque a Andrea y ahora ambos luchadores se jugarán la máscara para definir quién es el verdadero Grande Americano..",
      foto: "https://i.ytimg.com/vi/bOs0zJ3q8FE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAvyiTw5mUwODUqYZBEEDiFQkJtUw"
    }
  ]);

  // Los 6 luchadores fijos de la pantalla de inicio
  const [luchadoresFijos] = useState([
    { id: 101, nombre: "Grande Americano", bando: "GANADOR REY DE REYES", imagen: "grandeamericano.png" },
    { id: 102, nombre: "Dominik Mysterio", bando: "MEGA CAMPEÓN TRIPLE A", imagen: "dom.png" },
    { id: 103, nombre: "El Hijo del Vikingo", bando: "QUE CHINGUE SU MADRE", imagen: "hdv.png" },
    { id: 104, nombre: "Psycho Clown", bando: "CAMPEÓN DE PAREJAS", imagen: "psycho.png" },
    { id: 105, nombre: "Flammer", bando: "CAMPEONA REINA DE REINAS", imagen: "flamer.png" },
    { id: 106, nombre: "Lola Vice", bando: "CAMPEONA NXT", imagen: "lola.png" }
  ]);

  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('publico');
  const [credentials, setCredentials] = useState({ user: '', pass: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (credentials.user === 'admin' && credentials.pass === 'triplea2026') {
      setIsLoggedIn(true);
      setShowLogin(false);
      setView('admin');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: credentials.user, password: credentials.pass })
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setShowLogin(false);
        setView('admin');
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  const renderHome = () => (
    <>
      <header className="hero-banner">
        <div className="hero-text">
          <span style={{color: 'var(--aaa-red)', fontWeight: 'bold', letterSpacing: '3px'}}>PRÓXIMA FUNCIÓN</span>
          <h1 className="hero-title">NOCHE DE <br/><span>LOS GRANDES</span></h1>
          <p style={{fontSize: '1.4rem', color: '#888', marginTop: '1rem'}}>ARENA MONTERREY | 30 DE MAYO | 20:30 HRS</p>
          <div style={{marginTop: '2.5rem', display: 'flex', gap: '20px'}}>
            <a 
              href="https://www.superboletos.com/landing-evento/GlosxthQHcEj6O8H3QnCbQ" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-admin" 
              style={{padding: '15px 40px', fontSize: '1.1rem', textDecoration: 'none', display: 'inline-block', textAlign: 'center'}}
            >
              BOLETOS
            </a>
            {/* CAMBIO: El botón CARTELERA ahora no realiza ninguna acción al hacer click */}
            <button className="btn-admin" style={{background: 'transparent', border: '2px solid white', cursor: 'default'}} onClick={(e) => e.preventDefault()}>CARTELERA</button>
          </div>
        </div>
        <div style={{flex: 1.3, background: 'url(https://d1y4lmvozupq5z.cloudfront.net/SuperBoletosRepositorio/apps/27768/app/main_m_x2_EVT140083.webp?v=20260313170602) center/cover'}}></div>
      </header>

      <main className="main-container">
        <section id="noticias" className="section-head">
          <h2>ÚLTIMAS <span>NOTICIAS</span></h2>
        </section>
        <div className="news-grid">
          {noticias.map(item => (
            <div key={item.id} className="news-card">
              <img src={item.foto} className="news-img" alt={item.titulo} />
              <div className="news-body">
                <span style={{color: 'var(--aaa-red)', fontWeight: 'bold', fontSize: '0.8rem'}}>#{item.tag}</span>
                <h3 style={{fontFamily: 'Oswald', fontSize: '1.5rem', margin: '10px 0'}}>{item.titulo}</h3>
                <p style={{color: '#666', fontSize: '0.9rem'}}>{item.resumen}</p>
              </div>
            </div>
          ))}
        </div>

        <section id="luchadores" className="section-head">
          <h2>ELENCO <span>ESTELAR</span></h2>
        </section>
        <div className="roster-grid">
          {luchadoresFijos.map(lucha => (
            <div key={lucha.id} className="wrestler-card">
              <div className="wrestler-img-box" style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
                <img 
                  src={lucha.imagen} 
                  alt={lucha.nombre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              </div>
              <div className="wrestler-info">
                <h3 className="wrestler-name">{lucha.nombre}</h3>
                <p style={{ color: lucha.bando === 'RUDO' ? 'var(--aaa-red)' : '#0055ff', fontWeight: 'bold', fontSize: '0.9rem' }}>{lucha.bando}</p>
                <button className="btn-profile" style={{cursor: 'default'}} onClick={(e) => e.preventDefault()}>VER PERFIL COMPLETO</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );

  const esVistaPublica = ['publico', 'tienda', 'luchadores', 'admin'].includes(view);

  return (
    <div className="site-wrapper" id="inicio">
      {showLogin && (
        <div className="login-overlay">
          <div className="login-card" style={{ display: 'flex', flexDirection: 'row', padding: 0, overflow: 'hidden', maxWidth: '800px', width: '90%' }}>
            <button className="close-btn" onClick={() => setShowLogin(false)} style={{ zIndex: 10 }}>✕</button>
            <div style={{ flex: 1, background: 'url(laparka.png) center/80% no-repeat', minHeight: '400px' }}></div>
            <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#1a1a1a' }}>
              <div className="nav-brand" style={{fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center'}}>AAA <span>ADMIN</span></div>
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label style={{color: '#aaa', fontSize: '0.8rem'}}>USUARIO</label>
                  <input type="text" onChange={(e) => setCredentials({...credentials, user: e.target.value})} required />
                </div>
                <div className="input-group" style={{marginTop: '15px'}}>
                  <label style={{color: '#aaa', fontSize: '0.8rem'}}>CONTRASEÑA</label>
                  <input type="password" onChange={(e) => setCredentials({...credentials, pass: e.target.value})} required />
                </div>
                <button type="submit" className="btn-admin" style={{width: '100%', marginTop: '2rem'}}>ENTRAR AL PANEL</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {esVistaPublica && (
        <nav className="navbar">
          <div onClick={() => setView('publico')} style={{cursor: 'pointer'}} className="nav-brand">LUCHA <span>LIBRE</span> AAA</div>
          <div className="nav-content-right">
            <div className="nav-menu">
              <div onClick={() => setView('publico')} className="nav-item" style={{cursor: 'pointer', color: view === 'publico' ? 'var(--aaa-red)' : '#fff'}}>Inicio</div>
              <div onClick={() => setView('tienda')} className="nav-item" style={{cursor: 'pointer', color: view === 'tienda' ? 'var(--aaa-red)' : '#fff'}}>Tienda</div>
              <div onClick={() => setView('luchadores')} className="nav-item" style={{cursor: 'pointer', color: view === 'luchadores' ? 'var(--aaa-red)' : '#fff'}}>Luchadores</div>
              
              <a 
                href="https://www.superboletos.com/landing-evento/GlosxthQHcEj6O8H3QnCbQ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-item" 
                style={{ cursor: 'pointer', color: '#fff', textDecoration: 'none' }}
              >
                Boletos
              </a>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {isLoggedIn && view !== 'admin' && (
                <button className="btn-admin" style={{ background: '#0055ff' }} onClick={() => setView('admin')}>
                  PANEL ADMIN
                </button>
              )}
              
              <button className="btn-admin" onClick={() => isLoggedIn ? (setIsLoggedIn(false), setView('publico')) : setShowLogin(true)}>
                {isLoggedIn ? "CERRAR SESIÓN" : "ADMIN LOGIN"}
              </button>
            </div>
          </div>
        </nav>
      )}

      {view === 'publico' && renderHome()}
      {view === 'tienda' && (
        <div className="container py-5" style={{marginTop: '80px'}}>
           <Tienda />
        </div>
      )}
      {view === 'luchadores' && (
        <div className="container py-5" style={{marginTop: '80px'}}>
           <Luchadores />
        </div>
      )}
      
      {view === 'admin' && (
        <div className="container py-5" style={{marginTop: '80px'}}>
           <AdminPanel />
        </div>
      )}

      {esVistaPublica && (
        <footer style={{background: '#000', padding: '5rem 2rem', textAlign: 'center', borderTop: '6px solid var(--aaa-red)', color: '#fff'}}>
          <div className="nav-brand" style={{fontSize: '4rem'}}>LUCHA <span>LIBRE</span> AAA</div>
          <p style={{color: '#333', fontSize: '0.9rem'}}>© 2026 LUCHA LIBRE AAA WORLDWIDE · TODOS LOS DERECHOS RESERVADOS</p>
        </footer>
      )}
    </div>
  );
}