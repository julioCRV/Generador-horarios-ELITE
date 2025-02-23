import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import data from "../data/data.json";
import './HorarioOrganizador.css';
import { FaTimes } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

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
  const [nivelAbierto, setNivelAbierto] = useState(null);
  const [materiaAbierta, setMateriaAbierta] = useState(null);
  const [docentesSeleccionados, setDocentesSeleccionados] = useState([]);
  const [visible, setVisible] = useState(true);

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
    const nuevaListaDocentes = docentesSeleccionados.filter(item => item !== docenteGrupo);
    setDocentesSeleccionados(nuevaListaDocentes);
  };

  const agregarDocente = (docenteGrupo) => {
    if (nivel && materia && docenteGrupo && data[nivel] && data[nivel][materia]) {
      const [docenteNombre, grupo] = docenteGrupo.split(" - Grupo ");
      const materiaData = data[nivel][materia];

      // Filtrar horarios del docente y grupo seleccionados
      const nuevoHorario = materiaData.filter(d => d.docente === docenteNombre && d.grupo === grupo);

      // Evitar duplicados en la tabla
      if (!horariosFiltrados.some(h => h.docente === docenteNombre && h.grupo === grupo && h.materia === materia)) {
        setHorariosFiltrados([...horariosFiltrados, ...nuevoHorario.map(h => ({ ...h, materia }))]);
      }
    }

    setDocente(docenteGrupo)
  };

  const handlePrint = () => {
    const table = document.getElementById("scheduleTable");

    html2canvas(table).then((canvas) => {
      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");

      // Cargar logo
      const logo = new Image();
      logo.src = "./logoIcon.png";
      logo.onload = () => {
        const padding = 20;
        const titleHeight = 50;
        const totalHeight = canvas.height + titleHeight + padding;

        finalCanvas.width = canvas.width;
        finalCanvas.height = totalHeight;

        // Fondo blanco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Dibujar título
        ctx.fillStyle = "#000";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("INGENERÍA COMERCIAL", finalCanvas.width / 2, padding + 20);

        // Dibujar la tabla capturada debajo del título
        ctx.drawImage(canvas, 0, titleHeight + padding);

        // Configurar opacidad para la marca de agua
        ctx.globalAlpha = 0.2;

        // Definir tamaño y posición del logo centrado
        const logoSize = Math.min(finalCanvas.width, finalCanvas.height) * 1; // 50% del tamaño menor
        const centerX = (finalCanvas.width - logoSize) / 2;
        const centerY = (finalCanvas.height - logoSize) / 2;

        // Dibujar logo en el centro
        ctx.drawImage(logo, centerX, centerY, logoSize, logoSize);

        // Restaurar opacidad
        ctx.globalAlpha = 1.0;

        // Convertir a imagen y descargar
        const link = document.createElement("a");
        link.href = finalCanvas.toDataURL("logoIcon.png");
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
    <>
      <div className="contenedor-inicial">
        <h2>Organizador de horario</h2>
        <br />
        <div className="contain-separation">
        <IoMenu className="icon-menu" onClick={() => setVisible(!visible)}>
        </IoMenu >
          <button onClick={handlePrint}>Imprimir</button>
        </div>
      </div>

      <div className="contenedor">
        <br />


        {visible && (
          <div className="acordeon-container">
            {Object.keys(data).map((nivel) => (
              <div key={nivel} className="nivel">
                <button
                  className="nivel-btn"
                  onClick={() => { setNivelAbierto(nivelAbierto === nivel ? null : nivel); setNivel(nivel) }}
                >
                  {nivel} {nivelAbierto === nivel ? "▲" : "▼"}
                </button>

                {nivelAbierto === nivel && (
                  <div className="materias">
                    {Object.keys(data[nivel]).map((materia) => (
                      <div key={materia} className="materia">
                        <button
                          className="materia-btn"
                          onClick={() => { setMateriaAbierta(materiaAbierta === materia ? null : materia); setMateria(materia) }}
                        >
                          {materia} {materiaAbierta === materia ? "▲" : "▼"}
                        </button>

                        {materiaAbierta === materia && (
                          <ul className="docentes">
                            {data[nivel][materia].map((d, index) => {
                              const seleccionActual = `${d.docente} - Grupo ${d.grupo}`;
                              const estaSeleccionado = docentesSeleccionados.includes(seleccionActual);

                              return (
                                <li
                                  key={index}
                                  className={`docente-item ${estaSeleccionado ? "seleccionado" : ""}`}
                                  onClick={() => {
                                    if (!estaSeleccionado) {
                                      agregarDocente(seleccionActual)
                                    } else {
                                      quitarDocente(seleccionActual)
                                    }
                                    setDocentesSeleccionados((prev) =>
                                      estaSeleccionado
                                        ? prev.filter((item) => item !== seleccionActual) // Quita si ya está seleccionado
                                        : [...prev, seleccionActual] // Agrega si no está seleccionado
                                    );
                                  }}
                                >
                                  {d.docente} - Grupo {d.grupo}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
                            className="materia-box"
                            style={{
                              backgroundColor: coloresMaterias[h.materia] || "#ccc", // Solo el color se mantiene dinámico
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
    </>
  );
};

export default HorarioOrganizador;
