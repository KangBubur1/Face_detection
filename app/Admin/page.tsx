import Login from "@/components/AdminLogin";
import { Meteors } from "@/components/ui/meteors";

export default function AdminHome() {
  return (
    <section className="relative flex justify-center items-center h-screen bg-black overflow-hidden">
      
      {/* Meteors as background */}
      <div className="absolute inset-0 z-0">
        <Meteors number={100} />
      </div>
      {/* Content */}
      <div className="relative z-10  shadow-md">
        <Login />
      </div>
    </section>
  );
}
