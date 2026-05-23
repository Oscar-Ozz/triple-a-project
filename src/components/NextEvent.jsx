export function NextEvent() {
  return (
    <div className="container my-5">
      <div className="card card-aaa-dark p-0 overflow-hidden shadow-lg border-start border-danger border-5">
        <div className="row g-0 align-items-center">
          <div className="col-md-7 p-5">
            <h5 className="text-danger fw-bold mb-0">PRÓXIMA FUNCIÓN</h5>
            <h1 className="display-2 fw-black" style={{fontFamily: 'Oswald'}}>VERANO DE ESCÁNDALO</h1>
            <p className="lead mb-4">Aguascalientes | 10 de Junio | 20:30 HRS</p>
            <button className="btn btn-danger btn-lg rounded-0 fw-bold px-5">BOLETOS</button>
          </div>
          <div className="col-md-5 p-3">
             <img src="https://images.alphacoders.com/100/1009304.jpg" className="img-fluid border border-secondary" alt="Poster" />
          </div>
        </div>
      </div>
    </div>
  );
}