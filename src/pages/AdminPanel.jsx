import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('luchadores');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  // --- BUSQUEDA Y PAGINACIÓN ---
  const [busquedaAdmin, setBusquedaAdmin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 15; 

  // --- ESTADOS PARA EL PROGRAMADOR DE LUCHAS ---
  const [luchadoresDisponibles, setLuchadoresDisponibles] = useState([]);
  const [tipoLucha, setTipoLucha] = useState('1vs1');
  const [ciudadEvento, setCiudadEvento] = useState(''); 
  const [luchasCreadas, setLuchasCreadas] = useState([]);
  const [seleccionLucha, setSeleccionLucha] = useState({
    luchador1: '', luchador2: '',
    luchador3: '', luchador4: '',
    equipoA1: '', equipoA2: '', equipoA3: '',
    equipoB1: '', equipoB2: '', equipoB3: ''
  });

  const initialLuchador = { nombre: '', bando: 'TÉCNICO', categoria: 'Masculino', titulos: '', exp: '', imagen: '' };
  const initialProducto = { producto: '', precio: '', categoria: 'Accesorios', stock: '', descripcion: '', imagen: '' };
  const [luchador, setLuchador] = useState(initialLuchador);
  const [producto, setProducto] = useState(initialProducto);

  useEffect(() => {
    setPaginaActual(1);
    if (activeTab === 'luchadores' || activeTab === 'tienda') {
      fetchItems();
    } else if (activeTab === 'cartelera') {
      fetchLuchadoresParaCartelera();
    }
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`http://localhost:5000/${activeTab}`);
      const data = await resp.json();
      setItems(data);
    } catch (err) {
      showMsg('Error al conectar con el servidor', 'error');
    }
    setLoading(false);
  };

  const fetchLuchadoresParaCartelera = async () => {
    try {
      const resp = await fetch('http://localhost:5000/luchadores');
      const data = await resp.json();
      setLuchadoresDisponibles(data);
    } catch (err) {
      showMsg('No se pudieron cargar los luchadores para la cartelera', 'error');
    }
  };

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('tipo', activeTab);
    if (editId) formData.append('id', editId);

    if (activeTab === 'luchadores') {
      formData.append('nombre', luchador.nombre);
      formData.append('bando', luchador.bando);
      formData.append('categoria', luchador.categoria);
      formData.append('titulos', luchador.titulos);
      formData.append('exp', luchador.exp);
      if (selectedFile) formData.append('imagen', selectedFile);
      else formData.append('img_url', luchador.imagen);
    } else {
      formData.append('producto', producto.producto);
      formData.append('precio', producto.precio);
      formData.append('categoria', producto.categoria);
      formData.append('stock', producto.stock);
      formData.append('descripcion', producto.descripcion);
      if (selectedFile) formData.append('imagen', selectedFile);
      else formData.append('img_url', producto.imagen);
    }

    try {
      const url = editId ?
        `http://localhost:5000/${activeTab}/${editId}` : 'http://localhost:5000/save_with_image';
      const method = editId ? 'PUT' : 'POST';
      const resp = await fetch(url, { method, body: formData });
      if (resp.ok) {
        showMsg(editId ? 'Registro modificado con éxito' : 'Guardado correctamente', 'success');
        resetForm();
        fetchItems();
      } else {
        showMsg('Error al intentar guardar el registro', 'error');
      }
    } catch (err) {
      showMsg('Fallo en la comunicación con la API', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setPreviewUrl(item.imagen);
    if (activeTab === 'luchadores') {
      setLuchador(item);
    } else {
      setProducto(item);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar este registro de la base de datos de forma permanente?')) return;
    try {
      const resp = await fetch(`http://localhost:5000/${activeTab}/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        showMsg('Registro eliminado', 'success');
        fetchItems();
      }
    } catch (err) {
      showMsg('Error al borrar', 'error');
    }
  };

  const resetForm = () => {
    setEditId(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setLuchador(initialLuchador);
    setProducto(initialProducto);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAgregarLucha = (e) => {
    e.preventDefault();
    let detalleLucha = "";

    if (tipoLucha === '1vs1') {
      if(!seleccionLucha.luchador1 || !seleccionLucha.luchador2) return showMsg('Selecciona ambos rivales', 'error');
      detalleLucha = `${seleccionLucha.luchador1} VS ${seleccionLucha.luchador2}`;
    } else if (tipoLucha === 'triple') {
      if(!seleccionLucha.luchador1 || !seleccionLucha.luchador2 || !seleccionLucha.luchador3) return showMsg('Selecciona los 3 luchadores', 'error');
      detalleLucha = `TRIPLE AMENAZA: ${seleccionLucha.luchador1} VS ${seleccionLucha.luchador2} VS ${seleccionLucha.luchador3}`;
    } else if (tipoLucha === 'fatal4') {
      if(!seleccionLucha.luchador1 || !seleccionLucha.luchador2 || !seleccionLucha.luchador3 || !seleccionLucha.luchador4) return showMsg('Selecciona los 4 competidores', 'error');
      detalleLucha = `FATAL DE 4 ESQUINAS: ${seleccionLucha.luchador1} VS ${seleccionLucha.luchador2} VS ${seleccionLucha.luchador3} VS ${seleccionLucha.luchador4}`;
    } else if (tipoLucha === '3vs3') {
      if(!seleccionLucha.equipoA1 || !seleccionLucha.equipoB1) return showMsg('Completa los integrantes de los relevos', 'error');
      detalleLucha = `RELEVOS AUSTRALIANOS: [${seleccionLucha.equipoA1} & ${seleccionLucha.equipoA2} & ${seleccionLucha.equipoA3}] VS [${seleccionLucha.equipoB1} & ${seleccionLucha.equipoB2} & ${seleccionLucha.equipoB3}]`;
    }

    setLuchasCreadas([...luchasCreadas, { id: Date.now(), tipo: tipoLucha.toUpperCase(), detalle: detalleLucha }]);
    showMsg('¡Lucha agregada a la cartelera programada!', 'success');
  };

  // --- ORDENAMIENTO ALFABÉTICO EN TIEMPO REAL (A-Z) ---
  const itemsFiltrados = items.filter(item => {
    const texto = (item.nombre || item.producto || '').toLowerCase();
    return texto.includes(busquedaAdmin.toLowerCase());
  }).sort((a, b) => {
    const campoA = activeTab === 'luchadores' ? (a.nombre || '') : (a.producto || '');
    const campoB = activeTab === 'luchadores' ? (b.nombre || '') : (b.producto || '');
    return campoA.localeCompare(campoB);
  });

  const totalPaginas = Math.ceil(itemsFiltrados.length / elementosPorPagina) || 1;
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimer = indiceUltimo - elementosPorPagina;
  const itemsPaginados = itemsFiltrados.slice(indicePrimer, indiceUltimo);

  // --- ORDENAR CONTENDIENTES DE LA A A LA Z PARA LOS SELECTS ---
  const luchadoresOrdenadosCartelera = [...luchadoresDisponibles].sort((a, b) => 
    (a.nombre || '').localeCompare(b.nombre || '')
  );

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`REPORTE OFICIAL DE INVENTARIO: ${activeTab.toUpperCase()}`, 14, 20);
    const headers = activeTab === 'luchadores' 
      ? [["ID", "Nombre", "Bando", "Categoría", "Experiencia"]]
      : [["ID", "Producto", "Categoría", "Precio ($)", "Stock (Pzs)"]];
    const body = itemsFiltrados.map(item => 
      activeTab === 'luchadores'
        ? [item.id, item.nombre, item.bando, item.categoria, item.exp]
        : [item.id, item.producto, item.categoria, `$${item.precio}`, item.stock]
    );
    autoTable(doc, {
      startY: 28,
      head: headers,
      body: body,
      theme: 'striped',
      headStyles: { fillColor: [225, 18, 18] },
      styles: { fontFamily: "helvetica", fontSize: 10 }
    });
    doc.save(`Reporte_AAA_${activeTab}.pdf`);
  };

  const exportarCarteleraPDF = () => {
    if (luchasCreadas.length === 0) {
      showMsg('No hay encuentros en la cartelera para exportar', 'error');
      return;
    }
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(225, 18, 18);
    doc.text("CARTELERA OFICIAL - LUCHA LIBRE AAA", 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const sedeTexto = ciudadEvento ? `Sede / Plaza: ${ciudadEvento.toUpperCase()}` : "Sede: Por Confirmar";
    doc.text(`${sedeTexto}  |  Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 28);

    const headers = [["EVENTO", "MODALIDAD DE COMBATE", "ENCUENTRO PROGRAMADO"]];
    const body = luchasCreadas.map((lucha, index) => [
      `COMBATE #${index + 1}`,
      lucha.tipo,
      lucha.detalle
    ]);
    autoTable(doc, {
      startY: 35,
      head: headers,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { fontFamily: "helvetica", fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: 'bold', textColor: [225, 18, 18] },
        1: { cellWidth: 45 },
        2: { fontStyle: 'bold' }
      }
    });

    doc.save("Cartelera_Oficial_AAA.pdf");
    showMsg('¡PDF de la Cartelera descargado!', 'success');
  };

  return (
    <div style={{ 
      backgroundColor: '#000', minHeight: '100vh', color: '#fff', 
      padding: '40px 20px', marginTop: '-110px', paddingTop: '130px', boxSizing: 'border-box' 
    }}>
      
      {message.text && (
        <div style={{
          position: 'fixed', top: '100px', right: '20px',
          backgroundColor: message.type === 'success' ? '#00b341' : '#e11212',
          color: '#fff', padding: '15px 25px', borderRadius: '2px', zIndex: '9999',
          fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ borderLeft: '6px solid #e11212', paddingLeft: '15px', marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '2.5rem', margin: '0', letterSpacing: '1px' }}>
          CONTROL CENTRAL AAA WORLDWIDE
        </h1>
        <p style={{ margin: '5px 0 0 0', color: '#888', fontWeight: 'bold', fontSize: '0.9rem' }}>
          SISTEMA DE ADMINISTRACIÓN Y SIMULACIÓN DE CONTENIDO
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #222', paddingBottom: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {[
          { id: 'luchadores', label: '🤼 GESTIÓN LUCHADORES' },
          { id: 'tienda', label: '🛍 GESTIÓN TIENDA' },
          { id: 'cartelera', label: '💥 PROGRAMADOR DE LUCHAS' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === tab.id ? '#e11212' : '#111',
              color: '#fff',
              border: activeTab === tab.id ? '1px solid #e11212' : '1px solid #333',
              fontFamily: 'Oswald, sans-serif',
              cursor: 'pointer',
              letterSpacing: '0.5px',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: (activeTab === 'cartelera') ? '1fr' : '1fr 2fr', gap: '40px' }}>
        
        {(activeTab === 'luchadores' || activeTab === 'tienda') && (
          <div>
            <div style={{ backgroundColor: '#111', padding: '25px', border: '1px solid #222' }}>
              <h3 style={{ fontFamily: 'Oswald, sans-serif', margin: '0 0 20px 0', color: '#e11212', textTransform: 'uppercase' }}>
                {editId ? '⚡ EDITAR REGISTRO' : '➕ AGREGAR NUEVO'}
              </h3>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {activeTab === 'luchadores' ? (
                  <>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>NOMBRE DEL LUCHADOR</label>
                    <input type="text" value={luchador.nombre} onChange={e => setLuchador({...luchador, nombre: e.target.value.toUpperCase()})} style={inputStyle} required />

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>BANDO</label>
                    <select value={luchador.bando} onChange={e => setLuchador({...luchador, bando: e.target.value})} style={inputStyle}>
                      <option value="TÉCNICO">TÉCNICO</option>
                      <option value="RUDO">RUDO</option>
                    </select>

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>CATEGORÍA</label>
                    <select value={luchador.categoria} onChange={e => setLuchador({...luchador, categoria: e.target.value})} style={inputStyle}>
                      <option value="Masculino">MASCULINO</option>
                      <option value="Femenil">FEMENIL</option>
                      <option value="Mini">MINI</option>
                    </select>

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>TÍTULOS / CAMPEONATOS</label>
                    <input type="text" value={luchador.titulos} onChange={e => setLuchador({...luchador, titulos: e.target.value})} placeholder="Ej: Megacampeonato" style={inputStyle} />

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>AÑOS DE EXPERIENCIA</label>
                    <input type="number" value={luchador.exp} onChange={e => setLuchador({...luchador, exp: e.target.value})} style={inputStyle} />
                  </>
                ) : (
                  <>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>NOMBRE DEL PRODUCTO</label>
                    <input type="text" value={producto.producto} onChange={e => setProducto({...producto, producto: e.target.value.toUpperCase()})} style={inputStyle} required />

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>PRECIO ($ MXN)</label>
                    <input type="number" step="0.01" value={producto.precio} onChange={e => setProducto({...producto, precio: e.target.value})} style={inputStyle} required />

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>CATEGORÍA</label>
                    <select value={producto.categoria} onChange={e => setProducto({...producto, categoria: e.target.value})} style={inputStyle}>
                      <option value="Máscaras">MÁSCARAS</option>
                      <option value="Playeras">PLAYERAS</option>
                      <option value="Accesorios">ACCESORIOS</option>
                      <option value="Coleccionables">COLECCIONABLES</option>
                      <option value="Otros">OTROS</option>
                    </select>

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>CANTIDAD EN STOCK</label>
                    <input type="number" value={producto.stock} onChange={e => setProducto({...producto, stock: e.target.value})} style={inputStyle} required />

                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>DESCRIPCIÓN</label>
                    <textarea value={producto.descripcion} onChange={e => setProducto({...producto, descripcion: e.target.value})} style={{...inputStyle, height: '80px', resize: 'none'}} />
                  </>
                )}

                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#aaa' }}>IMAGEN DEL REGISTRO</label>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={inputStyle} />
                
                {previewUrl && (
                  <div style={{ textAlign: 'center', margin: '10px 0', border: '1px solid #333', padding: '5px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 5px 0' }}>VISTA PREVIA</p>
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" style={{ flexGrow: 1, padding: '12px', background: '#e11212', color: '#fff', border: 'none', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif', cursor: 'pointer', letterSpacing: '1px' }}>
                    {editId ? 'ACTUALIZAR DATOS' : 'GUARDAR EN BD'}
                  </button>
                  {editId && (
                    <button type="button" onClick={resetForm} style={{ padding: '12px', background: '#333', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                      CANCELAR
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {(activeTab === 'luchadores' || activeTab === 'tienda') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="BUSCAR EN ESTA TABLA..."
                value={busquedaAdmin}
                onChange={e => { setBusquedaAdmin(e.target.value); setPaginaActual(1); }}
                style={{ ...inputStyle, margin: 0, padding: '12px' }}
              />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#111', border: '1px solid #222' }}>
              <thead>
                <tr style={{ backgroundColor: '#222', textAlign: 'left' }}>
                  <th style={{ padding: '12px', fontFamily: 'Oswald, sans-serif', fontSize: '0.9rem', color: '#aaa' }}>FOTO</th>
                  <th style={{ padding: '12px', fontFamily: 'Oswald, sans-serif', fontSize: '0.9rem', color: '#aaa' }}>NOMBRE / ARTÍCULO</th>
                  <th style={{ padding: '12px', fontFamily: 'Oswald, sans-serif', fontSize: '0.9rem', color: '#aaa' }}>INFO CLAVE</th>
                  <th style={{ padding: '12px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', paddingRight: '15px' }}>
                    <button onClick={exportarPDF} style={{ background: '#333', color: '#fff', border: '1px solid #444', padding: '6px 12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      DESCARGAR PDF ⬇
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>CARGANDO REGISTROS RECIENTES...</td>
                  </tr>
                ) : itemsPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>NINGÚN ELEMENTO ENCONTRADO EN LA TABLA</td>
                  </tr>
                ) : (
                  itemsPaginados.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px' }}>
                        <img src={item.imagen || "https://via.placeholder.com/50"} style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid #333' }} alt="" />
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {item.nombre || item.producto}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.85rem', color: '#aaa' }}>
                        {activeTab === 'luchadores' ? (
                          <span>Bando: <strong style={{color: item.bando==='RUDO'?'#e11212':'#00b341'}}>{item.bando}</strong> | Cat: {item.categoria}</span>
                        ) : (
                          <span>Precio: <strong>${item.precio}</strong> | Stock: <strong>{item.stock} pzs</strong></span>
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button 
                          style={{ background: '#0055ff', color: '#fff', border: 'none', padding: '6px 12px', marginRight: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }} 
                          onClick={() => handleEdit(item)}
                        >
                          EDITAR
                        </button>
                        <button 
                          style={{ background: '#e11212', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }} 
                          onClick={() => handleDelete(item.id)}
                        >
                          ELIMINAR
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
              <button
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                style={{ padding: '8px 20px', background: paginaActual === 1 ? '#222' : '#e11212', color: paginaActual === 1 ? '#666' : '#fff', border: 'none', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', fontSize: '0.9rem', letterSpacing: '1px' }}
              >
                ◀ ATRÁS
              </button>
              <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1rem', color: '#fff' }}>
                PÁGINA <span style={{ color: '#e11212', fontWeight: 'bold' }}>{paginaActual}</span> DE {totalPaginas}
              </span>
              <button
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                style={{ padding: '8px 20px', background: paginaActual === totalPaginas ? '#222' : '#e11212', color: paginaActual === totalPaginas ? '#666' : '#fff', border: 'none', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer', fontSize: '0.9rem', letterSpacing: '1px' }}
              >
                SIGUIENTE ▶
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cartelera' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
            <div style={{ backgroundColor: '#111', padding: '25px', border: '1px solid #222' }}>
              <h3 style={{ fontFamily: 'Oswald, sans-serif', margin: '0 0 20px 0', color: '#e11212' }}>💥 CONFIGURADOR DE ENCUENTROS</h3>
              
              <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <label style={{ fontSize: '0.85rem', color: '#e11212', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                  📍 CIUDAD / SEDE DE LA FUNCIÓN
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Arena Ciudad de México, CDMX" 
                  value={ciudadEvento} 
                  onChange={e => setCiudadEvento(e.target.value)} 
                  style={inputStyle} 
                />
              </div>

              <form onSubmit={handleAgregarLucha} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold' }}>MODALIDAD DE COMBATE</label>
                <select value={tipoLucha} onChange={e => setTipoLucha(e.target.value)} style={inputStyle}>
                  <option value="1vs1">MANO A MANO (1 VS 1)</option>
                  <option value="triple">TRIPLE AMENAZA (3 LUCHADORES)</option>
                  <option value="fatal4">FATAL DE 4 ESQUINAS (4 LUCHADORES)</option>
                  <option value="3vs3">RELEVOS AUSTRALIANOS (3 VS 3)</option>
                </select>

                {tipoLucha === '1vs1' && (
                  <>
                    <label style={{ fontSize: '0.8rem', color: '#e11212', fontWeight: 'bold' }}>LUCHADOR ESQUINA ROJA</label>
                    <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, luchador1: e.target.value})}>
                      <option value="">-- SELECCIONA CONTENDIENTE --</option>
                      {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                    </select>
                    <label style={{ fontSize: '0.8rem', color: '#0055ff', fontWeight: 'bold' }}>LUCHADOR ESQUINA AZUL</label>
                    <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, luchador2: e.target.value})}>
                      <option value="">-- SELECCIONA CONTENDIENTE --</option>
                      {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                    </select>
                  </>
                )}

                {tipoLucha === 'triple' && (
                  <>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold' }}>LUCHADOR 1</label>
                    <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, luchador1: e.target.value})}>
                      <option value="">-- SELECCIONA --</option>
                      {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                    </select>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold' }}>LUCHADOR 2</label>
                    <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, luchador2: e.target.value})}>
                      <option value="">-- SELECCIONA --</option>
                      {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                    </select>
                    <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold' }}>LUCHADOR 3</label>
                    <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, luchador3: e.target.value})}>
                      <option value="">-- SELECCIONA --</option>
                      {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                    </select>
                  </>
                )}

                {tipoLucha === 'fatal4' && (
                  <>
                    {[1, 2, 3, 4].map(num => (
                      <div key={num}>
                        <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold' }}>LUCHADOR {num}</label>
                        <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, [`luchador${num}`]: e.target.value})}>
                          <option value="">-- SELECCIONA --</option>
                          {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                        </select>
                      </div>
                    ))}
                  </>
                )}

                {tipoLucha === '3vs3' && (
                  <>
                    <div style={{ padding: '10px', backgroundColor: '#1c1c1c', borderLeft: '4px solid #00b341' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#00b341' }}>BANDO TÉCNICO / EQUIPO A</h4>
                      <select style={{...inputStyle, marginBottom: '5px'}} onChange={e => setSeleccionLucha({...seleccionLucha, equipoA1: e.target.value})}>
                        <option value="">Luchador 1...</option>
                        {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                      </select>
                      <select style={{...inputStyle, marginBottom: '5px'}} onChange={e => setSeleccionLucha({...seleccionLucha, equipoA2: e.target.value})}>
                        <option value="">Luchador 2...</option>
                        {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                      </select>
                      <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, equipoA3: e.target.value})}>
                        <option value="">Luchador 3...</option>
                        {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                      </select>
                    </div>

                    <div style={{ padding: '10px', backgroundColor: '#1c1c1c', borderLeft: '4px solid #e11212' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#e11212' }}>BANDO RUDO / EQUIPO B</h4>
                      <select style={{...inputStyle, marginBottom: '5px'}} onChange={e => setSeleccionLucha({...seleccionLucha, equipoB1: e.target.value})}>
                        <option value="">Luchador 1...</option>
                        {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                      </select>
                      <select style={{...inputStyle, marginBottom: '5px'}} onChange={e => setSeleccionLucha({...seleccionLucha, equipoB2: e.target.value})}>
                        <option value="">Luchador 2...</option>
                        {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                      </select>
                      <select style={inputStyle} onChange={e => setSeleccionLucha({...seleccionLucha, equipoB3: e.target.value})}>
                        <option value="">Luchador 3...</option>
                        {luchadoresOrdenadosCartelera.map(l => <option key={l.id} value={l.nombre}>{l.nombre}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <button type="submit" style={{ padding: '12px', background: '#e11212', color: '#fff', border: 'none', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif', cursor: 'pointer', letterSpacing: '1px', marginTop: '10px' }}>
                  AÑADIR COMBATE A LA FUNCIÓN
                </button>
              </form>
            </div>

            <div style={{ backgroundColor: '#111', padding: '25px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontFamily: 'Oswald, sans-serif', margin: '0', color: '#fff' }}>📋 PRÓXIMA CARTELERA OFICIAL</h3>
                  {ciudadEvento && <span style={{ fontSize: '0.8rem', color: '#00b341', fontWeight: 'bold' }}>📍 {ciudadEvento.toUpperCase()}</span>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {luchasCreadas.length > 0 && (
                    <>
                      <button onClick={exportarCarteleraPDF} style={{ background: '#00b341', color: '#fff', border: 'none', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                        DESCARGAR PDF ⬇
                      </button>
                      <button onClick={() => setLuchasCreadas([])} style={{ background: 'transparent', border: '1px solid #444', color: '#aaa', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer' }}>
                        LIMPIAR
                      </button>
                    </>
                  )}
                </div>
              </div>

              {luchasCreadas.length === 0 ? (
                <div style={{ padding: '40px', border: '2px dashed #333', textAlign: 'center', color: '#555', fontWeight: 'bold' }}>
                  NO HAY LUCHAS PROGRAMADAS PARA ESTE EVENTO AÚN.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {luchasCreadas.map((lucha, index) => (
                    <div key={lucha.id} style={{ background: '#1a1a1a', padding: '15px', borderLeft: '4px solid #e11212', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '0.75rem', background: '#333', padding: '3px 8px', fontWeight: 'bold', borderRadius: '2px', color: '#e11212' }}>
                        LUCHA #{index + 1}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>
                        ESTILO: {lucha.tipo}
                      </div>
                      <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1.2rem', color: '#fff', letterSpacing: '0.5px' }}>
                        {lucha.detalle}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '10px 15px', backgroundColor: '#1a1a1a', border: '1px solid #333',
  color: '#fff', borderRadius: '2px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif'
};

export default AdminPanel;