import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const App = () => {
	const videoRef = useRef(null);
	const [serverIp, setServerIp] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);

	useEffect(() => {
		// Solicitar acceso a la cámara
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			})
			.catch((err) => {
				console.error("Error al acceder a la cámara:", err);
			});
	}, []);

	const startStreaming = () => {
		if (!serverIp) {
			alert("Por favor, ingresa la IP del servidor.");
			return;
		}

		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");

		setIsStreaming(true);

		const sendFrame = () => {
			if (!isStreaming) return;

			// Capturar el frame actual del video
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

			// Convertir el frame a base64
			const frame = canvas.toDataURL("image/jpeg");

			// Enviar el frame al servidor
			axios
				.post(`http://${serverIp}:5000/stream`, { frame })
				.then((response) => {
					console.log("Frame enviado:", response.data);
				})
				.catch((err) => {
					console.error("Error al enviar el frame:", err);
				});

			// Continuar enviando frames
			setTimeout(sendFrame, 100); // Enviar un frame cada 100ms
		};

		sendFrame();
	};

	const stopStreaming = () => {
		setIsStreaming(false);
	};

	return (
		<div>
			<h1>Streaming desde el celular</h1>
			<video ref={videoRef} autoPlay playsInline style={{ width: "100%" }}>
				<track kind="captions" />
			</video>
			<div>
				<input
					type="text"
					placeholder="IP del servidor (ej: 192.168.x.x)"
					value={serverIp}
					onChange={(e) => setServerIp(e.target.value)}
				/>
				<button type="button" onClick={startStreaming}>
					Iniciar Streaming
				</button>
				<button type="button" onClick={stopStreaming}>
					Detener Streaming
				</button>
			</div>
		</div>
	);
};

export default App;
