import axios from 'axios';

export const successGetUser = (user) => ({
    type: 'ADD_USER_DETAILS',
    payload: user
});

export const errDisplay = (message) => ({
    type: 'ERR_USER',
    payload: message
});


export const updateUserRecord = (user, id) => ({
    type: 'UPDATE_USER_DATA',
    payload: {updatedValue: user, updatedId: id}
});

export const errUpdateuser = (message) => ({
    type: 'ERR_UPDATE_USER',
    payload: message
});


export function getUserDetails(token){
   return dispatch => {
        return axios.get("http://adhithyaprabhu.front.challenge.dev.monospacelabs.com/users")
            .then(response => {
                if(response){
                    dispatch(successGetUser(response.data));
                }
            })
            .catch(error => {
                if(error.response)
			    dispatch(errDisplay(error.response.message));
			});
    };
}


export function updateUserData(index, userData, id){
    let updateUrl = "http://adhithyaprabhu.front.challenge.dev.monospacelabs.com/users/" + index;
       return dispatch => {
        return axios.put(updateUrl, userData)
            .then(response => {
                if(response){
                   dispatch(updateUserRecord(response.data, id))
                }
            })
            .catch(error => {
                if(error.response)
                dispatch(errUpdateuser(error.response.message));
            });
    };
}