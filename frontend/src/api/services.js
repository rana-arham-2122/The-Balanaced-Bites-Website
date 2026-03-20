import api from "./axiosInstance";

export const authAPI = {
  register: async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  },
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken",  data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  },
  logout: async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.clear();
  },
  getProfile:    async ()      => { const { data } = await api.get("/auth/profile");       return data; },
  updateProfile: async (body)  => { const { data } = await api.put("/auth/profile", body); return data; },
};

export const recipeAPI = {
  getAll:           async (params = {}) => { const { data } = await api.get("/recipes", { params });         return data; },
  getById:          async (id)          => { const { data } = await api.get(`/recipes/${id}`);               return data; },
  create:           async (body)        => { const { data } = await api.post("/recipes", body);               return data; },
  update:           async (id, body)    => { const { data } = await api.put(`/recipes/${id}`, body);          return data; },
  delete:           async (id)          => { await api.delete(`/recipes/${id}`); },
  searchSpoonacular:async (q, diet)     => { const { data } = await api.get("/recipes/spoonacular/search", { params: { query: q, diet, number: 12 } }); return data; },
};

export const mealPlanAPI = {
  save:             async (weekStart, slots)            => { const { data } = await api.post("/mealplan", { weekStart, slots });                         return data; },
  getByUser:        async (userId)                      => { const { data } = await api.get(`/mealplan/${userId}`);                                      return data; },
  delete:           async (id)                          => { await api.delete(`/mealplan/${id}`); },
  updateGroceryItem:async (planId, itemIndex, checked)  => { const { data } = await api.patch(`/mealplan/${planId}/grocery`, { itemIndex, checked });    return data; },
};

export const adminAPI = {
  getDashboard:  async ()         => { const { data } = await api.get("/admin/dashboard");                        return data; },
  getAllUsers:    async ()         => { const { data } = await api.get("/admin/users");                            return data; },
  deleteUser:    async (id)       => { await api.delete(`/admin/users/${id}`); },
  updateRole:    async (id, role) => { const { data } = await api.patch(`/admin/users/${id}/role`, { role });     return data; },
};
