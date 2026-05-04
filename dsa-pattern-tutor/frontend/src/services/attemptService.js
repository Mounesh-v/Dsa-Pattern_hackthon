import api from "./api";

export const attemptService = {
  createAttempt: async (attemptData) => {
    const response = await api.post("/attempts", attemptData);
    return response.data;
  },

  submitSessionAttempt: async (attempts) => {
    const response = await api.post("/attempts/session", { attempts });
    return response.data;
  },

  getSessionHistory: async (params = {}) => {
    const response = await api.get("/attempts/session/history", { params });
    return response.data;
  },

  getAttemptHistory: async (params = {}) => {
    const response = await api.get("/attempts", { params });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get("/attempts/stats");
    return response.data;
  },
};
