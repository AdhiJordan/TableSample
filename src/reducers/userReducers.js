import { combineReducers } from 'redux'

export const userReducers = (state = { user: [] }, action) => {
    switch (action.type) {
        case "ADD_USER_DETAILS":
        return {user: [...state.user.concat(action.payload)]};
        break;

        case "UPDATE_USER_DATA":
        let updateUserData = [...state.user];
        const indexToDelete = updateUserData.findIndex(function(user, id){
            return id === action.payload.updatedId;
        })
        return {
            user: [...state.user.slice(0, indexToDelete), action.payload.updatedValue, 
            ...state.user.slice(indexToDelete + 1)]
        }
        break;

        default:
            return state;
    }
}

export default combineReducers({
    userReducers
});
