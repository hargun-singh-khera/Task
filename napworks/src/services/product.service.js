import axios from "axios";

const API = "/api/products";

export async function getProducts(params = {}) {
    const response = await axios.get(API, {
        params,
    });

    return response.data;
}

export const createProduct = (data) =>
    axios.post(API, data);

export const deleteProduct = (id) =>
    axios.delete(`${API}/${id}`);