import { create } from "zustand"

interface ForgotPasswordStep {
  error: string | null
  isLoading: boolean
  completedSteps: {
    [key: string]: boolean
  }
  completeStep: (step: string) => void
  canAccessStep: (step: string) => any
}

const useForgotPasswordStep = create<ForgotPasswordStep>((set, get) => ({
  error: null,
  isLoading: false,
  completedSteps: {
    step1: true,
    step2: false,
    step3: false,
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

export default useForgotPasswordStep
