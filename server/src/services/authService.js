import User from "../models/User.js"

export default {
    register(authData) {
        return User.create(authData)
    }
}