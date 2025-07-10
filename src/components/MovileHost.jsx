import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

// Nuevo componente para mostrar las predicciones
const PredictionResults = ({ predictionData }) => {
	if (!predictionData || !predictionData.prediction) {
		return null;
	}

	const { prediction, confidence, predicted_class } = predictionData;
	const { all_probabilities } = prediction;

	// Convertir las probabilidades a un array ordenado
	const sortedProbabilities = Object.entries(all_probabilities)
		.map(([className, probability]) => ({
			className,
			probability: Number(probability),
			percentage: (Number(probability) * 100).toFixed(2),
			isWinner: className === predicted_class,
		}))
		.sort((a, b) => b.probability - a.probability);

	// Función para obtener el color basado en la probabilidad y si es el ganador
	const getBarColor = (item) => {
		if (item.isWinner) {
			return "bg-gradient-to-r from-green-500 to-emerald-600";
		}
		if (item.probability > 0.5) {
			return "bg-gradient-to-r from-blue-500 to-blue-600";
		}
		if (item.probability > 0.1) {
			return "bg-gradient-to-r from-yellow-500 to-orange-500";
		}
		return "bg-gradient-to-r from-gray-400 to-gray-500";
	};

	// Función para obtener el ícono basado en la clase
	const getClassIcon = (className) => {
		const icons = {
			"Black Scurf": "🟫",
			Blackleg: "⚫",
			"Common Scab": "🔴",
			"Dry Rot": "🟤",
			"Healthy Potatoes": "🥔",
			Miscellaneous: "❓",
			"Pink Rot": "🩷",
		};
		return icons[className] || "🔍";
	};

	return (
		<div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
			<div className="mb-6">
				<h3 className="text-2xl font-bold text-gray-800 mb-2">
					🤖 Resultados de Predicción
				</h3>
				<div className="flex items-center space-x-4 text-sm text-gray-600">
					<div className="flex items-center space-x-2">
						<span className="font-medium">Clase Predicha:</span>
						<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
							{getClassIcon(predicted_class)} {predicted_class}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<span className="font-medium">Confianza:</span>
						<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
							{(confidence * 100).toFixed(1)}%
						</span>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h4 className="text-lg font-semibold text-gray-700 mb-3">
					📊 Probabilidades por Clase
				</h4>

				<div className="space-y-3">
					{sortedProbabilities.map((item, index) => (
						<div
							key={item.className}
							className={`p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
								item.isWinner
									? "bg-green-50 border-2 border-green-200"
									: "bg-gray-50 border border-gray-200"
							}`}
						>
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center space-x-3">
									<span className="text-2xl">
										{getClassIcon(item.className)}
									</span>
									<div>
										<span className="font-medium text-gray-800">
											{item.className}
										</span>
										{item.isWinner && (
											<span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
												GANADOR
											</span>
										)}
									</div>
								</div>
								<div className="text-right">
									<div className="text-lg font-bold text-gray-800">
										{item.percentage}%
									</div>
									<div className="text-xs text-gray-500">#{index + 1}</div>
								</div>
							</div>

							<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
								<div
									className={`h-full transition-all duration-500 ease-out ${getBarColor(
										item,
									)}`}
									style={{ width: `${Math.max(item.percentage, 0.5)}%` }}
								/>
							</div>

							<div className="mt-2 text-xs text-gray-500">
								Probabilidad: {item.probability.toExponential(4)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Métricas adicionales */}
			<div className="mt-6 p-4 bg-gray-50 rounded-lg">
				<h5 className="font-medium text-gray-700 mb-2">
					📈 Métricas Adicionales
				</h5>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span className="text-gray-600">Total de Clases:</span>
						<span className="ml-2 font-medium">
							{sortedProbabilities.length}
						</span>
					</div>
					<div>
						<span className="text-gray-600">Probabilidad Máxima:</span>
						<span className="ml-2 font-medium">
							{(sortedProbabilities[0]?.probability * 100).toFixed(2)}%
						</span>
					</div>
					<div>
						<span className="text-gray-600">Diferencia con 2do:</span>
						<span className="ml-2 font-medium">
							{sortedProbabilities.length > 1
								? (
										(sortedProbabilities[0]?.probability -
											sortedProbabilities[1]?.probability) *
										100
									).toFixed(2)
								: "N/A"}
							%
						</span>
					</div>
					<div>
						<span className="text-gray-600">Entropía:</span>
						<span className="ml-2 font-medium">
							{sortedProbabilities
								.reduce((entropy, item) => {
									const p = item.probability;
									return entropy + (p > 0 ? -p * Math.log2(p) : 0);
								}, 0)
								.toFixed(3)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const App = () => {
	const videoRef = useRef(null);
	const [serverIp, setServerIp] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState(null);
	const [frameCount, setFrameCount] = useState(0);
	const [lastResponse, setLastResponse] = useState(null);

	// Refs para controlar el streaming
	const intervalRef = useRef(null);

	// Función para normalizar la URL del servidor
	const normalizeServerUrl = (initialUrl) => {
		if (!initialUrl) return "";
		let normalized = initialUrl.trim();
		if (
			!normalized.startsWith("http://") &&
			!normalized.startsWith("https://")
		) {
			normalized = `http://${normalized}`;
		}
		return normalized.replace(/\/$/, "");
	};

	// Efecto para solicitar acceso a la cámara
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: 640,
					height: 480,
					facingMode: "environment", // Cámara trasera en móviles
				},
			})
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					// Esperar a que los metadatos estén listos y reproducir
					videoRef.current.onloadedmetadata = () => {
						videoRef.current
							.play()
							.catch((e) => console.error("Error al reproducir el video:", e));
					};
				}
			})
			.catch((err) => {
				console.error("Error al acceder a la cámara:", err);
				setConnectionStatus("error");
			});

		// Limpieza al desmontar
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (videoRef.current?.srcObject) {
				for (const track of videoRef.current.srcObject.getTracks()) {
					track.stop();
				}
			}
		};
	}, []);

	const testConnection = async () => {
		const url = normalizeServerUrl(serverIp);
		if (!url) {
			alert("Por favor, ingresa la IP del servidor.");
			return;
		}
		try {
			setConnectionStatus("testing");
			const response = await axios.get(`${url}/test`, {
				headers: { "ngrok-skip-browser-warning": "true" },
			});
			console.log("Test de conexión exitoso:", response.data);
			setConnectionStatus("connected");
			setLastResponse(response.data);
			alert(`✅ Conexión exitosa!\n${response.data.message}`);
		} catch (error) {
			console.error("Error en test de conexión:", error);
			setConnectionStatus("error");
			alert(`❌ Error de conexión: ${error.message}`);
		}
	};

	const sendFrame = async () => {
		if (
			!videoRef.current ||
			videoRef.current.readyState < 3 ||
			videoRef.current.videoWidth === 0
		) {
			console.warn("El video no está listo, omitiendo frame.");
			return;
		}

		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

		try {
			const blob = await new Promise((resolve) =>
				canvas.toBlob((b) => resolve(b), "image/jpeg", 0.7),
			);
			if (!blob) throw new Error("No se pudo generar el blob del canvas");

			const formData = new FormData();
			formData.append("frame", blob, "frame.jpg");

			const url = normalizeServerUrl(serverIp);
			const resp = await fetch(`${url}/stream`, {
				method: "POST",
				body: formData,
				headers: { "ngrok-skip-browser-warning": "true" },
			});

			if (!resp.ok) {
				const errorText = await resp.text();
				throw new Error(
					`El servidor respondió con ${resp.status}: ${errorText}`,
				);
			}

			const data = await resp.json();
			setLastResponse(data);
			setFrameCount((prev) => prev + 1);
		} catch (error) {
			console.error("Error en ciclo de envío:", error);
			setConnectionStatus("error");
			stopStreaming(); // Detener si hay un error
		}
	};

	const startStreaming = async () => {
		const url = normalizeServerUrl(serverIp);
		if (!url) {
			alert("Por favor, ingresa la IP del servidor.");
			return;
		}

		try {
			setConnectionStatus("testing");
			const response = await axios.get(`${url}/test`, {
				headers: { "ngrok-skip-browser-warning": "true" },
			});
			if (response.status !== 200) {
				throw new Error(`El servidor respondió con estado ${response.status}`);
			}
			console.log(
				"Prueba de conexión exitosa antes del stream:",
				response.data,
			);

			setIsStreaming(true);
			setConnectionStatus("streaming");
			setFrameCount(0);

			if (intervalRef.current) clearInterval(intervalRef.current);
			intervalRef.current = setInterval(sendFrame, 500);
		} catch (error) {
			console.error("Falló la prueba de conexión:", error);
			setConnectionStatus("error");
			alert(`❌ No se pudo conectar al servidor: ${error.message}.`);
		}
	};

	const stopStreaming = () => {
		setIsStreaming(false);
		setConnectionStatus("disconnected");
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-6xl mx-auto space-y-6">
				<div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8">
						<h1 className="text-3xl font-bold text-white text-center">
							📱 Cliente de Streaming React
						</h1>
						<p className="text-blue-100 text-center mt-2">
							Transmite video desde tu dispositivo móvil al servidor Flask
						</p>
					</div>

					{/* Video Section */}
					<div className="p-6">
						<div className="relative bg-black rounded-xl overflow-hidden shadow-lg mb-6">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className="w-full h-auto max-h-96 object-cover"
							>
								<track kind="captions" />
							</video>

							{/* Status indicators */}
							<div className="absolute top-4 right-4 space-y-2">
								{/* Connection Status */}
								{connectionStatus && (
									<div
										className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${
											connectionStatus === "connected"
												? "bg-green-500 text-white"
												: connectionStatus === "streaming"
													? "bg-green-500 text-white"
													: connectionStatus === "testing"
														? "bg-blue-500 text-white"
														: connectionStatus === "error"
															? "bg-red-500 text-white"
															: "bg-gray-500 text-white"
										}`}
									>
										<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
										<span>
											{connectionStatus === "connected" && "CONECTADO"}
											{connectionStatus === "streaming" && "ENVIANDO"}
											{connectionStatus === "testing" && "PROBANDO"}
											{connectionStatus === "error" && "ERROR"}
											{connectionStatus === "disconnected" && "DESCONECTADO"}
										</span>
									</div>
								)}

								{/* Streaming indicator */}
								{isStreaming && (
									<div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
										<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
										<span>EN VIVO</span>
									</div>
								)}
							</div>
						</div>

						{/* Controls Section */}
						<div className="space-y-4">
							{/* Server IP Input */}
							<div>
								<label
									htmlFor="serverIp"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									IP del servidor (con puerto)
								</label>
								<input
									id="serverIp"
									type="text"
									placeholder="Ej: 192.168.1.56:5002 o https://tu-dominio.com"
									value={serverIp}
									onChange={(e) => setServerIp(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									disabled={isStreaming}
								/>
							</div>

							{/* Action Buttons */}
							<div className="space-y-3">
								{/* Test Connection Button */}
								<button
									type="button"
									onClick={testConnection}
									disabled={!serverIp || isStreaming}
									className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
										!serverIp || isStreaming
											? "bg-gray-300 text-gray-500 cursor-not-allowed"
											: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
									}`}
								>
									🔗 Test de Conexión
								</button>

								{/* Streaming Buttons */}
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
						</div>

						{/* Status Info */}
						<div className="mt-6 space-y-4">
							{/* Connection Status */}
							<div className="p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center justify-between text-sm text-gray-600">
									<span>Estado de Conexión:</span>
									<span
										className={`font-medium ${
											connectionStatus === "connected" ||
											connectionStatus === "streaming"
												? "text-green-600"
												: connectionStatus === "testing"
													? "text-blue-600"
													: connectionStatus === "error"
														? "text-red-600"
														: "text-gray-500"
										}`}
									>
										{connectionStatus === "connected" && "🟢 Conectado"}
										{connectionStatus === "streaming" && "🔴 Transmitiendo"}
										{connectionStatus === "testing" && "🔵 Probando..."}
										{connectionStatus === "error" && "❌ Error"}
										{connectionStatus === "disconnected" && "🔴 Desconectado"}
										{!connectionStatus && "⚪ Sin probar"}
									</span>
								</div>

								<div className="flex items-center justify-between text-sm text-gray-600 mt-2">
									<span>Streaming:</span>
									<span
										className={`font-medium ${
											isStreaming ? "text-green-600" : "text-gray-500"
										}`}
									>
										{isStreaming ? "🟢 Activo" : "🔴 Detenido"}
									</span>
								</div>

								{serverIp && (
									<div className="flex items-center justify-between text-sm text-gray-600 mt-2">
										<span>Servidor:</span>
										<span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">
											{normalizeServerUrl(serverIp)}
										</span>
									</div>
								)}

								{frameCount > 0 && (
									<div className="flex items-center justify-between text-sm text-gray-600 mt-2">
										<span>Frames enviados:</span>
										<span className="font-medium text-blue-600">
											{frameCount}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Prediction Results - Nueva sección */}
				{lastResponse?.prediction && (
					<PredictionResults predictionData={lastResponse} />
				)}
			</div>
		</div>
	);
};

export default App;
