import api from "./api";

export const attemptService = {
  createAttempt: async (attemptData) => {
    const response = await api.post("/attempts", attemptData, {
      loadingMessage: "Submitting answer...",
      showLoadingToast: true,
    });
    return response.data;
  },

  submitSessionAttempt: async (attempts) => {
    const response = await api.post("/attempts/session", { attempts }, {
      loadingMessage: "Submitting session...",
      showLoadingToast: true,
      successMessage: "Session submitted successfully",
    });
    return response.data;
  },

  getSessionHistory: async (params = {}) => {
    const response = await api.get("/attempts/session/history", { params });
    return response.data;
  },

  getAttemptHistory: async (params = {}) => {
    const response = await api.get("/attempts", {
      params,
      loadingMessage: "Loading attempt history...",
    });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get("/attempts/stats", {
      loadingMessage: "Loading your stats...",
    });
    return response.data;
  },
};
