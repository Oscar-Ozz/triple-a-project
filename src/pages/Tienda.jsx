import React, { useState, useEffect } from 'react';

export const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Categorías, Búsqueda, Cantidades y Paginación
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [cantidades, setCantidades] = useState({}); 
  const [paginaActual, setPaginaActual] = useState(1);
  
  const articulosPorPagina = 12; // Límite de 12 artículos por pestaña
  const categorias = ['Todos', 'Máscaras', 'Playeras', 'Accesorios', 'Coleccionables', 'Otros'];

  useEffect(() => {
    fetch('http://localhost:5000/tienda')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        const iniciales = {};
        data.forEach(p => { iniciales[p.id] = 0; });
        setCantidades(iniciales);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando productos:", err);
        setLoading(false);
      });
  }, []);

  // Resetear a la página 1 cada vez que cambie la categoría o la búsqueda
  const cambiarCategoria = (cat) => {
    setCategoriaActiva(cat);
    setPaginaActual(1);
  };

  const cambiarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  // Funciones para aumentar o disminuir cantidad local en la tienda
  const incrementar = (id, stockMax) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, stockMax)
    }));
  };

  const decrementar = (id) => {
    setCantidades(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0)
    }));
  };

  // --- FILTRADO DE PRODUCTOS ---
  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
    const coincideBusqueda = p.producto ? p.producto.toLowerCase().includes(busqueda.toLowerCase()) : false;
    return coincideCategoria && coincideBusqueda;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPaginas = Math.ceil(productosFiltrados.length / articulosPorPagina);
  const indiceUltimoArticulo = paginaActual * articulosPorPagina;
  const indicePrimerArticulo = indiceUltimoArticulo - articulosPorPagina;
  const articulosPaginados = productosFiltrados.slice(indicePrimerArticulo, indiceUltimoArticulo);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#fff', fontFamily: 'Oswald, sans-serif', fontSize: '1.5rem' }}>
        CARGANDO INVENTARIO...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', width: '100%', padding: '40px 20px', boxSizing: 'border-box', color: '#000' }}>
      {/* Estilos CSS incrustados para efectos de hover consistentes */}
      <style>{`
        .img-producto-container { overflow: hidden; position: relative; }
        .img-producto-container img { transition: transform 0.3s ease; }
        .tarjeta-producto:hover .img-producto-container img { transform: scale(1.08); }
        
        .input-busqueda-oscura::placeholder { color: #666; }
        .btn-categoria-oscura { transition: all 0.2s ease; }
        .btn-categoria-oscura:hover { background-color: #e11212 !important; color: #fff !important; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '50px', borderLeft: '8px solid #e11212', paddingLeft: '20px', textAlign: 'left' }}>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '3rem', fontWeight: '900', margin: '0', textTransform: 'uppercase', letterSpacing: '1px' }}>
            TIENDA OFICIAL
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '1.1rem', fontWeight: 'bold' }}>
            PRODUCTOS 100% ORIGINALES DE AAA WORLDWIDE
          </p>
        </header>

        {/* CONTENEDOR ESTILO OSCURO (Con margen negativo para romper el padding de Bootstrap) */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          margin: '0 -20px 40px -20px', 
          backgroundColor: '#111', 
          padding: '20px', 
          borderRadius: '4px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)' 
        }}>
          <input 
            type="text"
            className="input-busqueda-oscura"
            placeholder="BUSCAR PRODUCTO OFICIAL..."
            value={busqueda}
            onChange={cambiarBusqueda}
            style={{
              width: '100%',
              padding: '15px 20px',
              fontSize: '1rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '2px',
              fontFamily: 'Oswald, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#e11212'}
            onBlur={(e) => e.target.style.borderColor = '#333'}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categorias.map(cat => {
              const esActiva = categoriaActiva === cat;
              return (
                <button
                  key={cat}
                  onClick={() => cambiarCategoria(cat)}
                  className="btn-categoria-oscura"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: esActiva ? '#e11212' : 'transparent',
                    color: esActiva ? '#fff' : '#aaa',
                    border: esActiva ? '1px solid #e11212' : '1px solid #333',
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mensaje si no hay existencias */}
        {articulosPaginados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666', fontSize: '1.2rem', fontWeight: 'bold' }}>
            NO SE ENCONTRARON PRODUCTOS DISPONIBLES EN ESTA CATEGORÍA.
          </div>
        ) : (
          <>
            {/* Grid de Productos */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '30px',
              marginBottom: '50px'
            }}>
              {articulosPaginados.map(producto => (
                <div 
                  key={producto.id}
                  className="tarjeta-producto"
                  style={{
                    backgroundColor: '#111',
                    border: '2px solid #222',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#e11212'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#222'}
                >
                  {/* Contenedor de la Imagen con zoom */}
                  <div className="img-producto-container" style={{ width: '100%', paddingTop: '100%', backgroundColor: '#1a1a1a', borderBottom: '4px solid #e11212' }}>
                    <img 
                      src={producto.imagen || "https://via.placeholder.com/300"} 
                      alt={producto.producto}
                      style={{
                        position: 'absolute',
                        top: '0', left: '0', width: '100%', height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Cuerpo de la tarjeta al estilo Luchadores */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1.6rem', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase', color: '#fff', letterSpacing: '0.5px' }}>
                        {producto.producto}
                      </h2>
                      
                      <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#aaa', lineHeight: '1.4', fontFamily: 'sans-serif' }}>
                        {producto.descripcion || "Sin descripción disponible para este artículo oficial."}
                      </p>

                      {/* Caja de Metadatos (Categoría y Stock) */}
                      <div style={{ backgroundColor: '#1a1a1a', padding: '12px', borderLeft: '3px solid #e11212', marginBottom: '15px', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#bbb' }}>
                          <strong style={{ color: '#e11212' }}>CATEGORÍA:</strong> {producto.categoria ? producto.categoria.toUpperCase() : 'OTROS'}
                        </p>
                        <p style={{ margin: '0', color: '#bbb' }}>
                          <strong style={{ color: '#e11212' }}>STOCK:</strong> {producto.stock && producto.stock > 0 ? `${producto.stock} PIEZAS DISPONIBLES` : 'PRODUCTO AGOTADO'}
                        </p>
                      </div>
                    </div>

                    <div>
                      {/* Selector de cantidad interactivo */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', background: '#222', padding: '6px 12px', borderRadius: '2px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>CANTIDAD:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button 
                            type="button"
                            onClick={() => decrementar(producto.id)}
                            style={{ width: '28px', height: '28px', border: '1px solid #444', background: '#333', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >-</button>
                          <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1.1rem', fontWeight: 'bold', width: '20px', textAlign: 'center', color: '#fff' }}>
                            {cantidades[producto.id] || 0}
                          </span>
                          <button 
                            type="button"
                            onClick={() => incrementar(producto.id, producto.stock || 0)}
                            style={{ width: '28px', height: '28px', border: '1px solid #444', background: '#333', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >+</button>
                        </div>
                      </div>

                      {/* Sección inferior con precio formateado */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'bold' }}>PRECIO</span>
                          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', fontFamily: 'Oswald, sans-serif' }}>
                            ${Number(producto.precio).toFixed(2)}
                          </span>
                        </div>
                        
                        <a 
                          href={`https://wa.me/4272010217?text=Hola!%20Me%20interesa%20comprar%20${cantidades[producto.id] || 1}%20pieza(s)%20de:%20${encodeURIComponent(producto.producto)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            backgroundColor: 'transparent',
                            border: '1px solid #e11212',
                            color: '#e11212',
                            padding: '12px 18px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            fontFamily: 'Oswald, sans-serif',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                            display: 'inline-block'
                          }}
                          onMouseOver={(e) => { e.target.style.backgroundColor = '#e11212'; e.target.style.color = '#fff'; }}
                          onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#e11212'; }}
                        >
                          PEDIR POR WA 💬
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación de la Tienda */}
            {totalPaginas > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '2px solid #eee'
              }}>
                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
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

                <span style={{ fontSize: '1.1rem', color: '#000', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif' }}>
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
            )}
          </>
        )}
      </div>
    </div>
  );
};