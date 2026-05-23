import React, { useState, useEffect } from 'react';

export const Luchadores = () => {
  const [elenco, setElenco] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar los filtros y la paginación
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const luchadoresPorPagina = 12; // Límite solicitado de 12 por pestaña
  const listadoCategorias = ['Todos', 'TÉCNICO', 'RUDO', 'Masculino', 'Femenino', 'Exótico', 'Mini', 'Fallecido', 'Extra'];

  useEffect(() => {
    setLoading(true);
    
    let url = 'http://localhost:5000/luchadores';
    const params = new URLSearchParams();
    
    if (busqueda) params.append('buscar', busqueda);
    if (categoriaActiva !== 'Todos') params.append('categoria', categoriaActiva);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setElenco(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener el elenco desde la BD:", err);
        setLoading(false);
      });
  }, [categoriaActiva, busqueda]);

  // Resetear a la página 1 si cambia el bando o el texto de búsqueda
  const cambiarCategoria = (cat) => {
    setCategoriaActiva(cat);
    setPaginaActual(1);
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  // ORDENAR ALFABÉTICAMENTE DE LA A A LA Z ANTES DE PAGINAR
  const elencoOrdenado = [...elenco].sort((a, b) => {
    const nombreA = a.nombre ? a.nombre.toUpperCase() : '';
    const nombreB = b.nombre ? b.nombre.toUpperCase() : '';
    return nombreA.localeCompare(nombreB);
  });

  // Lógica matemática de la Paginación para el Roster
  const totalPaginas = Math.ceil(elencoOrdenado.length / luchadoresPorPagina) || 1;
  const indiceUltimoLuchador = paginaActual * luchadoresPorPagina;
  const indicePrimerLuchador = indiceUltimoLuchador - luchadoresPorPagina;
  
  // Cortar el arreglo para renderizar solo los 12 correspondientes
  const elencoVisibleEnPagina = elencoOrdenado.slice(indicePrimerLuchador, indiceUltimoLuchador);

  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'absolute',
      left: 0,
      top: '80px', 
      padding: '40px 20px 80px 20px', 
      boxSizing: 'border-box', 
      color: '#000000' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '30px', borderLeft: '8px solid #e11212', paddingLeft: '20px' }}>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '3rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: '#000000' }}>
            ELENCO <span style={{ color: '#e11212' }}>ESTELAR</span>
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#555', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '2px' }}>
            Roster Oficial de Lucha Libre AAA Worldwide
          </p>
        </header>

        {/* Sección de Filtros y Búsqueda */}
        <div style={{ 
          background: '#0a0a0a', 
          padding: '25px', 
          borderRadius: '4px', 
          marginBottom: '40px', 
          border: '1px solid #222',
          borderLeft: '4px solid #e11212' 
        }}>
          {/* Barra de Búsqueda por Texto */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#e11212', marginBottom: '8px', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Buscar Luchador por Nombre
            </label>
            <input 
              type="text" 
              placeholder="ESCRIBE EL NOMBRE DEL LUCHADOR..." 
              value={busqueda}
              onChange={manejarBusqueda}
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                background: '#111', 
                border: '1px solid #333', 
                color: '#fff', 
                borderRadius: '4px',
                fontFamily: 'Oswald, sans-serif',
                fontSize: '1rem',
                letterSpacing: '1px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Botonera de Categorías */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#e11212', marginBottom: '10px', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Filtrar por Categoría / Bando
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {listadoCategorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => cambiarCategoria(cat)}
                  style={{
                    padding: '8px 16px',
                    background: categoriaActiva === cat ? '#e11212' : '#222',
                    color: '#fff',
                    border: categoriaActiva === cat ? '1px solid #e11212' : '1px solid #333',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => { if(categoriaActiva !== cat) e.target.style.background = '#333'; }}
                  onMouseOut={(e) => { if(categoriaActiva !== cat) e.target.style.background = '#222'; }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Control de Carga o Rejilla con Paginación */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#e11212', fontFamily: 'Oswald, sans-serif', fontSize: '1.5rem', letterSpacing: '1px' }}>
            CONECTANDO AL ELENCO ESTELAR...
          </div>
        ) : elencoVisibleEnPagina.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#666', fontFamily: 'Oswald, sans-serif', fontSize: '1.2rem', backgroundColor: '#f9f9f9', border: '1px dashed #ccc' }}>
            NO SE ENCONTRARON LUCHADORES CON LOS CRITERIOS SELECCIONADOS.
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '30px' 
            }}>
              {elencoVisibleEnPagina.map((lucha) => (
                <div 
                  key={lucha.id} 
                  style={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #222', 
                    borderRadius: '4px', 
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = '#e11212';
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(225,18,18,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#222';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
                  }}
                >
                  {/* Contenedor de la Imagen */}
                  <div style={{ width: '100%', height: '350px', backgroundColor: '#151515', overflow: 'hidden' }}>
                    {lucha.imagen ? (
                      <img 
                        src={lucha.imagen} 
                        alt={lucha.nombre} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontFamily: 'Oswald, sans-serif' }}>
                        SIN FOTO OFICIAL
                      </div>
                    )}
                  </div>

                  {/* Contenido de la Tarjeta */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1.4rem', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#ffffff' }}>
                        {lucha.nombre}
                      </h3>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ 
                          color: lucha.bando?.toUpperCase() === 'RUDO' ? '#e11212' : '#0055ff', 
                          fontWeight: 'bold', 
                          fontSize: '0.85rem',
                          letterSpacing: '1px',
                          textTransform: 'uppercase'
                        }}>
                          BANDO {lucha.bando || 'TÉCNICO'}
                        </span>
                      </div>

                      <div style={{ borderTop: '1px solid #222', paddingTop: '10px', marginTop: '10px', fontSize: '0.8rem', fontFamily: 'sans-serif' }}>
                        <p style={{ margin: '0 0 6px 0', color: '#bbb' }}>
                          <strong style={{ color: '#e11212' }}>TÍTULOS:</strong> {lucha.titulos && lucha.titulos.trim() !== "" ? lucha.titulos.toUpperCase() : 'NINGUNO'}
                        </p>
                        <p style={{ margin: '0', color: '#bbb' }}>
                          <strong style={{ color: '#e11212' }}>EXP:</strong> {lucha.exp && lucha.exp.trim() !== "" ? `${lucha.exp.toUpperCase()}` : 'SIN ESPECIFICAR'}
                        </p>
                      </div>
                    </div>
                    
                    <button style={{
                      marginTop: '20px',
                      backgroundColor: 'transparent',
                      border: '1px solid #e11212',
                      color: '#e11212',
                      padding: '12px',
                      fontFamily: 'Oswald, sans-serif',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#e11212'; e.target.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#e11212'; }}
                    >
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- CONTROLES DE LA BARRA DE PESTAÑA / PAGINACIÓN --- */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '20px', 
              marginTop: '50px',
              fontFamily: 'Oswald, sans-serif'
            }}>
              <button
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(prev => prev - 1)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: paginaActual === 1 ? '#eee' : '#000',
                  color: paginaActual === 1 ? '#aaa' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'background-color 0.2s'
                }}
              >
                ◀ Anterior
              </button>

              <span style={{ fontSize: '1.1rem', color: '#000', fontWeight: 'bold', letterSpacing: '1px' }}>
                PÁGINA {paginaActual} DE {totalPaginas}
              </span>

              <button
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(prev => prev + 1)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: paginaActual === totalPaginas ? '#eee' : '#000',
                  color: paginaActual === totalPaginas ? '#aaa' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'background-color 0.2s'
                }}
              >
                Siguiente ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};