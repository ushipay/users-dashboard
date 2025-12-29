import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { EditUserDialog } from "./EditUserDialog";
import { fetchUsers } from "../api/users";

type User = {
    id: number,
    username: string,
    email: string,
    is_active: boolean
}


export const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            setLoading(true)
            const users = await fetchUsers()
            setUsers(users)
        } catch {
            console.log("ユーザの取得に失敗しました")
        } finally {
            setLoading(false)
        }
    }, []);

    const handleLogout = () => {
        logout()
        navigate("/login")
    }
    
    const handleEditClick = () => {
        
    };

    const handleDeleteClick = (id: number) => {
        const deleteUser = async (id: number) => {
            try {
                setLoading(true)
                await apiClient.delete(`/api/v1/users/${id}`)
            } catch(err) {
                console.log("ユーザ削除の失敗", err)
            } finally {
                setLoading(false)
            }
        }
        deleteUser(id)  
    }
    
    const handleSave = (updated: User) => {
    // TODO: API PUT /users/{id}
    console.log("更新:", updated);
    setSelectedUser(updated);
    };    

    if (loading) {
        return <p className="text-center mt-10">Loading</p>
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              ユーザ一覧
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              登録されているユーザの一覧です
            </p>
          </div>
          <button
          onClick={handleLogout}
          className="mt-4 sm:mt-0 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          ログアウト
        </button>
        </div>
  
        <div className="mt-12 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      ユーザ
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ステータス
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
  
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      {/* ユーザ情報 */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.username.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-gray-500 text-xs">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
  
                      {/* ステータス */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {user.is_active ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            有効
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                            無効
                          </span>
                        )}
                      </td>
  
                      {/* Email */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
  
                      {/* 操作 */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                    onClick={() => handleEditClick(user)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                          編集
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                    onClick={() => handleDeleteClick(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        {/* dialog */}
        <EditUserDialog
            user={selectedUser}
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSave={handleSave}
        />
          </div>
        </div>
      </div>
    );
  };