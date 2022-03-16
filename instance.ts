import axios from 'axios';

const { URL = 'https://api.supermetrics.com/assignment' } = process.env;

const instance = axios.create({
    baseURL: URL
})

export default instance;