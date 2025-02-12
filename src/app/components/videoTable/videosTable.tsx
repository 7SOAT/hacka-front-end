import { Table, Button, Space } from 'antd';
import { downloadZip } from '../FileUpload/logic';

const columns = (token) => [
    {
        title: 'Arquivo',
        dataIndex: 'fileName',
        key: 'fileName',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Ação',
        key: 'action',
        render: (_, record) => (
            <Button
                disabled={record.status !== 'completed'}
                onClick={() => downloadZip({ videoId: record.id, token })}
            >
                Download
            </Button>
        ),
    },
];

const VideoTable = ({ videos, token, handleRefresh }) => {
    const data = videos.map(video => ({
        key: video.id,
        fileName: video.s3Key.split('/')[2].replace('.mp4', '.zip'),
        status: video.status.normalize(),
        id: video.id,
    }));

    return (<div style={{ marginTop: '80px' }} >
        <Space style={{ marginBottom: 16 }}>
            <Button onClick={handleRefresh}>🔄 Atualizar</Button>
        </Space>
        <Table columns={columns(token)} dataSource={data} pagination={false} />
    </div >);
};

export default VideoTable;