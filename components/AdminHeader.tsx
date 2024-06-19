import { IoIosNotificationsOutline } from "react-icons/io";
const AdminHeader = () => {
    return (
        <header className="pt-12 px-8 " >
              {/* Header */}
              <div className="flex justify-end">
                    
                    <div className="flex-shrink ms-4  xl:w-96 h-14 flex justify-center items-center">
                        <IoIosNotificationsOutline size={24}/>
                    </div>
                </div>
        </header>
                  
    )
}

export default AdminHeader;