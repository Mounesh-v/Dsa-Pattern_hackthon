import api from "./api";

export const codeService = {
  submitCode: async ({ problemId, language, code }) => {
    const response = await api.post("/code/submit", {
      problemId,
      language,
      code,
    });
    return response.data;
  },

  getTutorScore: async () => {
    const response = await api.get("/code/tutor-score");
    return response.data;
  },

  getCodeHistory: async (params = {}) => {
    const response = await api.get("/code/history", { params });
    return response.data;
  },
};
