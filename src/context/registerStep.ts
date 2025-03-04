import { create } from "zustand"

interface RegisterStep {
  error: string | null
  isLoading: boolean
  completedSteps: {
    [key: string]: boolean
  }
  completeStep: (step: string) => void
  canAccessStep: (step: string) => any
}

const useRegisterStep = create<RegisterStep>((set, get) => ({
  error: null,
  isLoading: false,
  completedSteps: {
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  },

  completeStep: (step: string) => {
    set(state => ({
      completedSteps: {
        ...state.completedSteps,
        [step]: true,
      },
    }))
  },

  canAccessStep: (step: string) => {
    return get().completedSteps[step]
  },
}))

export default useRegisterStep
