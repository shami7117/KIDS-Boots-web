import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, DatePicker, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BuyerApi from "@/lib/promo";
import {
  collection,
  addDoc, doc, getDoc, setDoc, where, query, getDocs
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";
import ProductApi from "@/lib/product";
import PromoApi from '@/lib/promo';

const { Option } = Select;

function EditModal({ visible, onCancel, onOk, editForm, selectedPromoCode, props }) {
  const queryClient = useQueryClient();
  console.log("editForm", selectedPromoCode)
  const [form] = Form.useForm();


  let userId

  try {
    const user = auth.currentUser;
    userId = user.uid
  } catch (error) {
    console.log(error)
  }




  const updateMutation = useMutation(
    ["Promo"],
    async ({ id, Promo }) => {
      console.log("MUTATION", Promo)
      await PromoApi.updatePromo(id, Promo);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: "Promo been updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Promo"]);
        onCancel();

      },
    }
  );

  const [status, setStatus] = useState('Default');
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const { data: lengthData, isLoading: lengthLoading, isError: lengthError } = useQuery(
    ['Products', userId],
    async () => {

      const response = await ProductApi.getAllProducts(userId);
      return response;// Assuming your API returns data property

    }
  );


  const handleSubmit = async (values) => {
    try {
      console.log("VALUES", values)
      console.log("VALUES", values)
      values["sellerId"] = userId;

      updateMutation.mutate({
        id: selectedPromoCode.id,
        Promo: values,
        // slug,
      })

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
      title="Edit Buyer"
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
        layout="vertical" initialValues={selectedPromoCode}>

        <Form.Item name="promo" label="Promo code" rules={[{ required: true, message: 'Enter Promo code' }]}>
          <Input placeholder="Enter Promo code" />
        </Form.Item>


        <Form.Item
          name="percent"
          label="Percentage"
          rules={[{ required: true, message: 'Enter Percentage ' }]}
        >
          <Input type='number' placeholder="Enter Percentage" />


        </Form.Item>

        <Form.Item
          name="products"
          label="Products"

          rules={[{ required: true, message: 'Select Products ' }]}
        >
          <Select mode="multiple" placeholder="Select Products" >

            {lengthData?.map((item) => {
              return <Option key={item.category} values={item.category}>{item.category}</Option>

            })}

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
