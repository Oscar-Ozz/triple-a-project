export function Eventos() {
  const proximosEventos = [
    { id: 1, plaza: "Arena México", fecha: "15 de Mayo", ciudad: "CDMX", tipo: "Magno Evento" },
    { id: 2, plaza: "Auditorio Benito Juárez", fecha: "22 de Mayo", ciudad: "Veracruz", tipo: "Gira Orígenes" }
  ];

  return (
    <div className="row">
      <h2 className="text-white mb-4"><i className="fa-solid fa-calendar-star text-danger"></i> PRÓXIMOS EVENTOS</h2>
      {proximosEventos.map(e => (
        <div key={e.id} className="col-md-6 mb-3">
          <div className="card bg-dark text-white border-danger shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 text-uppercase fw-bold">{e.plaza}</h5>
                <small className="text-danger">{e.tipo}</small>
                <p className="mb-0 text-secondary">{e.fecha} - {e.ciudad}</p>
              </div>
              <button className="btn btn-danger fw-bold">BOLETOS</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}