import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = {videoId}

    const [videoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success){
                setVideoDetail(response.data.videoDetail)
            }else{
                alert('비디오 정보를 가져오길 실패했습니다.')
            }
        })
    }, [])

    if(videoDetail.writer){
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{width: '100%', padding: '3rem 4rem' }}>
                        <video 
                            style={{width: '100%'}} 
                            src={`http://localhost:5000/${videoDetail.filePath}`}
                            controls 
                        />
                        <List.Item actions >
                            <List.Item.Meta
                                avatar={<Avatar src={videoDetail.writer.image} />}
                                title={videoDetail.writer.name}
                                description={videoDetail.description}
                                />
                        </List.Item>
                        {/* comments */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    Side Videos
                </Col>
            </Row>
        )
    }else{
        return(
            <div>...loading</div>
        )
    }
    
}

export default VideoDetailPage
