import api from "./api";

export const problemService = {
  getRandomProblem: async (difficulty) => {
    const params = difficulty ? { difficulty } : {};
    const response = await api.get("/problems/random", { params });
    return response.data;
  },

  getAdaptiveProblem: async () => {
    const response = await api.get("/problems/adaptive");
    return response.data;
  },

  getSessionProblems: async () => {
    const response = await api.get("/problems/session");
    return response.data;
  },

  getAllProblems: async (filters = {}) => {
    const response = await api.get("/problems", { params: filters });
    return response.data;
  },

  getProblemById: async (id) => {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  },

  createProblem: async (problemData) => {
    const response = await api.post("/problems", problemData);
    return response.data;
  },

  updateProblem: async (id, problemData) => {
    const response = await api.put(`/problems/${id}`, problemData);
    return response.data;
  },

  deleteProblem: async (id) => {
    const response = await api.delete(`/problems/${id}`);
    return response.data;
  },
};
