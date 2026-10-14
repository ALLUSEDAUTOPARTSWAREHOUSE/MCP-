export function GearBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Large metallic gear top-left */}
      <div
        className="gear-spin-cw absolute -top-[10%] -left-[12%]"
        style={{ "--speed": "40s", "--base-opacity": "0.08" } as React.CSSProperties}
      >
        <img src="/images/icon-gear.png" alt="" className="w-80 h-80 opacity-20" />
      </div>

      {/* Medium metallic gear top-right */}
      <div
        className="gear-spin-ccw absolute -top-[20%] -right-[15%]"
        style={{ "--speed": "55s", "--base-opacity": "0.06" } as React.CSSProperties}
      >
        <img src="/images/icon-gear.png" alt="" className="w-96 h-96 opacity-15" />
      </div>

      {/* Small metallic gear right side */}
      <div
        className="gear-spin-ccw absolute top-[35%] right-[8%]"
        style={{ "--speed": "20s", "--base-opacity": "0.12" } as React.CSSProperties}
      >
        <img src="/images/icon-gear.png" alt="" className="w-56 h-56 opacity-25" />
      </div>

      {/* Tiny metallic gear left bottom */}
      <div
        className="gear-spin-cw absolute top-[60%] left-[-5%]"
        style={{ "--speed": "18s", "--base-opacity": "0.08" } as React.CSSProperties}
      >
        <img src="/images/icon-gear.png" alt="" className="w-40 h-40 opacity-18" />
      </div>

      {/* Bottom-right metallic gear */}
      <div
        className="gear-spin-ccw absolute bottom-[10%] right-[25%]"
        style={{ "--speed": "16s", "--base-opacity": "0.14" } as React.CSSProperties}
      >
        <img src="/images/icon-gear.png" alt="" className="w-32 h-32 opacity-20" />
      </div>
    </div>
  )
}
