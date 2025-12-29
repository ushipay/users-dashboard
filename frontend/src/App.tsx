import { BrowserRouter,Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPages";
import { UsersPage } from "./pages/UsersPages"; 
import { AuthProvider } from "./auth/AuthContext";
import {RequireAuth} from "./auth/RequireAuth";

export const App = () => (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/users" element={
                    <RequireAuth>
                        <UsersPage/>
                    </RequireAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);