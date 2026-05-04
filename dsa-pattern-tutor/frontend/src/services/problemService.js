import api from "./api";

export const problemService = {
  getRandomProblem: async (difficulty) => {
    const params = difficulty ? { difficulty } : {};
    const response = await api.get("/problems/random", {
      params,
      loadingMessage: "Loading problem...",
    });
    return response.data;
  },

  getAdaptiveProblem: async () => {
    const response = await api.get("/problems/adaptive", {
      loadingMessage: "Loading adaptive problem...",
    });
    return response.data;
  },

  getSessionProblems: async () => {
    const response = await api.get("/problems/session", {
      loadingMessage: "Preparing session questions...",
    });
    return response.data;
  },

  getAllProblems: async (filters = {}) => {
    const response = await api.get("/problems", {
      params: filters,
      loadingMessage: "Loading problems...",
    });
    return response.data;
  },

  getProblemById: async (id) => {
    const response = await api.get(`/problems/${id}`, {
      loadingMessage: "Loading problem details...",
    });
    return response.data;
  },

  createProblem: async (problemData) => {
    const response = await api.post("/problems", problemData, {
      loadingMessage: "Creating problem...",
      showLoadingToast: true,
      successMessage: "Problem created successfully",
    });
    return response.data;
  },

  updateProblem: async (id, problemData) => {
    const response = await api.put(`/problems/${id}`, problemData, {
      loadingMessage: "Updating problem...",
      showLoadingToast: true,
      successMessage: "Problem updated successfully",
    });
    return response.data;
  },

  deleteProblem: async (id) => {
    const response = await api.delete(`/problems/${id}`, {
      loadingMessage: "Deleting problem...",
      showLoadingToast: true,
      successMessage: "Problem deleted successfully",
    });
    return response.data;
  },
};
