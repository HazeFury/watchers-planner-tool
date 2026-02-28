import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const {
    execute: loginUser,
    isLoading: loadingUser,
    error: errorUser,
  } = useFetch("POST", "/auth/login-user");
  const {
    execute: loginAdmin,
    isLoading: loadingAdmin,
    error: errorAdmin,
  } = useFetch("POST", "/auth/login");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser({ body: { email } });

    if (res.success) {
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      login({
        userId: res.data.user.id,
        email: res.data.user.email,
        role: "user",
      });
      navigate("/");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginAdmin({ body: { email, password } });

    if (res.success) {
      login({
        userId: res.data.admin.id,
        email: res.data.admin.email,
        role: "admin",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user">Surveillant</TabsTrigger>
            <TabsTrigger value="admin">Administration</TabsTrigger>
          </TabsList>

          {/* ONGLET SURVEILLANT */}
          <TabsContent value="user">
            <form onSubmit={handleUserLogin} className="space-y-8">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none"
                >
                  Se souvenir de moi
                </label>
              </div>
              {errorUser && <p className="text-red-500 text-sm">{errorUser}</p>}
              <Button type="submit" className="w-full" disabled={loadingUser}>
                {loadingUser ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          {/* ONGLET ADMIN */}
          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin} className="space-y-8">
              <div>
                <Input
                  type="email"
                  placeholder="Email Admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errorAdmin && (
                <p className="text-red-500 text-sm">{errorAdmin}</p>
              )}
              <Button type="submit" className="w-full" disabled={loadingAdmin}>
                {loadingAdmin ? "Connexion..." : "Se connecter (Admin)"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
