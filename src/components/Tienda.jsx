import React, { useState, useEffect } from 'react';

export const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/tienda')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando productos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign: 'center', padding: '50px', color: 'white'}}>Cargando tienda...</div>;

  return (
    <div className="tienda-wrapper" style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      width: '100%', 
      padding: '100px 20px 40px 20px', // Espacio para que el navbar no lo tape
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ 
          marginBottom: '40px', 
          borderBottom: '3px solid #000', 
          paddingBottom: '10px' 
        }}>
          <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '2.5rem', margin: 0, color: '#000' }}>
            TIENDA <span style={{ color: '#e11212' }}>OFICIAL</span>
          </h1>
          <p style={{ color: '#666', fontWeight: 'bold' }}>{productos.length} ARTÍCULOS DISPONIBLES</p>
        </header>

        {/* GRID PRINCIPAL */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
          width: '100%'
        }}>
          {productos.map(producto => (
            <div key={producto.id} style={{
              border: '1px solid #eee',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {/* CONTENEDOR DE IMAGEN */}
              <div style={{ 
                width: '100%', 
                height: '300px', 
                backgroundColor: '#f9f9f9', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '10px'
              }}>
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre} 
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* INFORMACIÓN */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ 
                  fontFamily: 'Oswald, sans-serif', 
                  fontSize: '1.2rem', 
                  margin: 0, 
                  color: '#000',
                  textTransform: 'uppercase'
                }}>
                  {producto.nombre}
                </h3>
                <p style={{ color: '#777', fontSize: '0.9rem', margin: 0, minHeight: '40px' }}>
                  {producto.descripcion || "Producto oficial de Lucha Libre AAA."}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '10px'
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>
                    ${producto.precio}.00
                  </span>
                  <a 
                    href={`https://wa.me/521234567890?text=Me%20interesa%20${encodeURIComponent(producto.nombre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      backgroundColor: '#e11212',
                      color: '#fff',
                      padding: '10px 15px',
                      textDecoration: 'none',
                      fontFamily: 'Oswald, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      borderRadius: '2px'
                    }}
                  >
                    PEDIR POR WHATSAPP
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};