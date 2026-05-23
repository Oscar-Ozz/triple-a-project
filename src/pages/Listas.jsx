import React, { useEffect, useState } from 'react';

const Listas = () => {
  const [luchadores, setLuchadores] = useState([]);
  const [productos, setProductos] = useState([]);

  // Cargar datos al entrar a la página
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resL = await fetch('http://127.0.0.1:5000/luchadores');
      const dataL = await resL.json();
      setLuchadores(dataL);

      const resP = await fetch('http://127.0.0.1:5000/tienda');
      const dataP = await resP.json();
      setProductos(dataP);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const styles = {
    container: { padding: '40px', backgroundColor: '#121212', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '40px', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' },
    th: { backgroundColor: '#e60000', color: 'white', padding: '15px', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #333' },
    img: { width: '50px', height: '50px', borderRadius: '5px', objectFit: 'cover' },
    title: { color: '#e60000', borderBottom: '2px solid #e60000', display: 'inline-block', marginBottom: '20px' }
  };

  return (
    <div style={styles.container}>
      <button 
        onClick={() => window.location.href = '/admin'} 
        style={{backgroundColor: '#444', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', marginBottom: '20px', borderRadius: '5px'}}
      >
        ← Volver al Panel
      </button>

      <h2 style={styles.title}>Cartelera de Luchadores</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Foto</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Bando</th>
            <th style={styles.th}>Títulos</th>
            <th style={styles.th}>Exp</th>
          </tr>
        </thead>
        <tbody>
          {luchadores.map((l) => (
            <tr key={l.id}>
              <td style={styles.td}><img src={l.imagen} style={styles.img} alt="luchador" /></td>
              <td style={styles.td}>{l.nombre}</td>
              <td style={styles.td}>{l.bando}</td>
              <td style={styles.td}>{l.titulos}</td>
              <td style={styles.td}>{l.exp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={styles.title}>Inventario de Tienda Oficial</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Imagen</th>
            <th style={styles.th}>Producto</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td style={styles.td}><img src={p.imagen} style={styles.img} alt="producto" /></td>
              <td style={styles.td}>{p.producto}</td>
              <td style={styles.td}>${p.precio}</td>
              <td style={styles.td}>{p.stock} pzas</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Listas;