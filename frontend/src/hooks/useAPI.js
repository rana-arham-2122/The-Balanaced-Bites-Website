import { useState, useEffect, useCallback } from "react";
import { recipeAPI, mealPlanAPI } from "../api/services";
import { useAuth } from "../context/AuthContext";

export function useRecipes(params = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [total,   setTotal]   = useState(0);

  const fetch = useCallback(async (overrides = {}) => {
    setLoading(true); setError(null);
    try {
      const data = await recipeAPI.getAll({ ...params, ...overrides });
      setRecipes(data.recipes || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load recipes.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { recipes, loading, error, total, refetch: fetch };
}

export function useMealPlan() {
  const { user } = useAuth();
  const [plan,    setPlan]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!user?.id && !user?._id) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await mealPlanAPI.getByUser(user.id || user._id);
        setPlan(data.plan);
      } catch (err) {
        if (err.response?.status !== 404) setError("Failed to load meal plan.");
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  const savePlan = async (weekStart, slots) => {
    setSaving(true);
    try {
      const data = await mealPlanAPI.save(weekStart, slots);
      setPlan(data.plan);
      return data.plan;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally { setSaving(false); }
  };

  const toggleGrocery = async (itemIndex, checked) => {
    if (!plan?._id) return;
    try {
      const data = await mealPlanAPI.updateGroceryItem(plan._id, itemIndex, checked);
      setPlan(p => ({ ...p, groceryList: data.groceryList }));
    } catch {}
  };

  return { plan, loading, saving, error, savePlan, toggleGrocery };
}
