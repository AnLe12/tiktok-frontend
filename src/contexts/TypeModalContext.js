// import { createContext, useState } from "react";

// const TypeModalContext = createContext();

// function TypeModalProvider({children}){
//     const [typeModal, setTypeModal] = useState('logIn');
//     const changeTypeModal = (value) => {
//         setTypeModal(value)
//     }
//     const value = {typeModal, changeTypeModal}

//     return(
//         <TypeModalContext.Provider value = {value}>
//             {children}
//         </TypeModalContext.Provider>
//     )
// }

// export {TypeModalContext, TypeModalProvider}