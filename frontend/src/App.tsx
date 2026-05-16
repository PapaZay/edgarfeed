import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FeedPage from './pages/FeedPage'
import TickerPage from './pages/TickerPage'
import InsiderPage from './pages/InsiderPage'
import TradeDetailPage from './pages/TradeDetailPage'

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<FeedPage />} />
      <Route path='/ticker/:symbol' element={<TickerPage />} />
      <Route path='/insider/:name' element={<InsiderPage />} />
      <Route path='/trade/:id' element={<TradeDetailPage />} />
    </Routes>
  </BrowserRouter>
  )
  
}

export default App
