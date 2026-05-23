export function Noticias() {
  const articulos = [
    {
      id: 1,
      titulo: "LA CATALINA LLEGA A TRIPLE A: LA DIVA DE CHILE LISTA PARA CONQUISTAR MÉXICO",
      resumen: "Tras su exitoso paso por el CMLL, La Catalina sorprende al mundo de la lucha libre al presentarse en la Caravana Estelar.",
      fecha: "24 de Abril, 2024",
      img: "https://www.luchalibreaaa.com/wp-content/uploads/2024/04/catalina-debut.jpg", // Usa una URL real de imagen
      categoria: "BREAKING NEWS"
    },
    {
      id: 2,
      titulo: "RELIQUIA DE PLATA: SE ANUNCIAN LAS ELIMINATORIAS",
      resumen: "Los nuevos talentos buscan un lugar en la historia en el próximo magno evento.",
      fecha: "22 de Abril, 2024",
      img: "https://www.luchalibreaaa.com/wp-content/uploads/2024/03/noticia-2.jpg",
      categoria: "EVENTOS"
    },
    {
      id: 3,
      titulo: "PSYCHO CLOWN HABLA SOBRE SU RIVALIDAD CON NIC NEMETH",
      resumen: "El totalitario está en la mira del Psicópata del Ring tras los eventos de Triplemanía.",
      fecha: "20 de Abril, 2024",
      img: "https://www.luchalibreaaa.com/wp-content/uploads/2024/02/psycho-nemeth.jpg",
      categoria: "ENTREVISTA"
    }
  ];

  return (
    <div className="container mt-5">
      {/* NOTICIA PRINCIPAL (LA CATALINA) */}
      <div className="news-main-card mb-5 shadow-lg">
        <div className="row g-0">
          <div className="col-md-8">
            <img src={articulos[0].img} className="img-fluid w-100 h-100" style={{objectFit: 'cover'}} alt="La Catalina" />
          </div>
          <div className="col-md-4 p-5 d-flex flex-column justify-content-center text-white">
            <span className="news-badge">{articulos[0].categoria}</span>
            <h2 className="display-6 fw-bold italic mb-3" style={{fontFamily: 'Oswald'}}>{articulos[0].titulo}</h2>
            <p className="text-secondary">{articulos[0].resumen}</p>
            <p className="small mt-3 fw-bold">{articulos[0].fecha}</p>
            <button className="btn btn-outline-danger rounded-0 mt-3 fw-bold">LEER MÁS</button>
          </div>
        </div>
      </div>

      {/* NOTICIAS SECUNDARIAS */}
      <div className="row">
        {articulos.slice(1).map(noticia => (
          <div key={noticia.id} className="col-md-6 mb-4">
            <div className="news-secondary-card d-flex h-100 text-white">
              <div className="news-img-container w-40" style={{minWidth: '150px'}}>
                <img src={noticia.img} alt="Noticia" />
              </div>
              <div className="p-4 d-flex flex-column justify-content-center">
                <span className="text-danger fw-bold small">{noticia.categoria}</span>
                <h4 className="fw-bold mt-2" style={{fontFamily: 'Oswald'}}>{noticia.titulo}</h4>
                <p className="small text-secondary mb-0">{noticia.fecha}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}