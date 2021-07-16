import React, { useCallback, useState } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux'
import { gapi } from 'gapi-script';
import DriveUploady from 'drive-uploady';
import UploadButton from '@rpldy/upload-button';

import { Col, Drawer, Row, Button, Input, Table, Tooltip, Popconfirm } from 'antd';
// import SelectSource from '../SelectSource/index'
const { Search } = Input;

const ListDocuments = ({ visible, onClose, documents = [], onSearch, signedInUser, onSignOut, isLoading }) => {
  const dispatch = useDispatch()

  const Upload = () => {
    return (
      <div>
        <DriveUploady clientId={'862107616118-e1s51qrqhvvqmuisbgceipiisffljv61.apps.googleusercontent.com'} scope="https://www.googleapis.com/auth/drive.file">
          <UploadButton>Upload to Drive</UploadButton>
        </DriveUploady>
      </div>
    );
  };

  const save = async (key) => {
    const date = new Date(key.modifiedTime)
    console.log(key,'--------key')
    dispatch({
      type: "SelectFile_START",
      payload: { name: key.name, date: date.toLocaleString().split(',')[0] }
    })
    onClose();
  };

  const handleDelete = (key) => {
    documents.filter((item) => 
      {
        if(item.id === key.id)
        {
          var request = gapi.client.drive.files.delete({
            'fileId': item.id
          });
          console.log(item.id, '----ItemID')
          request.execute(function(resp) { });
        }
      }
    )
  };
  const handleSave = (key) => {
    documents.filter((item) => 
      {
        if(item.id === key.id)
        {
          gapi.client.drive.files.get({
            fileId: item.id,
            alt: "media"
          }).then(function(res) {
          
            // In this case, res.body is the binary data of the downloaded file.
          
          });
        }
      }
    )
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      render: (text) => <span>{moment(text).format('Do MMM YYYY HH:mm A')}</span>,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => (
        <span>
          <Tooltip title="View">
            <Button
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Select
            </Button>
            <Button title="Sure to delete?" href="https://drive.google.com/drive/u/0/my-drive" onClick={() => handleSave(record)} >
              Save
            </Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
              <a>Delete</a>
            </Popconfirm>
          </Tooltip>
        </span>
      ),
    },
  ];

  const search = (value) => {
    delayedQuery(`name contains '${value}'`);
  };

  const delayedQuery = useCallback(
    debounce((q) => onSearch(q), 500),
    []
  );

  return (
    <Drawer
      title="Select Google Drive Document"
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      width={900}
    >
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ marginBottom: 20 }}>
            {/* <p>Signed In as: {`${signedInUser?.Ad} (${signedInUser?.zu})`}</p> */}
            <Button type="primary" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>
          <div className="table-card-actions-container">
            <div className="table-search-container">
              <Search
                placeholder="Search Google Drive"
                onChange={(e) => search(e.target.value)}
                onSearch={(value) => search(value)}
                className="table-search-input"
                size="large"
                enterButton
              />
            </div>
          </div>
          <Table
            className="table-striped-rows"
            columns={columns}
            dataSource={documents}
            pagination={{ simple: true }}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ListDocuments;
