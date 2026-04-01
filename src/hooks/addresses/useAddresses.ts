import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Address } from "@/lib/types";

// all addresses
async function getAllAddresses() {
  const res = await fetch("/api/addresses");

  if (!res.ok) throw new Error("Failed to get addresses");
  const addresses = await res.json();
  return addresses;
}

// get address by id
async function getAddressById(id: string) {
  const res = await fetch(`/api/addresses/${id}`);

  if (!res.ok) throw new Error("Failed to get address");
  const address = await res.json();
  return address;
}

// add address
async function addAddress(address: Partial<Address>) {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(address),
  });

  if (!res.ok) throw new Error("Failed to add address");
  const newAddress = await res.json();
  return newAddress;
}

// update address
async function updateAddress(id: string, address: Partial<Address>) {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(address),
  });

  if (!res.ok) throw new Error("Failed to update address");
  const updatedAddress = await res.json();
  return updatedAddress;
}

// delete address
async function deleteAddress(id: string) {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete address");
  const deletedAddress = await res.json();
  return deletedAddress;
}

// set address as default
async function setAddressAsDefault(id: string) {
  const res = await fetch(`/api/addresses/${id}/set-default`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to set address as default");
  const updatedAddress = await res.json();
  return updatedAddress;
}

////////////////////////////////
// addresses hooks ////////////
////////////////////////////////

// all addresses hook
export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAllAddresses,
  });
}

// get address by id
export function useAddressById(id: string) {
  return useQuery({
    queryKey: ["address", id],
    queryFn: () => getAddressById(id),
  });
}

// add address hook
export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

// update address hook
export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

// delete address hook
export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

// set address as default hook
export function useSetAddressAsDefault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setAddressAsDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
