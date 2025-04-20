import { create } from "zustand"
import {
  createReport,
  deleteReport,
  getAllReports,
  getReportById,
  getReportsByPostId,
  getReportsByReplyId,
  updateReport,
} from "@/endpoints/reports"

export interface Report {
  id: string
  postId?: string
  replyId?: string
  userId: string
  violationCategory: string
  message: string
}

interface ReportPayload {
  postId?: string
  replyId?: string
  userId: string
  violationCategory: string
  message: string
}

interface ReportState {
  reports: Report[]
  isLoading: boolean
  error: string | null
  fetchAllReports: () => Promise<void>
  fetchReportsByPost: (postId: string) => Promise<Report[] | undefined>
  fetchReportsByReply: (replyId: string) => Promise<Report[] | undefined>
  fetchReportById: (reportId: string) => Promise<Report | undefined>
  addReport: (payload: ReportPayload) => Promise<void>
  updateReportById: (reportId: string, payload: Partial<ReportPayload>) => Promise<void>
  removeReport: (reportId: string) => Promise<void>
}

const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  isLoading: false,
  error: null,

  fetchAllReports: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getAllReports()
      set({ reports: res.reports ?? res, isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch reports", isLoading: false })
    }
  },

  fetchReportsByPost: async (postId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await getReportsByPostId(postId)
      set({ isLoading: false })
      return res.reports ?? res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch post reports", isLoading: false })
    }
  },

  fetchReportsByReply: async (replyId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await getReportsByReplyId(replyId)
      set({ isLoading: false })
      return res.reports ?? res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch reply reports", isLoading: false })
    }
  },

  fetchReportById: async (reportId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await getReportById(reportId)
      set({ isLoading: false })
      return res.report ?? res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch report", isLoading: false })
    }
  },

  addReport: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      await createReport(payload)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to create report", isLoading: false })
    }
  },

  updateReportById: async (reportId, payload) => {
    set({ isLoading: true, error: null })
    try {
      await updateReport(reportId, payload)
      set({ isLoading: false })
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to update report", isLoading: false })
    }
  },

  removeReport: async (reportId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await deleteReport(reportId)
      await get().fetchAllReports()
      set({ isLoading: false })
      return res
    }
    catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to delete report", isLoading: false })
    }
  },
}))

export default useReportStore
