import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './components/HomePage'
import ExperimentView from './components/ExperimentView'
import { Experiment } from './types'

function App() {
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null)

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!currentExperiment ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onSelectExperiment={setCurrentExperiment} />
          </motion.div>
        ) : (
          <motion.div
            key="experiment"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ExperimentView 
              experiment={currentExperiment} 
              onBack={() => setCurrentExperiment(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
