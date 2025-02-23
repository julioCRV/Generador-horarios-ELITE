import { useState, useEffect, useRef } from "react";
import "./Footer.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importar iconos

const Footer = () => {
    const [showInfo, setShowInfo] = useState(false);
    const infoRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        if (showInfo && infoRef.current) {
            infoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [showInfo]);

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Botón "Conócenos" con flecha dinámica */}
                <button className="btn-conocenos" onClick={toggleInfo}>
                    Conócenos {showInfo ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {/* Información de Alfa (se muestra al presionar el botón) */}
                {showInfo && (
                    <div ref={infoRef} className="info-box">
                        <br />
                        <h2>Nosotros - ELITE FCE</h2>
                        <br />
                        <p>
                            <strong>ELITE FCE</strong> es un grupo académico de la carrera de <strong>Ingeniería Comercial</strong>, creado para fortalecer el aprendizaje, la colaboración y el crecimiento profesional de los estudiantes.
                            <br /><br />
                            📚 <strong>¿Qué hacemos?</strong> <br />
                            ✔ Compartimos materiales de estudio y recursos académicos. <br />
                            ✔ Organizamos eventos, charlas y conferencias. <br />
                            ✔ Fomentamos el networking y el desarrollo profesional. <br /><br />
                            Somos una comunidad de futuros líderes en negocios, listos para marcar la diferencia.
                            <strong>¡Súmate a ELITE FCE y potencia tu futuro! 🚀</strong>
                        </p>
                        <br />

                        {/* Galería de imágenes */}
                        <div className="gallery" onClick={() => openModal()}>
                            <img src="../A.jpeg" alt="Foto 1" />
                        </div>
                        <br />
                    </div>
                )}

                {/* Enlaces de WhatsApp en una sola fila */}
                <div className="whatsapp-links">
                    <a href="https://chat.whatsapp.com/IbrWGAtnD6O4LdbM9HPNZM" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                        <span>Grupo de Informaciones Ing. Comercial</span>
                    </a>
                    <a href="https://www.facebook.com/share/15mNkbyrfE/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="WhatsApp" />
                        <span>Página oficial ELITE FCE</span>
                    </a>
                </div>
            </div>
            {/* Modal para la imagen en grande */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src="../A.jpeg" alt="Imagen ampliada" className="modal-image" />
                    </div>
                </div>
            )}
            <p>&copy; 2025 ELITE FCE. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;
