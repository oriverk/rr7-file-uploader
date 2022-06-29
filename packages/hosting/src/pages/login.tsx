/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "../lib/firebase";
import { SignInWithEmailAndPasswordSchema } from "../lib/zod";
import { Container } from "../components/Container";
import { Input, PasswordInput, Button } from "../components/Form";

const validEmail = import.meta.env.VITE_VALID_EMAIL_ADRESS;

const Login: FC = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const methos = useForm<{ email: string; password: string }>({
    resolver: zodResolver(SignInWithEmailAndPasswordSchema),
  });
  const { handleSubmit, setError } = methos;

  const onSubmit = handleSubmit((data) => {
    const { email, password } = data;
    if (email !== validEmail) {
      setError("email", { type: "custom", message: "メールアドレスまたはパスワードが間違っています" });
      setError("password", { type: "custom", message: "メールアドレスまたはパスワードが間違っています" });
    } else {
      signInWithEmailAndPassword(email, password);
    }
  });

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user]);

  if (error || loading) {
    return (
      <Container>
        <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8">Login</h2>
        <div className="p-4 md:p-8 mx-auto max-w-lg border rounded-lg text-center">
          {error && <strong className="text-red-500">{`Error: ${error}`}</strong>}
          {loading && <p>Loading...</p>}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8">Login</h2>

      <FormProvider {...methos}>
        <form onSubmit={onSubmit} className="max-w-lg border rounded-lg mx-auto">
          <div className="flex flex-col gap-4 p-4 md:p-8">
            <Input id="email" label="Eメール" placeholder="example@example.com" validation={{ required: "required" }} />
            <PasswordInput id="password" label="パスワード" validation={{ required: "required" }} />
            <Button type="submit">ログイン</Button>
          </div>
          <div className="flex justify-center items-center bg-gray-100 p-4">
            <p className="text-gray-500 text-sm text-center">
              Don&apos;t have an account?
              <Link
                to="/signup"
                className="text-indigo-500 hover:text-indigo-600 active:text-indigo-700 transition duration-100"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
};

export default Login;