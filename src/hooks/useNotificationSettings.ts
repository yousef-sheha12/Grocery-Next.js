"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { NotificationSettings } from "@/lib/types";

// Fetch notification settings data from API
async function fetchNotificationSetting() {
  const res = await fetch("/api/notifications_settings");

  if (!res.ok) throw new Error("Failed fetch notification settings data");
  const data = await res.json();
  return data.data;
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: fetchNotificationSetting,
  });
}

async function UpdateNotificationSettings(data: Partial<NotificationSettings>) {
  const res = await fetch("/api/notifications_settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update notification settings data");
  const updatedData = await res.json();
  return updatedData;
}

export function useUpdateNotificationSettings() {
  return useMutation({
    mutationFn: UpdateNotificationSettings,
  });
}
