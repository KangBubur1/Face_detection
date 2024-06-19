import { CiHome, CiUser } from "react-icons/ci"; // Import ikon yang diperlukan
import { RiAdminLine } from "react-icons/ri";

export const links = [
    {
        name: "Home",
        hash: "/Admin/Dashboard/",
        icon: <CiHome />
    },
    {
        name: "Employee",
        hash: "/Admin/Dashboard/member",
        icon: <CiUser />
    },
    {
        name: "Admin",
        hash: "/Admin/Dashboard/SignUp",
        icon: <RiAdminLine />
    }
] as const;
