/**
 * Pure CSS decoration: scanlines, vignette, grain.
 * Never intercepts pointer events; adds no layout size.
 */
export function RetroEffects() {
  return (
    <>
      <div className="vhs-scanlines" aria-hidden="true" />
      <div className="vhs-vignette" aria-hidden="true" />
      <div className="vhs-grain" aria-hidden="true" />
    </>
  );
}
