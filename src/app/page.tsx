import LoginForm from "~/modules/auth/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url('/landing-page-image.jpg')] bg-cover bg-center bg-no-repeat bg-[rgba(0,0,0,0.7)] bg-blend-multiply">
      <LoginForm />
    </div>
  )
}
