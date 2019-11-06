import axios from 'axios'
export default function login(data){
    return dispatch =>{
        return axios.post('/api/auth',data);
    }
}