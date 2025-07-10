import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

// Nuevo componente para mostrar las predicciones
const PredictionResults = ({ predictionData }) => {
	if (!predictionData || !predictionData.prediction) {
		return (
			<div className="p-6 h-full flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl">
				<div className="text-4xl mb-4">🤖</div>
				<h3 className="text-xl font-bold text-gray-700">
					Esperando predicción...
				</h3>
				<p className="text-gray-500 mt-2">
					Inicia el streaming para ver los resultados del modelo en tiempo real.
				</p>
			</div>
		);
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
		<div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 h-full overflow-y-auto">
			<div className="sticky top-0 bg-white py-4 border-b border-gray-200 z-10">
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

			<div className="space-y-4 mt-4">
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
	const cropBoxRef = useRef(null); // Ref para el recuadro de recorte
	const [serverIp, setServerIp] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState(null);
	const [frameCount, setFrameCount] = useState(0);
	const [lastResponse, setLastResponse] = useState(null);
	const intervalRef = useRef(null);

	// Normaliza la URL del servidor
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

	// Efecto para solicitar la cámara y limpiar recursos
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: 1280,
					height: 720,
					facingMode: "environment",
				},
			})
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
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

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (videoRef.current?.srcObject) {
				for (const track of videoRef.current.srcObject.getTracks()) {
					track.stop();
				}
			}
		};
	}, []);

	// Función para enviar el frame recortado
	const sendFrame = async () => {
		if (
			!videoRef.current ||
			!cropBoxRef.current ||
			videoRef.current.readyState < 3
		) {
			console.warn("Video o crop box no listos.");
			return;
		}

		const video = videoRef.current;
		const cropBox = cropBoxRef.current;
		const canvas = document.createElement("canvas");

		// Proporciones para mapear el cropBox a las coordenadas del video real
		const videoRect = video.getBoundingClientRect();
		const scaleX = video.videoWidth / videoRect.width;
		const scaleY = video.videoHeight / videoRect.height;

		// Coordenadas y dimensiones del crop
		const cropBoxRect = cropBox.getBoundingClientRect();
		const sx = (cropBoxRect.left - videoRect.left) * scaleX;
		const sy = (cropBoxRect.top - videoRect.top) * scaleY;
		const sWidth = cropBoxRect.width * scaleX;
		const sHeight = cropBoxRect.height * scaleY;

		// El canvas tendrá el tamaño del recorte
		canvas.width = 224; // Tamaño estándar para modelos de visión
		canvas.height = 224;

		const context = canvas.getContext("2d");
		context.drawImage(
			video,
			sx,
			sy,
			sWidth,
			sHeight,
			0,
			0,
			canvas.width,
			canvas.height,
		);

		try {
			const blob = await new Promise((resolve) =>
				canvas.toBlob((b) => resolve(b), "image/jpeg", 0.8),
			);
			if (!blob) throw new Error("No se pudo generar el blob");

			const formData = new FormData();
			formData.append("frame", blob, "frame.jpg");

			const url = normalizeServerUrl(serverIp);
			const resp = await fetch(`${url}/stream`, {
				method: "POST",
				body: formData,
				headers: { "ngrok-skip-browser-warning": "true" },
			});
			if (!resp.ok) throw new Error(`El servidor respondió ${resp.status}`);

			const data = await resp.json();
			setLastResponse(data);
			setFrameCount((prev) => prev + 1);
		} catch (error) {
			console.error("Error en ciclo de envío:", error);
			setConnectionStatus("error");
			stopStreaming();
		}
	};

	// Resto de funciones (testConnection, startStreaming, stopStreaming) se mantienen similares...
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
		<div className="min-h-screen bg-gray-100 p-4">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
				{/* Columna Principal (Cámara y Controles) */}
				<div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5">
						<h1 className="text-2xl font-bold text-white text-center">
							Cliente de Clasificación Visual
						</h1>
					</div>

					<div className="p-6">
						<div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-6 flex items-center justify-center">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className="w-full h-full object-cover"
							>
								<track kind="captions" />
							</video>
							<div
								ref={cropBoxRef}
								className="absolute w-[224px] h-[224px] pointer-events-none"
							>
								<div className="absolute inset-0 border-4 border-white border-dashed rounded-lg opacity-75 animate-pulse" />
								<div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 text-xs font-bold rounded">
									ÁREA DE ANÁLISIS
								</div>
							</div>
						</div>

						{/* Controles y Estado */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Controles */}
							<div className="space-y-4">
								<div>
									<label
										htmlFor="serverIp"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										URL del Servidor
									</label>
									<input
										id="serverIp"
										type="text"
										placeholder="https://tu-endpoint.ngrok.io"
										value={serverIp}
										onChange={(e) => setServerIp(e.target.value)}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
										disabled={isStreaming}
									/>
								</div>
								<div className="space-y-2">
									<button
										type="button"
										onClick={testConnection}
										disabled={!serverIp || isStreaming}
										className="w-full py-2.5 px-5 rounded-lg font-semibold transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
									>
										Probar Conexión
									</button>
									<div className="flex space-x-3">
										<button
											type="button"
											onClick={startStreaming}
											disabled={isStreaming || !serverIp}
											className="flex-1 py-2.5 px-5 rounded-lg font-semibold transition-all bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300"
										>
											{isStreaming ? "Transmitiendo..." : "Iniciar Stream"}
										</button>
										<button
											type="button"
											onClick={stopStreaming}
											disabled={!isStreaming}
											className="flex-1 py-2.5 px-5 rounded-lg font-semibold transition-all bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300"
										>
											Detener Stream
										</button>
									</div>
								</div>
							</div>

							{/* Estado */}
							<div className="p-4 bg-gray-50 rounded-lg space-y-3">
								<div className="flex justify-between items-center text-sm">
									<span className="text-gray-600">Estado Conexión:</span>
									<span
										className={`font-bold ${
											connectionStatus === "connected" ||
											connectionStatus === "streaming"
												? "text-green-600"
												: connectionStatus === "error"
													? "text-red-600"
													: "text-gray-500"
										}`}
									>
										{connectionStatus
											? connectionStatus.toUpperCase()
											: "INACTIVO"}
									</span>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-gray-600">Streaming:</span>
									<span
										className={`font-bold ${isStreaming ? "text-green-600" : "text-gray-500"}`}
									>
										{isStreaming ? "ACTIVO" : "DETENIDO"}
									</span>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-gray-600">Frames Enviados:</span>
									<span className="font-bold text-blue-600">{frameCount}</span>
								</div>
								{serverIp && (
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Servidor:</span>
										<span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs truncate">
											{normalizeServerUrl(serverIp)}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Columna de Predicciones */}
				<div className="lg:col-span-1 h-full min-h-[500px]">
					<PredictionResults predictionData={lastResponse} />
				</div>
			</div>
		</div>
	);
};

export default App;
