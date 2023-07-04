import axios from "axios";


const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
})

// Cấu hình để khi axios fetch data về thì sử dụng get này chỉ cần .data là nhận được dữ liệu
export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path,options);
    return response.data
}

export const post = async (path , data, options = {}) => {
    const response = await httpRequest.post(path, data, options);
    return response.data
}

export const patch = async (path, options = {}) => {
    const response = await httpRequest.patch(path, options);
    return response
}
export default httpRequest