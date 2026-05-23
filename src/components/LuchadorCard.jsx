export function LuchadorCard({ luchador }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card card-aaa-dark h-100 border-top border-danger border-4">
        <img src={luchador.foto} className="card-img-top" alt={luchador.nombre} style={{height: '380px', objectFit: 'cover'}} />
        <div className="card-body text-center p-4">
          <h2 className="text-uppercase italic mb-1" style={{fontFamily: 'Oswald'}}>{luchador.nombre}</h2>
          <span className="badge bg-danger mb-3 px-3 py-2">{luchador.bando}</span>
          <button className="btn btn-outline-danger w-100 rounded-0 fw-bold">PERFIL SUPERESTRELLA</button>
        </div>
      </div>
    </div>
  );
}