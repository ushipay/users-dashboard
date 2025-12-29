// src/components/UserEditModal.tsx
import { useState } from "react";
import { updateUser } from "@/api/users";

type User = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
};

type Props = {
  user: User;
  onClose: () => void;
  onUpdated: (user: User) => void;
};

export default function EditUserDialog({ user, onClose, onUpdated }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isActive, setIsActive] = useState(user.is_active);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateUser(user.id, {
        name,
        email,
        is_active: isActive,
      });

      // 親コンポーネントに更新を通知
      onUpdated({
        ...user,
        name,
        email,
        is_active: isActive,
      });

      onClose();
    } catch (err) {
      alert("更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 p-6">
        <h2 className="text-lg font-bold mb-4">ユーザ編集</h2>

        <div className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前"
          />

          <input
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            有効
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
}
