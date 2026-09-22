import { useCallback, useState } from 'react'
import { About } from './components/About'
import { Hero } from './components/Hero'
import { IntroLoader, shouldSkipIntro } from './components/IntroLoader'
import { WorldReach } from './components/WorldReach'

export default function App() {
  const [heroReady, setHeroReady] = useState(shouldSkipIntro)
  const [showIntro, setShowIntro] = useState(() => !shouldSkipIntro())

  const handleComplete = useCallback(() => {
    setHeroReady(true)
    setShowIntro(false)
  }, [])

  return (
    <>
      <Hero ready={heroReady} />
      <WorldReach />
      <About />
      {showIntro ? <IntroLoader onComplete={handleComplete} /> : null}
    </>
  )
}
