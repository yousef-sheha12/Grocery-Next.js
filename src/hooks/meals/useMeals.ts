import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// all smart list
async function getAllMeals() {
  const res = await fetch("/api/meals");

  if (!res.ok) throw new Error("Failed to get meals");
  const meals = await res.json();
  return meals;
}

// get meal by id
async function getMealById(id: string) {
  const res = await fetch(`/api/meals/${id}`);

  if (!res.ok) throw new Error("Failed to get meal");
  const meal = await res.json();
  return meal;
}

////////////////////////
// meals api hooks/////
///////////////////////

// all smart list hook
export function useMeals() {
  return useQuery({
    queryKey: ["meals"],
    queryFn: getAllMeals,
  });
}

// get meal by id hook
export function useMealById(id: string | number) {
  return useQuery({
    queryKey: ["meal", id],
    queryFn: () => getMealById(String(id)),
  });
}
