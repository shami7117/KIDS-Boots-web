import React, { useState, useRef } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BuyerApi from "@/lib/promo";
import {
  collection,
  addDoc, doc, getDoc, setDoc, where, query, getDocs
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";
import ProductApi from "@/lib/product";
import PromoApi from '@/lib/promo';


function BuyerModal({ visible, onCancel, onSubmit }) {

  let userId

  try {
    const user = auth.currentUser;
    userId = user.uid
  } catch (error) {
    console.log(error)
  }



  const queryClient = useQueryClient();
  const [form] = Form.useForm();


  const addMutation = useMutation(
    ["Promo"],
    async (data) => {
      return await PromoApi.addPromo(data);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: data?.code === 1 ? "success" : "error",
          message: data?.message,
          placement: "top",
        });
        queryClient.invalidateQueries(["Promo"]);

        form.validateFields().then((values) => {

          form.resetFields();
        });

        onCancel();
      },
    }
  );

  const { data: lengthData, isLoading: lengthLoading, isError: lengthError } = useQuery(
    ['Products', userId],
    async () => {

      const response = await ProductApi.getAllProducts(userId);
      return response;// Assuming your API returns data property

    }
  );

  console.log(lengthData)


  const [status, setStatus] = useState('Default');
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');



  const handleSubmit = async (values) => {
    try {
      console.log("VALUES", values)
      values["sellerId"] = userId;

      addMutation.mutate(values)


      form.resetFields();


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
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title="Add Buyer"
      onCancel={handleCancel}
      footer={[
        // <Button key="submit" type="primary" onClick={handleFormSubmit} className="submit-button hover:bg-[#DB3293]">
        //   Add
        // </Button>,
      ]}
    >
      <Form
        onFinish={handleSubmit}
        layout="vertical" >
        <Form.Item name="promo" label="Promo code" rules={[{ required: true, message: 'Enter Promo code' }]}>
          <Input placeholder="Enter Promo code" />
        </Form.Item>


        <Form.Item
          name="products"
          label="Products"

          rules={[{ required: true, message: 'Select Products ' }]}
        >
          <Select mode="multiple" placeholder="Select Products" >

            {lengthData?.map((item) => (
              <Option key={[item.category, item.id]}>{item.category}</Option>
            ))}
          </Select>


        </Form.Item>

        {/* <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Select Status ' }]}
        >
          <Select placeholder="Select City" >

            <Option key="Enable" values="Enable">Enable</Option>
            <Option key="Disable" values="Disable">Disable</Option>
          </Select>


        </Form.Item> */}

        <Form.Item
          name="time"
          label="Time"
        >
          <Input type='number' placeholder="Enter Time" />

        </Form.Item>





        <Form.Item className=' flex justify-end items-center'>
          <Button
            className="submit-button" size="large"
            type="primary"
            htmlType="submit"
          >
            {addMutation.isLoading
              ? "Submitting..."
              : "Submit"}
          </Button>
        </Form.Item>
      </Form>

    </Modal >
  );
}

export default BuyerModal;
