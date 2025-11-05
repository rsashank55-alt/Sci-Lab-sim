import { Experiment } from '../types'
import { Beaker, FlaskConical, Atom, Zap, Waves, Gauge, TestTube, Droplets } from 'lucide-react'

interface HomePageProps {
  onSelectExperiment: (experiment: Experiment) => void
}

const experiments: Experiment[] = [
  { id: 'gravity', name: 'Gravity & Motion', icon: Gauge, category: 'Physics' },
  { id: 'pendulum', name: 'Pendulum Motion', icon: Waves, category: 'Physics' },
  { id: 'wave', name: 'Wave Motion', icon: Waves, category: 'Physics' },
  { id: 'circuit', name: 'Electric Circuit', icon: Zap, category: 'Physics' },
  { id: 'reaction', name: 'Chemical Reactions', icon: Beaker, category: 'Chemistry' },
  { id: 'molecules', name: 'Molecular Structure', icon: Atom, category: 'Chemistry' },
  { id: 'states', name: 'States of Matter', icon: Droplets, category: 'Chemistry' },
  { id: 'ph', name: 'pH Scale', icon: TestTube, category: 'Chemistry' },
  { id: 'refraction', name: 'Light Refraction', icon: Zap, category: 'Physics' },
  { id: 'magnetic', name: 'Magnetic Field', icon: Zap, category: 'Physics' },
  { id: 'sound', name: 'Sound Waves', icon: Waves, category: 'Physics' },
  { id: 'projectile', name: 'Projectile Motion', icon: Gauge, category: 'Physics' },
  { id: 'friction', name: 'Friction', icon: Gauge, category: 'Physics' },
  { id: 'periodic', name: 'Periodic Table', icon: Atom, category: 'Chemistry' },
  { id: 'optics', name: 'Optics & Lenses', icon: Zap, category: 'Physics' },
]

export default function HomePage({ onSelectExperiment }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Science Lab Simulator
          </h1>
          <p className="text-xl text-gray-300">
            Explore Physics & Chemistry through Interactive Experiments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiments.map((experiment) => {
            const Icon = experiment.icon
            return (
              <button
                key={experiment.id}
                onClick={() => onSelectExperiment(experiment)}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700 hover:border-purple-500"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-semibold mb-2">{experiment.name}</h3>
                <p className="text-sm text-gray-400">{experiment.category}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

