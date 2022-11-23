import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "@/lib/firebase";
import { SignInWithEmailAndPasswordSchema } from "@/lib/zod";
import { Container } from "@/components/Container";
import { Input, PasswordInput, Button } from "@/components/Form";
import { Seo } from "@/components/Seo";

const validEmail = import.meta.env.VITE_VALID_EMAIL_ADRESS;

const Signup: FC = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
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
      createUserWithEmailAndPassword(email, password);
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
        <Seo noindex />
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Signup</h2>
        <div className="mx-auto max-w-lg rounded-lg border p-4 text-center md:p-8">
          {error && <strong className="text-red-500">{`Error: ${error}`}</strong>}
          {loading && <p>Loading...</p>}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Seo noindex />
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">Signup</h2>
      <FormProvider {...methos}>
        <form onSubmit={onSubmit} className="mx-auto max-w-lg rounded-lg border">
          <div className="flex flex-col gap-4 p-4 md:p-8">
            <Input id="email" label="Eメール" placeholder="example@example.com" validation={{ required: "required" }} />
            <PasswordInput id="password" label="パスワード" validation={{ required: "required" }} />
            <Button type="submit">サインアップ</Button>
          </div>
          <div className="flex items-center justify-center bg-gray-100 p-4">
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?
              <Link
                to="/login"
                className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              >
                login
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
};

export default Signup;
