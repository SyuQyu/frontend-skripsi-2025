import { create } from "zustand"

interface ContactUsStep {
  error: string | null
  isLoading: boolean
  completedSteps: {
    [key: string]: boolean
  }
  completeStep: (step: string) => void
  canAccessStep: (step: string) => any
}

const useContactUsStep = create<ContactUsStep>((set, get) => ({
  error: null,
  isLoading: false,
  completedSteps: {
    step1: true,
    step2: false,
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

export default useContactUsStep
