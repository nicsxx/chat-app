const users = []

    // addUser, removeUser, getUsersRoom


const addUser = ({ id, username, all }) => {
    // Clean the data 
    username = username.trim().toLowerCase()
    //validate the data
    if (!username) {
        return {
            error: 'kelangan mo ng username kaibigan wag kang anga!'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.username === username
    })

    //validate username
    if (existingUser) {
        return{
            error: 'nagamit na yang pangalan wag kang anga anga!'
        }
    }

    // store user
    const user = { id, username}
    users.push(user)
    return {user}

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}


module.exports = {
    addUser,
    removeUser,
    getUser
}
