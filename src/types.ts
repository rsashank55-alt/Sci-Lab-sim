import { LucideIcon } from 'lucide-react'

export interface Experiment {
  id: string
  name: string
  category: 'Physics' | 'Chemistry'
  icon: LucideIcon
}

export interface ExperimentProps {
  onBack: () => void
}

export interface ExperimentData {
  physics: Experiment[]
  chemistry: Experiment[]
}
