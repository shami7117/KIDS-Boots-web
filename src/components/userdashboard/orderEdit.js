import React, { useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select, Button, notification } from 'antd';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import OrderApi from '@/lib/order';

const { Option } = Select;

function OrderModal({ visible, onCancel, onSubmit, selectedOrder, editForm }) {
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleFormSubmit = () => {
    editForm.validateFields().then((values) => {
      onSubmit(values);
    });
  };


  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const updateMutation = useMutation(
    ["Orders"],
    async ({ id, Product }) => {
      await OrderApi.updateOrder(id, Product);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: "Product has been updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Orders"]);
        onCancel();

      },
    }
  );



  const handleSubmit = async (values) => {
    try {


      try {
        updateMutation.mutate({
          id: selectedOrder.id,
          Product: values,
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


  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return { backgroundColor: '#49E258' };
      case 'In Progress':
        return { backgroundColor: '#F0E74A' };
      case 'Cancelled':
        return { backgroundColor: '#D94B38' };
      default:
        return { backgroundColor: '#2668E81A' };
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title="Create Order"
      onCancel={handleCancel}
      footer={[

      ]}
    >
      <Form form={editForm} onFinish={handleSubmit} layout="vertical" initialValues={selectedOrder}>

        <Form.Item name="status" label="Status">
          <Select
            defaultValue="New"
            dropdownStyle={{ backgroundColor: '#ffffff', padding: '3' }}
          >
            {/* <Option
              value="New"
              style={{
                background: '#2668E81A',
                transition: 'background-color 0.3s ease',
              }}
            >
              New
            </Option> */}
            <Option
              value="Accepted"
              style={{
                background: '#FFF9F4',
                transition: 'background-color 0.3s ease',
              }}
            >
              Accept
            </Option>
            {/* <Option
              value="Completed"
              style={{
                background: '#E826261A',
                transition: 'background-color 0.3s ease',
              }}
            >
              Completed
            </Option> */}
            <Option
              value="Cancelled"
              style={{
                background: '#36E82617',
                transition: 'background-color 0.3s ease',
              }}
            >
              Cancelled
            </Option>
          </Select>
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

export default OrderModal;
