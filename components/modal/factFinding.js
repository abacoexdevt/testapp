import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Row, Col, Select, message, DatePicker, Radio } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isEqual } from 'lodash';
import { differenceInYears } from 'date-fns';

import { create, setForm, toggle, update } from '../../redux/actions/customers';
import dayjs from 'dayjs';
import moment from 'moment';

const FactModal = () => {
	const dispatch = useDispatch();
	const { modal, form, formLoading } = useSelector(
		({ customers }) => ({ modal: customers.modal, form: customers.form, formLoading: customers.formLoading }),
		isEqual
	);

	const initialValues = form
		? { ...form }
		: {
				RiskDegree: '',
				Status: '',
				AssignedTo: ''
		  };
	const validationSchema = yup.object().shape({
		RiskDegree: yup.string().required('RiskDegree is required.'),
		Status: yup.string().required('Status is required.'),
		AssignedTo: yup.string().required('AssignedTo is required.')
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues,
		validationSchema,
		onSubmit: async values => {
			try {
				if (form) {
					const updatedValues = {
						Id: form._id,
						...values
					};
					const response = await dispatch(update(updatedValues));
					message.success(response.message);
					formik.resetForm();
				} else {
					const response = await dispatch(create(values));
					message.success(response.message);
					formik.resetForm();
				}
				close();
			} catch (error) {
				console.log(error);
				message.error(error.message);
			}
		}
	});

	const close = () => {
		dispatch(setForm(null));
		dispatch(toggle(false));
	};

	return (
		<>
			<Modal
				// width={'60vw'}
				title="Customer Form"
				footer={null}
				visible={modal}
				onCancel={close}
				closable={!formLoading}>
				<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit}>
					<Row gutter={16}>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="RiskDegree"
								help={formik.errors['RiskDegree'] ? formik.errors['RiskDegree'] : ''}
								// hasFeedback={formik.errors['RiskDegree'] ? true : false}
								validateStatus={formik.errors['RiskDegree'] ? 'error' : ''}
								label="Risk Degree"
								required>
								<Input
									id="RiskDegree"
									placeholder="RiskDegree"
									onChange={formik.handleChange}
									value={formik.values.FirstName}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Status"
								help={formik.errors['Status'] ? formik.errors['Status'] : ''}
								// hasFeedback={formik.errors['Status'] ? true : false}
								validateStatus={formik.errors['Status'] ? 'error' : ''}
								label="Status"
								required>
								<Input
									id="Status"
									placeholder="Status"
									onChange={formik.handleChange}
									value={formik.values.MiddleName}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="AssignedTo"
								help={formik.errors['AssignedTo'] ? formik.errors['AssignedTo'] : ''}
								// hasFeedback={formik.errors['AssignedTo'] ? true : false}
								validateStatus={formik.errors['AssignedTo'] ? 'error' : ''}
								label="AssignedTo"
								required>
								<Input
									id="AssignedTo"
									placeholder="AssignedTo"
									onChange={formik.handleChange}
									value={formik.values.LastName}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item>
						<Button
							disabled={formLoading}
							loading={formLoading}
							type="primary"
							htmlType="submit"
							style={{ float: 'right' }}>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default FactModal;
