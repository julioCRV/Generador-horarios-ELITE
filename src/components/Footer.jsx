import { useState } from "react";
import "./Footer.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importar iconos

const Footer = () => {
    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Botón "Conócenos" con flecha dinámica */}
                <button className="btn-conocenos" onClick={toggleInfo}>
                    Conócenos {showInfo ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {/* Información de Alfa (se muestra al presionar el botón) */}
                {showInfo && (
                    <div className="info-box">
                        <h2>Equipo de trabajo Alfa</h2>
                        <br/>
                        <p>
                            Formar de manera integral a profesionales en Administración de Empresas dentro del Equipo de Trabajo Alfa, con una conciencia crítica, ética, responsable y actitud emprendedora...
                        </p>

                        {/* Galería de imágenes */}
                        <div className="gallery">
                            <img src="../A.jpg" alt="Foto 1" />
                            <img src="../B.jpg" alt="Foto 2" />
                            <img src="../C.jpeg" alt="Foto 3" />
                            <img src="../D.jpeg" alt="Foto 4" />
                        </div>
                    </div>
                )}

                {/* Enlaces de WhatsApp en una sola fila */}
                <div className="whatsapp-links">
                    <a href="https://chat.whatsapp.com/LTFjVcXMGW18aW3twYOIA7" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                        <span>Material de apoyo Alfa</span>
                    </a>
                    <a href="https://chat.whatsapp.com/EDoKlZUnlM9EdTvGfWDIC5" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                        <span>Trueque de material académico ADMI</span>
                    </a>
                </div>
            </div>
            <p>&copy; 2025 Alfa. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;
