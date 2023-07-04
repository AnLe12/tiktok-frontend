import UserItem from "./UserItem";

function UserList({items = [], onClick}) {
    const renderUserItem = () => {
        return items.map((item,index)=>{
            return(
                <UserItem
                    key = {index}
                    data = {item}
                />
            )
        })
    }
    return ( 
        <div>{renderUserItem()}</div>
     );
}



export default UserList;