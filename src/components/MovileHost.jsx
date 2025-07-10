import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const videoRef = useRef(null);
  const [serverIp, setServerIp] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [frameCount, setFrameCount] = useState(0);
  const [lastResponse, setLastResponse] = useState(null);
  
  // Refs para controlar el streaming
  const streamingRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Solicitar acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 640,
          height: 480,
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

    // Cleanup al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Función para normalizar la URL del servidor
  const normalizeServerUrl = (url) => {
    if (!url) return "";
    
    // Remover espacios en blanco
    url = url.trim();
    
    // Agregar protocolo si no existe
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
    
    // Remover trailing slash
    return url.replace(/\/$/, "");
  };

  const testConnection = async () => {
    if (!serverIp) {
      alert("Por favor, ingresa la IP del servidor.");
      return;
    }

    try {
      setConnectionStatus("testing");
      const normalizedUrl = normalizeServerUrl(serverIp);
      
      console.log("Probando conexión con:", normalizedUrl);
      
      const response = await axios.get(`${normalizedUrl}/test`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        timeout: 10000, // 10 segundos de timeout
      });
      
      console.log("Test de conexión exitoso:", response.data);
      setConnectionStatus("connected");
      setLastResponse(response.data);
      alert(`✅ Conexión exitosa!\n${response.data.message}`);
    } catch (error) {
      console.error("Error en test de conexión:", error);
      setConnectionStatus("error");
      
      let errorMessage = "Error desconocido";
      if (error.code === "ECONNREFUSED") {
        errorMessage = "Conexión rechazada. Verifica que el servidor esté corriendo.";
      } else if (error.code === "ENOTFOUND") {
        errorMessage = "Servidor no encontrado. Verifica la IP.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Timeout de conexión. El servidor no responde.";
      } else {
        errorMessage = error.message;
      }
      
      alert(`❌ Error de conexión: ${errorMessage}`);
    }
  };

  const startStreaming = async () => {
    if (!serverIp) {
      alert("Por favor, ingresa la IP del servidor.");
      return;
    }

    if (streamingRef.current) {
      console.log("El streaming ya está activo");
      return;
    }

    // Verificar la conexión antes de iniciar el stream
    setConnectionStatus("testing");
    try {
      const normalizedUrl = normalizeServerUrl(serverIp);
      const response = await axios.get(`${normalizedUrl}/test`, {
        headers: { "ngrok-skip-browser-warning": "true" },
        timeout: 5000,
      });
      
      if (response.status !== 200) {
        throw new Error(`El servidor respondió con estado ${response.status}`);
      }
      
      console.log("Prueba de conexión exitosa antes del stream:", response.data);
      setConnectionStatus("connected");
    } catch (error) {
      console.error("Falló la prueba de conexión:", error);
      setConnectionStatus("error");
      alert(
        `❌ No se pudo conectar al servidor: ${error.message}. Revisa la IP e inténtalo de nuevo.`
      );
      return;
    }

    // Iniciar el streaming
    streamingRef.current = true;
    setIsStreaming(true);
    setConnectionStatus("streaming");
    setFrameCount(0);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const normalizedUrl = normalizeServerUrl(serverIp);

    const sendFrame = async () => {
      if (!streamingRef.current || !videoRef.current) {
        console.log("Streaming detenido o video no disponible");
        return;
      }

      // Verificar que el video esté listo
      if (
        videoRef.current.readyState < 2 ||
        videoRef.current.videoWidth === 0 ||
        videoRef.current.videoHeight === 0
      ) {
        console.log("Video no está listo, esperando...");
        return;
      }

      try {
        // Configurar canvas con las dimensiones del video
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        // Dibujar el frame actual del video en el canvas
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

        // Convertir canvas a blob
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("No se pudo generar blob"));
              }
            },
            "image/jpeg",
            0.8
          );
        });

        console.log("Frame capturado, tamaño:", blob.size);

        // Enviar el frame al servidor
        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");

        const response = await fetch(`${normalizedUrl}/stream`, {
          method: "POST",
          body: formData,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          throw new Error(`Servidor respondió ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Frame enviado exitosamente:", data);
        
        setFrameCount((prev) => data.frame_number || prev + 1);
        setLastResponse(data);
        
      } catch (error) {
        console.error("Error enviando frame:", error);
        setConnectionStatus("error");
        
        // Detener streaming en caso de error
        stopStreaming();
        alert(`❌ Error enviando frame: ${error.message}`);
      }
    };

    // Usar setInterval en lugar de setTimeout recursivo
    intervalRef.current = setInterval(sendFrame, 500); // Enviar cada 500ms
  };

  const stopStreaming = () => {
    console.log("Deteniendo streaming...");
    
    streamingRef.current = false;
    setIsStreaming(false);
    setConnectionStatus("disconnected");
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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
                      connectionStatus === "connected" ||
                      connectionStatus === "streaming"
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

              {/* Server Response */}
              {lastResponse && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    Última Respuesta del Servidor:
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>
                      <strong>Estado:</strong> {lastResponse.status}
                    </div>
                    <div>
                      <strong>Mensaje:</strong> {lastResponse.message}
                    </div>
                    {lastResponse.frame_number && (
                      <div>
                        <strong>Frame #:</strong> {lastResponse.frame_number}
                      </div>
                    )}
                    {lastResponse.frame_size && (
                      <div>
                        <strong>Tamaño:</strong> {lastResponse.frame_size}
                      </div>
                    )}
                    {lastResponse.timestamp && (
                      <div>
                        <strong>Timestamp:</strong> {lastResponse.timestamp}
                      </div>
                    )}
                  </div>
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