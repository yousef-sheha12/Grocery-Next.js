import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SmartList } from "@/lib/types";

// all smart list
async function getAllSmartLists() {
  const res = await fetch("/api/smart-lists");

  if (!res.ok) throw new Error("Failed to get smart lists");
  const smartLists = await res.json();
  return smartLists;
}

// get smart list by id
async function getSmartListById(id: string) {
  const res = await fetch(`/api/smart-lists/${id}`);

  if (!res.ok) throw new Error("Failed to get smart list");
  const smartList = await res.json();
  return smartList;
}

// add smart list
async function addSmartList(smartList: Partial<SmartList>) {
  const res = await fetch("/api/smart-lists", {
    method: "POST",
    body: JSON.stringify(smartList),
  });

  if (!res.ok) throw new Error("Failed to add smart list");
  const newSmartList = await res.json();
  return newSmartList;
}

async function updateSmartList(id: string, smartList: Partial<SmartList>) {
  const res = await fetch(`/api/smart-lists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(smartList),
  });

  if (!res.ok) throw new Error("Failed to update smart list");
  const updatedSmartList = await res.json();
  return updatedSmartList;
}

// delete smart list
async function deleteSmartList(id: string) {
  const res = await fetch(`/api/smart-lists/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete smart list");
  const deletedSmartList = await res.json();
  return deletedSmartList;
}

////////////////////////////////
// smart list hooks ////////////
////////////////////////////////

// all smart list hook
export function useSmartLists() {
  return useQuery({
    queryKey: ["smart-lists"],
    queryFn: getAllSmartLists,
  });
}

// get smart list by id
export function useSmartListById(id: string) {
  return useQuery({
    queryKey: ["smart-list", id],
    queryFn: () => getSmartListById(id),
  });
}

// add smart list hook
export function useAddSmartList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSmartList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-lists"] });
    },
  });
}

// update smart list hook
export function useUpdateSmartList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SmartList> }) =>
      updateSmartList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-lists"] });
    },
  });
}

// delete smart list hook
export function useDeleteSmartList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSmartList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-lists"] });
    },
  });
}
