import { useCallback, useState } from 'react'
import { About } from './components/About'
import { Catalogue } from './components/Catalogue'
import { Hero } from './components/Hero'
import { IntroLoader, shouldSkipIntro } from './components/IntroLoader'
import { WorldReach } from './components/WorldReach'

type SitePage = 'home' | 'catalogue'

export default function App() {
  const [heroReady, setHeroReady] = useState(shouldSkipIntro)
  const [showIntro, setShowIntro] = useState(() => !shouldSkipIntro())
  const [page, setPage] = useState<SitePage>('home')

  const handleComplete = useCallback(() => {
    setHeroReady(true)
    setShowIntro(false)
  }, [])

  const showHome = useCallback(() => {
    setPage('home')
    window.scrollTo(0, 0)
  }, [])

  const showCatalogue = useCallback(() => {
    setPage('catalogue')
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {page === 'catalogue' ? (
        <Catalogue onHome={showHome} onCatalogue={showCatalogue} />
      ) : (
        <>
          <Hero ready={heroReady} onHome={showHome} onExplore={showCatalogue} />
          <WorldReach />
          <About />
        </>
      )}
      {showIntro ? <IntroLoader onComplete={handleComplete} /> : null}
    </>
  )
}
