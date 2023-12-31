import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import { UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from "uuid";

import { storage } from '../../../Firebase/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { message, Upload } from 'antd';

const Storage = getStorage(storage);


const { Option } = Select;

function EditModal({ visible, onCancel, onOk, editForm, selectedProduct, props }) {
  const queryClient = useQueryClient();
  console.log("editForm", selectedProduct)
  const [form] = Form.useForm();

  const updateMutation = useMutation(
    ["Products"],
    async ({ id, Product }) => {
      await ProductApi.updateProduct(id, Product);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: "Product has been updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Products"]);
        onCancel();

      },
    }
  );

  const [selectedFile, setSelectedFile] = useState([]);

  const [status, setStatus] = useState('Default');
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');



  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      console.log("NAME", selectedFile.name)
      setSelectedFile(info.file.originFileObj); // Store the selected file in state
    } else if (info.file.status === 'error') {
      // Handle error if file upload fails
    }
  };

  const handleSubmit = async (values) => {
    try {

      // const storageRef = ref(Storage, `${uuidv4()}_${selectedFile.name}`);

      try {
        // await uploadBytes(storageRef, selectedFile);
        // const fileUrl = await getDownloadURL(storageRef);
        // console.log("UPLOADED URL", fileUrl)

        // values['file'] = fileUrl; // Adding a new property

        // setErrors("")
        // console.log("UPLOADED DATA", values)
        // console.log("VALUES", values)

        updateMutation.mutate({
          id: selectedProduct.id,
          Product: values,
          // slug,
        })

      } catch (error) {
        console.error('Error uploading file:', error);
      }




      form.validateFields().then((values) => {

        form.resetFields();
      });


    } catch (error) {
      console.error('Form  failed:', error);
    }
  };

  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };




  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      title="Edit Product"
      visible={visible}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
      footer={[
        // <Button key="submit" htmlType="submit" type="primary" typeof="submit" className="submit-button">
        //   Submit
        // </Button>,
      ]}
    >
      <Form form={editForm} onFinish={handleSubmit}
        layout="vertical" initialValues={selectedProduct}>

        <Form.Item name="category" label="Product Category" rules={[{ required: true, message: 'Select Product Category' }]}>
          <Select
            placeholder="Select Category"
            dropdownStyle={{ backgroundColor: '#ffffff', padding: '3' }}
            onChange={setStatus}
            value={status}
          >
            <Option value="afo">AFO System</Option>
            <Option value="abduction">Abduction Bar</Option>
          </Select>        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Enter Price' }]}>
          <Input placeholder="Enter Price" />
        </Form.Item>

        <Form.Item name="color" label="Color Name" rules={[{ required: true, message: 'Enter Color Name' }]}>
          <Input placeholder="Enter Color  Name" />
        </Form.Item>
        <Form.Item name="size" label="Size" rules={[{ required: true, message: 'Enter Size' }]}>
          <Input placeholder="Enter Size " />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Enter Description' }]}>
          <Input placeholder="Enter Description " />
        </Form.Item>



        {/* <Form.Item
          style={{ width: "100%" }}
          name="file"
          rules={[
            {
              required: true,
              message: "Input File ",
            },
          ]}
        >
          <Upload maxCount={1}
            onChange={handleFileChange} // Attach the onChange event handler

            className="w-full uploadButton" style={{ width: "100%" }}>
            <Button className="w-full uploadButton" style={{ width: "100%" }} icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item> */}

        <Form.Item className=' flex justify-end items-center'>
          <Button
            className="submit-button" size="large"
            type="primary"
            htmlType="submit"
          >
            {updateMutation.isLoading
              ? "Submitting..."
              : "Submit"}
          </Button>
        </Form.Item>
      </Form>

    </Modal>

  );
}

export default EditModal;
