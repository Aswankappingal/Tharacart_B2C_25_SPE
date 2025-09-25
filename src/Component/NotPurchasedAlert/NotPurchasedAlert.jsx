import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const NotPurchasedAlert = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                    // position: "relative",
                    // animation: isVisible
                    //     ? "zoomIn 1s ease-in-out"
                    //     : "zoomOut 1s ease-in-out",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "16px",
                        fontFamily: 'Roboto'
                    }}
                >
                    {message}
                </p>
                <button
                    style={{
                        // position: "absolute",
                        top: "10px",
                        right: "10px",
                        border: "none",
                        background: "none",
                        fontSize: "15px",
                        cursor: "pointer",
                        color: "#ffffff",
                        fontFamily: 'Roboto',
                        backgroundColor:'#6a0dad',
                        padding:'5px 15px',
                        borderRadius:'5px',
                        marginTop:'1rem'
                    }}
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const addGlobalStyles = () => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
        @keyframes zoomIn {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        @keyframes zoomOut {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(0.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleElement);
};

addGlobalStyles();

NotPurchasedAlert.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default NotPurchasedAlert;
