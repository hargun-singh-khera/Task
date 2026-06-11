import axios from "axios";

const API = "/api/upload";

export const uploadImage = (formData) =>
    axios.post(API, formData);

export const deleteImage = (url) =>
    axios.delete(API, { data: { url } });