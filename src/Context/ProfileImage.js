import { createContext, useState } from "react";

export let ProfileImgContext = createContext();

export default function ProfileImageProvider({children}) {

    let [profileImage , setProfileImage] = useState(null);
  

  return (
    <ProfileImgContext.Provider value={{profileImage , setProfileImage}}>
        {children}
    </ProfileImgContext.Provider>
  )
}
