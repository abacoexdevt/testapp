// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, Form, Input, Modal, Row, Col, message, Radio } from 'antd';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import { isEqual } from 'lodash';

// import { create, setForm, toggle, update } from '../../redux/actions/customers';

// const CustomersModal = () => {
// 	const dispatch = useDispatch();
// 	const { modal, form, formLoading } = useSelector(
// 		({ customers }) => ({ modal: customers.modal, form: customers.form, formLoading: customers.formLoading }),
// 		isEqual
// 	);

// 	const initialValues = form
// 		? {
// 				...form
// 				// Birthday: moment(form.Birthday)
// 				// SignDate: moment(form.SignDate)
// 		  }
// 		: {
// 				FirstName: '',
// 				MiddleName: '',
// 				LastName: '',
// 				Gender: null,
// 				Email: '',
// 				Phone: '',
// 				Address: '',
// 				Country: ''
// 				// SignDate: ''
// 		  };
// 	const validationSchema = yup.object().shape({
// 		FirstName: yup.string().required('FirstName is required.'),
// 		MiddleName: yup.string().required('MiddleName is required.'),
// 		LastName: yup.string().required('LastName is required.'),
// 		Gender: yup.string().required('Gender is required.'),
// 		Email: yup.string().email().required('Password is required.'),
// 		Phone: yup.string().required('Phone is required.'),
// 		Address: yup.string().required('Address is required.'),
// 		Country: yup.string().required('Country is required.')
// 		// Birthday: yup
// 		// 	.date()
// 		// 	.test('Birthday', 'Customer must be 18 years old and above.', value => {
// 		// 		return differenceInYears(new Date(), new Date(value)) >= 18;
// 		// 	})
// 		// 	.required('Birthday is required.'),
// 		// SignDate: yup.date().required('Sign Date is required.')
// 	});

// 	const formik = useFormik({
// 		enableReinitialize: true,
// 		initialValues,
// 		validationSchema,
// 		onSubmit: async values => {
// 			try {
// 				if (form) {
// 					const updatedValues = {
// 						Id: form._id,
// 						...values
// 					};
// 					const response = await dispatch(update(updatedValues));
// 					message.success(response.message);
// 				} else {
// 					const response = await dispatch(create(values));
// 					message.success(response.message);
// 				}
// 				close();
// 			} catch (error) {
// 				console.log(error);
// 				message.error(error.message);
// 			}
// 		}
// 	});

// 	const close = () => {
// 		dispatch(setForm(null));
// 		dispatch(toggle(false));
// 	};

// 	return (
// 		<>
// 			<Modal
// 				width={'60vw'}
// 				title="Customer Form"
// 				footer={null}
// 				visible={modal}
// 				onCancel={close}
// 				closable={!formLoading}>
// 				<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit}>
// 					<Row gutter={16}>
// 						<Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="FirstName"
// 								help={formik.errors['FirstName'] ? formik.errors['FirstName'] : ''}
// 								// hasFeedback={formik.errors['FirstName'] ? true : false}
// 								validateStatus={formik.errors['FirstName'] ? 'error' : ''}
// 								label="First Name"
// 								required>
// 								<Input
// 									id="FirstName"
// 									placeholder="FirstName"
// 									onChange={formik.handleChange}
// 									value={formik.values.FirstName}
// 								/>
// 							</Form.Item>
// 						</Col>
// 						<Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="MiddleName"
// 								help={formik.errors['MiddleName'] ? formik.errors['MiddleName'] : ''}
// 								// hasFeedback={formik.errors['MiddleName'] ? true : false}
// 								validateStatus={formik.errors['MiddleName'] ? 'error' : ''}
// 								label="Middle Name"
// 								required>
// 								<Input
// 									id="MiddleName"
// 									placeholder="Middle Name"
// 									onChange={formik.handleChange}
// 									value={formik.values.MiddleName}
// 								/>
// 							</Form.Item>
// 						</Col>
// 						<Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="LastName"
// 								help={formik.errors['LastName'] ? formik.errors['LastName'] : ''}
// 								// hasFeedback={formik.errors['LastName'] ? true : false}
// 								validateStatus={formik.errors['LastName'] ? 'error' : ''}
// 								label="Last Name"
// 								required>
// 								<Input
// 									id="LastName"
// 									placeholder="Last Name"
// 									onChange={formik.handleChange}
// 									value={formik.values.LastName}
// 								/>
// 							</Form.Item>
// 						</Col>
// 					</Row>

// 					<Row gutter={16}>
// 						<Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="Email"
// 								help={formik.errors['Email'] ? formik.errors['Email'] : ''}
// 								// hasFeedback={formik.errors['Email'] ? true : false}
// 								validateStatus={formik.errors['Email'] ? 'error' : ''}
// 								label="Email"
// 								required>
// 								<Input
// 									id="Email"
// 									placeholder="Email"
// 									onChange={formik.handleChange}
// 									value={formik.values.Email}
// 								/>
// 							</Form.Item>
// 						</Col>
// 						<Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="Phone"
// 								help={formik.errors['Phone'] ? formik.errors['Phone'] : ''}
// 								// hasFeedback={formik.errors['Phone'] ? true : false}
// 								validateStatus={formik.errors['Phone'] ? 'error' : ''}
// 								label="Phone Number"
// 								required>
// 								<Input
// 									id="Phone"
// 									placeholder="Phone"
// 									onChange={formik.handleChange}
// 									value={formik.values.Phone}
// 								/>
// 							</Form.Item>
// 						</Col>
// 						<Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="Gender"
// 								help={formik.errors['Gender'] ? formik.errors['Gender'] : ''}
// 								// hasFeedback={formik.errors['Gender'] ? true : false}
// 								validateStatus={formik.errors['Gender'] ? 'error' : ''}
// 								label="Gender"
// 								required>
// 								<Radio.Group
// 									id="Gender"
// 									size={'small'}
// 									placeholder="Choose Gender"
// 									onChange={e => formik.setFieldValue('Gender', e.target.value)}
// 									value={formik.values['Gender'] || null}
// 									options={[
// 										{ label: 'Male', value: 'Male', key: 'Male' },
// 										{ label: 'Female', value: 'Female', key: 'Female' }
// 									]}
// 								/>
// 							</Form.Item>
// 						</Col>

// 						{/* <Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="Birthday"
// 								help={
// 									formik.errors['Birthday']
// 										? formik.errors['Birthday']
// 										: ''
// 								}
// 								// hasFeedback={formik.errors['Birthday']  ? true : false}
// 								validateStatus={formik.errors['Birthday']  ? 'error' : ''}
// 								label="Birthday"
// 								required>
// 								<DatePicker
// 									style={{ width: '100%' }}
// 									id="Birthday"
// 									placeholder="Birthday"
// 									onChange={e => {
// 										formik.setFieldValue('Birthday', moment(e));
// 									}}
// 									value={formik.values.Birthday}
// 								/>
// 							</Form.Item>
// 						</Col> */}
// 					</Row>
// 					<Row gutter={12}>
// 						<Col lg={16} md={24} xs={24}>
// 							<Form.Item
// 								id="Address"
// 								help={formik.errors['Address'] ? formik.errors['Address'] : ''}
// 								// hasFeedback={formik.errors['Address'] ? true : false}
// 								validateStatus={formik.errors['Address'] ? 'error' : ''}
// 								label="Address"
// 								required>
// 								<Input
// 									id="Address"
// 									placeholder="Address"
// 									onChange={formik.handleChange}
// 									value={formik.values.Address}
// 								/>
// 							</Form.Item>
// 						</Col>
// 						<Col lg={8} md={12} xs={24}>
// 							<Form.Item
// 								id="Country"
// 								help={formik.errors['Country'] ? formik.errors['Country'] : ''}
// 								// hasFeedback={formik.errors['Country'] ? true : false}
// 								validateStatus={formik.errors['Country'] ? 'error' : ''}
// 								label="Country"
// 								required>
// 								<Input
// 									id="Country"
// 									placeholder="Country"
// 									onChange={formik.handleChange}
// 									value={formik.values.Country}
// 								/>
// 							</Form.Item>
// 						</Col>
// 					</Row>

// 					<Form.Item>
// 						<Button
// 							disabled={formLoading}
// 							loading={formLoading}
// 							type="primary"
// 							htmlType="submit"
// 							style={{ float: 'right' }}>
// 							Submit
// 						</Button>
// 					</Form.Item>
// 				</Form>
// 			</Modal>
// 		</>
// 	);
// };

// export default CustomersModal;
