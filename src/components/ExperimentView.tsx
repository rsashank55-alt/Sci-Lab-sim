import { Experiment } from '../types'
import { ArrowLeft } from 'lucide-react'

interface ExperimentViewProps {
  experiment: Experiment
  onBack: () => void
}

export default function ExperimentView({ experiment, onBack }: ExperimentViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Experiments
        </button>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {experiment.name}
          </h2>
          <p className="text-gray-300 mb-6">
            This experiment view is a placeholder. The actual experiments are implemented in the vanilla JavaScript version.
            Please use the main index.html file to access the interactive experiments.
          </p>
          
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
            <p className="text-gray-400">
              To use the full interactive Science Lab Simulator, open <code className="text-purple-400">index.html</code> in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

