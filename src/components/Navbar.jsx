import React from 'react';

export default function Navbar({ cambiarSeccion, alHacerLogin }) {
  return (
    <nav className="wwe-nav shadow-lg">
      <div className="container-fluid d-flex align-items-center h-100 px-4">
        
        {/* LOGO IZQUIERDA */}
        <div className="nav-logo" onClick={() => cambiarSeccion('inicio')} style={{cursor: 'pointer'}}>
          LUCHA <span>LIBRE</span> AAA
        </div>

        {/* LINKS CENTRALES */}
        <ul className="nav-links">
          <li>
            <a href="#" className="nav-link-item" onClick={() => cambiarSeccion('inicio')}>
              Inicio
            </a>
          </li>
          <li>
            <a href="#" className="nav-link-item" onClick={() => cambiarSeccion('noticias')}>
              Noticias
            </a>
          </li>
          <li>
            <a href="#" className="nav-link-item" onClick={() => cambiarSeccion('tienda')}>
              Tienda
            </a>
          </li>
          <li>
            <a href="#" className="nav-link-item" onClick={() => cambiarSeccion('luchadores')}>
              Luchadores
            </a>
          </li>
          <li>
            <a href="#" className="nav-link-item" onClick={() => cambiarSeccion('eventos')}>
              Eventos
            </a>
          </li>
        </ul>

        {/* BUSCADOR Y ADMIN DERECHA */}
        <div className="nav-right-section d-flex align-items-center gap-3">
          
          {/* Caja de Búsqueda */}
          <div className="search-container d-none d-lg-flex">
            <input 
              type="text" 
              className="wwe-input" 
              placeholder="BUSCAR SUPERESTRELLA..." 
            />
            <button className="search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* Botón Admin */}
          <button className="btn-admin-wwe" onClick={alHacerLogin}>
            <i className="fa-solid fa-user-shield me-2"></i>
            ADMIN
          </button>
          
        </div>

      </div>
    </nav>
  );
}