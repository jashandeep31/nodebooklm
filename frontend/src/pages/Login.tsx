import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { API_URL } from "@/lib/conts";
import axios from "axios";
import { toast } from "sonner";

export default function Login() {
  // Not best way to handle forms JUST FOR DEMO
  const [email, setEmail] = useState("j@j.com");
  const [password, setPassword] = useState("5");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Signing up...");
    try {
      const res = await axios.post(`${API_URL}/api/v1/user/login`, {
        email,
        password,
      });
      toast.success("User logged in successfully", {
        id: toastId,
      });
      navigate("/");
      localStorage.setItem("token", res.data.token);
      //   localStorage.setItem("user", JSON.stringify(res.data.user));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.response.data.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center ">
      <div className={cn("flex flex-col gap-6 min-w-[400px]")}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don't have an account?
                <Link to={"/signup"} className="underline underline-offset-4">
                  Signup
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
