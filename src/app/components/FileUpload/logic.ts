import axios, { AxiosRequestConfig } from "axios";
import { useSearchParams } from "next/navigation";

export async function getAccessToken() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    try {
        const request = await axios.post(`${process.env.NEXT_PUBLIC_BFF_URL}/auth`, {
            params: { code }
        });

        return request.data.access_token;
    } catch (error) {
        throw new Error('Auth failed.');
    }
};


export async function getPreSignedUrl(file, token) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BFF_URL}/videos/url`, {
            params: { filename: file.name },
            headers: { 'authorization': `Bearer ${token}` },
        });

        if (response.status === 200) {
            const { data } = response;
            const { preSignedUrl, videoId } = data;
            await uploadVideo({ file, preSignedUrl, videoId, token });
        } else {
            throw new Error('PreSigned URL failed.');
        }
    } catch (error) {
        throw new Error('PreSigned URL failed.');
    }
};

export async function uploadVideo({ file, preSignedUrl, videoId, token }) {
    const config: AxiosRequestConfig = {
        headers: { 'Content-Type': 'video/mp4' },
    };

    try {
        const response = await axios.put(preSignedUrl, file, config);
        if (response.status === 200) {
            await saveVideo({ videoId, filename: file.name, token });
        } else {
            throw new Error('Upload failed.');
        }
    } catch (error) {
        throw new Error('Upload failed.');
    }
}

export async function saveVideo({ videoId, filename, token }) {
    const config: AxiosRequestConfig = {
        headers: { 'authorization': `Bearer ${token}` },
        params: {
            filename,
            videoId,
        }
    };

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BFF_URL}/videos/save`, null, config);

        if (response.status === 201) {
            return response.data;
        } else {
            throw new Error('Video saved failed.');
        }
    } catch (error) {
        throw new Error('Video saved failed.');
    }
}