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
				.post(`http://${serverIp}/stream`, { frame })
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
						<h1 className="text-3xl font-bold text-white text-center">
							📱 Streaming desde el celular
						</h1>
						<p className="text-blue-100 text-center mt-2">
							Transmite video en tiempo real desde tu dispositivo móvil
						</p>
					</div>

					{/* Video Section */}
					<div className="p-6">
						<div className="relative bg-black rounded-xl overflow-hidden shadow-lg mb-6">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className="w-full h-auto max-h-96 object-cover"
							>
								<track kind="captions" />
							</video>

							{/* Streaming indicator */}
							{isStreaming && (
								<div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
									<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
									<span>EN VIVO</span>
								</div>
							)}
						</div>

						{/* Controls Section */}
						<div className="space-y-4">
							{/* Server IP Input */}
							<div>
								<label
									htmlFor="serverIp"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									IP del servidor
								</label>
								<input
									id="serverIp"
									type="text"
									placeholder="Ej: 192.168.1.100"
									value={serverIp}
									onChange={(e) => setServerIp(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									disabled={isStreaming}
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex space-x-4">
								<button
									type="button"
									onClick={startStreaming}
									disabled={isStreaming || !serverIp}
									className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
										isStreaming || !serverIp
											? "bg-gray-300 text-gray-500 cursor-not-allowed"
											: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
									}`}
								>
									{isStreaming ? "Transmitiendo..." : "🚀 Iniciar Streaming"}
								</button>

								<button
									type="button"
									onClick={stopStreaming}
									disabled={!isStreaming}
									className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
										!isStreaming
											? "bg-gray-300 text-gray-500 cursor-not-allowed"
											: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
									}`}
								>
									⏹️ Detener Streaming
								</button>
							</div>
						</div>

						{/* Status Info */}
						<div className="mt-6 p-4 bg-gray-50 rounded-lg">
							<div className="flex items-center justify-between text-sm text-gray-600">
								<span>Estado:</span>
								<span
									className={`font-medium ${isStreaming ? "text-green-600" : "text-gray-500"}`}
								>
									{isStreaming ? "🟢 Transmitiendo" : "🔴 Detenido"}
								</span>
							</div>
							{serverIp && (
								<div className="flex items-center justify-between text-sm text-gray-600 mt-2">
									<span>Servidor:</span>
									<span className="font-mono bg-gray-200 px-2 py-1 rounded">
										{serverIp}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
