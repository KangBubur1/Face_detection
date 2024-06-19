import AdminHeader from "@/components/AdminHeader";
import AdminSideBar from "@/components/AdminSideBar";
import {NextUIProvider} from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider >
      <Toaster/>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-800/5">
      <div className=" flex-none w-48 xl:w-64">
        <AdminSideBar/>
      </div>
      <div className="flex flex-col w-full">
        <AdminHeader/>
          {children}
        
       
      </div>
     </div>
    </NextUIProvider>
    
  );
}