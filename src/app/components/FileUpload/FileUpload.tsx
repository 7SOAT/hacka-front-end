'use client';

import React, { useEffect, useState } from "react";
import { Upload, Button, Modal, Flex } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { downloadZip, getFilesList, getPreSignedUrl } from "./logic";
import VideoTable from "../videoTable/videosTable";

export function FileUpload({ token }: { token: string }) {
    const [fileList, setFileList] = useState<{ id: string; s3Key: string, status: string }[]>([]);
    const [confirmModal, setConfirmModal] = useState<{ visible: boolean, file?: any }>({ visible: false, file: null });
    const [statusModal, setStatusModal] = useState<{ visible: boolean; success?: boolean, file?: any }>({ visible: false, file: null });

    const handleUpload = (file) => {
        setConfirmModal({ visible: true, file });
    };

    const getVideosList = () => {
        getFilesList(token)
            .then((data) => {
                const result = (!data || data === '') ? [] : data;
                setFileList(result)
            }).catch(() => console.log('deu erro'))
    }

    useEffect(() => {
        getVideosList();
    }, [])

    const confirmUpload = () => {
        setConfirmModal({ visible: false, file: null });
        const file: any = confirmModal.file;

        getPreSignedUrl(file, token)
            .then(() => {
                getVideosList()
                setStatusModal({ visible: true, success: true, file });
            })
            .catch(() => setStatusModal({ visible: true, success: false, file }));
    };

    return (
        <div>
            <Upload.Dragger
                showUploadList={false}
                beforeUpload={(file) => {
                    handleUpload(file);
                    return false;
                }}
                accept=".mp4"
                height={360}
                style={{ width: '800px', border: 'dotted 1px #7B4DFF', backgroundColor: '#f4f4f673', }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: '#7B4DFF', fontSize: '100px' }} />
                </p>
                <h3>Drop your video here</h3>
                <p className="ant-upload-text">or</p>
                <Button type="primary" style={{ backgroundColor: '#7B4DFF', width: '150px', height: '40px' }}>
                    Browse Files
                </Button>
                <br />
                <br />
                <p className="ant-upload-hint">.mp4</p>
            </Upload.Dragger>

            {fileList && <VideoTable videos={fileList} token={token} handleRefresh={getVideosList} />}

            <Modal
                title="Confirm Upload"
                open={confirmModal.visible}
                onOk={confirmUpload}
                onCancel={() => setConfirmModal({ visible: false, file: null })}
            >
                <p>Are you sure you want to upload {confirmModal.file?.name}?</p>
            </Modal>

            <Modal
                title={statusModal.success ? "Upload Successful" : "Upload Failed"}
                open={statusModal.visible}
                onOk={() => setStatusModal({ visible: false, file: null })}
            >
                <p>{statusModal.success ? `${statusModal.file?.name} was uploaded successfully.` : `Failed to upload ${statusModal.file?.name}.`}</p>
            </Modal>
        </div>
    );
};

export default FileUpload;
