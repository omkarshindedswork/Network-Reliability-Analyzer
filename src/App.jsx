import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <AnimatePresence mode="wait">
      {page === 'home' ? (
        <motion.div key="home"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}>
          <Home onStart={() => setPage('dashboard')} />
        </motion.div>
      ) : (
        <motion.div key="dashboard"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}>
          <Dashboard onBack={() => setPage('home')} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
