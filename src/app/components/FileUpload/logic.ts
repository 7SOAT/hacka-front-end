import axios, { AxiosRequestConfig } from "axios";

export async function getAccessToken(code: string) {
    try {
        const request = await axios.post(`${process.env.NEXT_PUBLIC_BFF_URL}/auth`, { code }, {});
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
            return await uploadVideo({ file, preSignedUrl, videoId, token });
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
            return await saveVideo({ videoId, filename: file.name, token });
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

export async function downloadZip({ videoId, token }) {
    const config: AxiosRequestConfig = {
        headers: { 'authorization': `Bearer ${token}` },
        params: { videoId }
    };

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BFF_URL}/videos/get-signed-url`, config);

        if (response.status === 200) {
            window.open(response.data, "_blank", "noopener,noreferrer");
        } else {
            throw new Error('Failed to Download');
        }
    } catch (error) {
        throw new Error('Failed to Download');
    }
}

export async function getFilesList(token) {
    const config: AxiosRequestConfig = {
        headers: { 'authorization': `Bearer ${token}` }
    };

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BFF_URL}/videos`, config);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch videos');
        }
    } catch (error) {
        throw new Error('Failed to fetch videos');
    }
}