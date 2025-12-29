// src/api/users.ts
import { apiClient } from "./client";

export type UpdateUserPayload = {
    username?: string;
    email?: string;
    is_active?: boolean;
  };

export type User = {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
  };

export const fetchUsers = async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>("/users");
    return res.data;
  };
  
export const updateUser = async (
  userId: number,
  payload: UpdateUserPayload
): Promise<void> => {
  await apiClient.put(`/users/${userId}`, payload);
};