import axios from 'axios'

export async function fetchApi(url: string) {
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios error fetching data: ", error.message)
        } else {
            console.log("Unexpected error: ", error)
        }
        return []
    }
}
