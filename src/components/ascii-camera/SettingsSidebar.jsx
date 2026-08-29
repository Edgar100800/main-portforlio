import { Button } from "@/components/ui/button";
import {
  ASPECT_OPTIONS,
  CHARSETS,
  MAX_COLS,
  MIN_COLS,
} from "./constants";

export function SettingsSidebar({
  isMobileLayout,
  isMobileOpen,
  isDesktopOpen,
  settings,
  update,
  setMirror,
  videoDevices,
  selectedDeviceId,
  selectDevice,
  chars,
}) {
  const isOpen = isMobileLayout ? isMobileOpen : isDesktopOpen;

  const sidebarStyle = {
    width: isOpen ? "230px" : "0",
    position: isMobileLayout ? "fixed" : "static",
    top: isMobileLayout ? "50px" : "0",
    left: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: "#222",
    color: "#eee",
    padding: isOpen ? "1rem" : "0",
    boxSizing: "border-box",
    overflow: "hidden",
    transition: "width 0.3s ease, padding 0.3s ease",
    flexShrink: 0,
    borderRight: !isMobileLayout && isOpen ? "1px solid #444" : "none",
  };

  return (
    <div style={sidebarStyle}>
      {isOpen && (
        <div className="space-y-6 h-full overflow-y-auto p-4">
          <h2 className="mb-2 border-b border-gray-600 pb-2 text-xl font-semibold">
            Settings
          </h2>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Camera</h3>
            <select
              value={selectedDeviceId ?? ""}
              onChange={(e) => selectDevice(e.target.value)}
              className="w-full rounded border border-gray-600 bg-black/40 p-1 text-sm"
            >
              {videoDevices.length === 0 && (
                <option value="">Default camera</option>
              )}
              {videoDevices.map((device, i) => (
                <option key={device.deviceId || i} value={device.deviceId}>
                  {device.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Aspect Ratio</h3>
            <div className="flex gap-2">
              {ASPECT_OPTIONS.map((opt) => (
                <Button
                  key={opt.key}
                  variant={settings.aspectMode === opt.key ? "secondary" : "outline"}
                  size="sm"
                  className={`flex-1 ${
                    settings.aspectMode === opt.key
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "border-gray-500"
                  } text-gray-100`}
                  onClick={() => update({ aspectMode: opt.key })}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium">Image</h3>
            <label className="block space-y-1 text-xs">
              <span>Resolution ({settings.cols} cols)</span>
              <input
                type="range"
                min={MIN_COLS}
                max={MAX_COLS}
                step={4}
                value={settings.cols}
                onChange={(e) => update({ cols: Number(e.target.value) })}
                className="w-full accent-gray-400"
              />
            </label>
            <label className="block space-y-1 text-xs">
              <span>Contrast ({settings.contrast.toFixed(2)})</span>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={settings.contrast}
                onChange={(e) => update({ contrast: Number(e.target.value) })}
                className="w-full accent-gray-400"
              />
            </label>
            <label className="block space-y-1 text-xs">
              <span>Gamma ({settings.gamma.toFixed(2)})</span>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={settings.gamma}
                onChange={(e) => update({ gamma: Number(e.target.value) })}
                className="w-full accent-gray-400"
              />
            </label>
            <div className="space-y-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.invert}
                  onChange={(e) => update({ invert: e.target.checked })}
                />
                Invert
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.mirror}
                  onChange={(e) => setMirror(e.target.checked)}
                />
                Mirror
              </label>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Charset</h3>
            <select
              value={settings.charsetKey}
              onChange={(e) => update({ charsetKey: e.target.value })}
              className="w-full rounded border border-gray-600 bg-black/40 p-1 text-sm"
            >
              {Object.keys(CHARSETS).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
              <option value="custom">custom</option>
            </select>
            {settings.charsetKey === "custom" && (
              <div className="space-y-1">
                <input
                  type="text"
                  value={settings.customChars}
                  onChange={(e) => update({ customChars: e.target.value })}
                  placeholder="@#S%?*+;:."
                  className="w-full rounded border border-gray-600 bg-black/40 p-1 font-mono text-sm"
                />
                <p className="text-[10px] text-gray-400">
                  Order from densest to lightest.
                </p>
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium">Colors</h3>
            <div className="space-y-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="color-mode"
                  checked={settings.colorMode === "uniform"}
                  onChange={() => update({ colorMode: "uniform" })}
                />
                Uniform
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="color-mode"
                  checked={settings.colorMode === "perChar"}
                  onChange={() => update({ colorMode: "perChar" })}
                />
                Per character
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="color-mode"
                  checked={settings.colorMode === "video"}
                  onChange={() => update({ colorMode: "video" })}
                />
                From video
              </label>
            </div>

            {settings.colorMode === "uniform" && (
              <div className="flex items-center gap-2 pl-2">
                <label htmlFor="color-picker-uniform" className="text-sm">
                  Color:
                </label>
                <input
                  id="color-picker-uniform"
                  type="color"
                  value={settings.uniformColor}
                  onChange={(e) => update({ uniformColor: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded border-none"
                />
              </div>
            )}

            {settings.colorMode === "perChar" && (
              <div className="space-y-2 pl-2">
                <h4 className="text-xs font-medium">Character Colors</h4>
                {chars.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="w-4 text-center font-mono">{c}</span>
                    <input
                      type="color"
                      value={settings.charColorMap[c] || "#eeeeee"}
                      onChange={(e) =>
                        update({
                          charColorMap: {
                            ...settings.charColorMap,
                            [c]: e.target.value,
                          },
                        })
                      }
                      className="h-8 w-8 cursor-pointer rounded border-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
