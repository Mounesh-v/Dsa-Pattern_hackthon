import api from "./api";

export const codeService = {
  submitCode: async ({ problemId, language, code, externalProblem }) => {
    const response = await api.post("/code/submit", {
      problemId,
      language,
      code,
      externalProblem,
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
