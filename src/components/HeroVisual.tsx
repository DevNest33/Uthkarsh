export function HeroVisual() {
  return (
    <div className="hero-visual-in relative h-full min-h-0 w-full">
      <div className="hero-ship-mask relative h-full w-full overflow-hidden bg-navy">
        <img
          src="/hero/ship-scene.jpg"
          alt=""
          className="hero-ship-scene absolute inset-0 h-full w-full object-cover object-[58%_center]"
        />
      </div>
    </div>
  )
}
