export interface Experiment {
  id: string
  title: string
  category: 'physics' | 'chemistry'
  description: string
  icon: string
  color: string
  component: React.ComponentType<ExperimentProps>
}

export interface ExperimentProps {
  onBack: () => void
}

export interface ExperimentData {
  physics: Experiment[]
  chemistry: Experiment[]
}
