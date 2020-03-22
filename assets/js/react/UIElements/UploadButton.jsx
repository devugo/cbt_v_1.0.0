import React from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

const UploadButton = props => {
    return (
        <div className="upload-button" onClick={props.handleChange}>
            {
                props.imgUrl ? <img src={props.imgUrl} style={{width: '100%', height: '100%'}} /> 
                : <>      
                    {/* <PlusOutlined type={props.loading ? 'loading' : 'plus'} /> */}
                    {
                        props.loading ? <LoadingOutlined style={{color: 'blue'}} /> : <PlusOutlined />
                    }
                    <div className="ant-upload-text">{props.title}</div>
                </>
            }
            
      
        </div>
    );
}
export default UploadButton;