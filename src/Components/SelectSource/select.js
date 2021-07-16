import React, { useState } from "react";
import DriveUploady from 'drive-uploady';
import UploadButton from '@rpldy/upload-button';

export default function App() {
  const [image, setImage] = useState({ preview: "", raw: "", date: "", name: "" });
  const CLIENT_ID = '862107616118-e1s51qrqhvvqmuisbgceipiisffljv61.apps.googleusercontent.com';

  const Upload = () => {
    return (
      <div>
        <DriveUploady clientId={CLIENT_ID} scope="https://www.googleapis.com/auth/drive.file">
          <UploadButton>Upload to Drive</UploadButton>
        </DriveUploady>
      </div>
    );
  };

  const handleChange = e => {
    const date = new Date(e.target.files[0]['lastModifiedDate'])
    console.log(date.toLocaleString(), '---handleChange')
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        date: date.toLocaleString().split(',')[0],
        name: e.target.files[0]['name'],
      });
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image.raw);

    await fetch("YOUR_URL", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: formData
    });
  };

  console.log(image.date, image.name, '--here')
  return (
    <div className="card">
      <label htmlFor="upload-button">
        {image.raw ? (
          // <img src={image.preview} alt="dummy" width="300" height="300" />
          <div style={{display: 'block', cursor: 'pointer'}}>
            <div>
              <p style={{fontWeight: '600', fontSize: '18px'}}>
                File Name: {image.name}
              </p>
            </div>
            <div>
              <p style={{fontWeight: '600', fontSize: '18px'}}>
                Modified Date: {image.date}
              </p>
            </div>
            <Upload />
          </div>
        ) : (
          <>
            <span className="fa-stack fa-2x mt-3 mb-2">
              <i className="fas fa-circle fa-stack-2x" />
              <i className="fas fa-store fa-stack-1x fa-inverse" />
            </span>
            <p style={{fontSize: '18px', fontWeight: '600', cursor: 'pointer'}}>Upload File</p>
          </>
        )}
      </label>
      <input
        type="file"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <br />
    </div>
  );
}
