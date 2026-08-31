import AuthForm from "@/components/auth/AuthForm";
import AuthSidePanel from "@/components/auth/AuthSidePanel";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl">
      <AuthSidePanel mode="login" />

      <section className="flex min-h-screen w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <AuthForm mode="login" />
      </section>
    </div>
  );
}
