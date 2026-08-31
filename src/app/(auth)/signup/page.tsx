import AuthForm from "@/components/auth/AuthForm";
import AuthSidePanel from "@/components/auth/AuthSidePanel";

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-row-reverse">
      <AuthSidePanel mode="signup" />

      <section className="flex min-h-screen w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <AuthForm mode="signup" />
      </section>
    </div>
  );
}
