import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import data from "../data/data.json";
import './HorarioOrganizador.css';
import { FaTimes } from "react-icons/fa";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const horarios = [
  "06:45 - 08:15", "08:15 - 09:45", "09:45 - 11:15", "11:15 - 12:45", "12:45 - 14:15",
  "14:15 - 15:45", "15:45 - 17:15", "17:15 - 18:45", "18:45 - 20:15", "20:15 - 21:45"
];

const HorarioOrganizador = () => {
  const [nivel, setNivel] = useState("");
  const [materia, setMateria] = useState("");
  const [docente, setDocente] = useState("");
  const [horariosFiltrados, setHorariosFiltrados] = useState([]);

  // Reiniciar materia y docente cuando cambia el nivel, pero no borrar `horariosFiltrados`
  useEffect(() => {
    setMateria("");
    setDocente("");
  }, [nivel]);

  // Reiniciar docente cuando cambia la materia
  useEffect(() => {
    setDocente("");
  }, [materia]);

  // Agregar horarios de la materia seleccionada sin borrar los previos
  useEffect(() => {
    if (nivel && materia && docente && data[nivel] && data[nivel][materia]) {
      const [docenteNombre, grupo] = docente.split(" - Grupo ");
      const materiaData = data[nivel][materia];

      // Filtrar horarios del docente y grupo seleccionados
      const nuevoHorario = materiaData.filter(d => d.docente === docenteNombre && d.grupo === grupo);

      // Evitar duplicados en la tabla
      if (!horariosFiltrados.some(h => h.docente === docenteNombre && h.grupo === grupo && h.materia === materia)) {
        setHorariosFiltrados([...horariosFiltrados, ...nuevoHorario.map(h => ({ ...h, materia }))]);
      }
    }
  }, [docente]);

  const quitarDocente = (docenteGrupo) => {
    setHorariosFiltrados(horariosFiltrados.filter(h => `${h.docente} - Grupo ${h.grupo}` !== docenteGrupo));
  };

  const handlePrint = () => {
    const table = document.getElementById("scheduleTable");
  
    html2canvas(table).then((canvas) => {
      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");
  
      // Dimensiones para incluir el título y logo
      const logo = new Image();
      logo.src = "./logo1.png";
      logo.onload = () => {
        const padding = 20;
        const titleHeight = 50;
        const logoSize = 80;
        const totalHeight = canvas.height + titleHeight + logoSize + padding;
  
        finalCanvas.width = canvas.width;
        finalCanvas.height = totalHeight;
  
        // Fondo blanco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  
        // Dibujar logo
        ctx.drawImage(logo, (finalCanvas.width - logoSize) / 2, padding, logoSize, logoSize);
  
        // Dibujar título
        ctx.fillStyle = "#000";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Administración de empresas", finalCanvas.width / 2, padding + logoSize + 25);
  
        // Dibujar la tabla capturada debajo del título
        ctx.drawImage(canvas, 0, titleHeight + logoSize + padding);
  
        // Convertir a imagen y descargar
        const link = document.createElement("a");
        link.href = finalCanvas.toDataURL("image/png");
        link.download = "schedule.png";
        link.click();
      };
    });
  };
  
  const generarColorAleatorio = () => {
    const letras = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [coloresMaterias, setColoresMaterias] = useState({});

  useEffect(() => {
    if (docente && materia && !coloresMaterias[materia]) {
      setColoresMaterias((prevColores) => ({
        ...prevColores,
        [materia]: generarColorAleatorio(),
      }));
    }
  }, [docente]);

  return (
    <div className="contenedor">
      <div className="select-option">
        <select onChange={(e) => setNivel(e.target.value)} value={nivel}>
          <option value="">Seleccione Nivel</option>
          {Object.keys(data).map((nivel) => (
            <option key={nivel} value={nivel}>{nivel}</option>
          ))}
        </select>

        <select onChange={(e) => setMateria(e.target.value)} value={materia} disabled={!nivel || !data[nivel]}>
          <option value="">Seleccione Materia</option>
          {nivel && data[nivel] && Object.keys(data[nivel]).map((materia) => (
            <option key={materia} value={materia}>{materia}</option>
          ))}
        </select>

        <select onChange={(e) => setDocente(e.target.value)} value={docente} disabled={!materia || !data[nivel] || !data[nivel][materia]}>
          <option value="">Seleccione Docente</option>
          {materia && data[nivel] && data[nivel][materia] && data[nivel][materia].map((d, index) => (
            <option key={index} value={`${d.docente} - Grupo ${d.grupo}`}>
              {d.docente} - Grupo {d.grupo}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handlePrint}>Imprimir</button>

      <div className="table-container">

          <table id="scheduleTable" border="1">
            <thead>
              <tr>
                <th>Horario</th>
                {diasSemana.map(dia => <th key={dia}>{dia}</th>)}
              </tr>
            </thead>
            <tbody>
              {horarios.map((hora, idx) => (
                <tr key={idx}>
                  <td>{hora}</td>
                  {diasSemana.map(dia => (
                    <td key={dia}>
                      {horariosFiltrados.map((h, index) =>
                        h.dias.includes(dia) && h.horarios[h.dias.indexOf(dia)] === hora ? (
                          <div
                            key={index}
                            style={{
                              backgroundColor: coloresMaterias[h.materia] || "#ccc",
                              color: "#fff",
                              padding: "5px",
                              borderRadius: "5px",
                              textAlign: "center",
                              fontSize: "12px",
                              lineHeight: "1.2",
                            }}
                          >
                            {h.materia} - {h.docente} ({h.grupo})
                            <button
                              onClick={() => quitarDocente(`${h.docente} - Grupo ${h.grupo}`)}
                              style={{
                                marginLeft: "5px",
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                borderRadius: "50%",
                                width: "25px",
                                height: "25px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0",
                              }}
                            >
                              <FaTimes size={12} color="black" />
                            </button>
                          </div>
                        ) : null
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
       
      </div>

    </div>
  );
};

export default HorarioOrganizador;
