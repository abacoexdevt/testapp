import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Row, Col, Select, message, DatePicker, Radio, Checkbox } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { initial, isEqual, omit, values } from 'lodash';

import { create, setForm, toggle, update } from '../../redux/actions/cases';

import dayjs from 'dayjs';

const casesModal = ({ customers = [] }) => {
	const dispatch = useDispatch();
	const [inList, setInList] = useState(true);
	const [selectedCustomer, setSelectedCustomer] = useState(null);

	const { modal, form, formLoading } = useSelector(
		({ cases }) => ({ modal: cases.modal, form: cases.form, formLoading: cases.formLoading }),
		isEqual
	);

	const customersList = customers.map(d => ({ label: d.Email, value: d._id, key: d._id }));
	const customerInfo = form
		? customers.find(d => d._id == form.Customer._id)
		: selectedCustomer
		? customers.find(d => d._id == selectedCustomer)
		: null;

	const initialFields = {
		Business: '',
		Customer: '',
		FirstName: '',
		MiddleName: '',
		LastName: '',
		Gender: '',
		Email: '',
		Phone: '',
		Address: '',
		Country: '',
		AmlPanel: '',
		CsrPanel: '',
		AdminPanel: '',
		QaTool: '',
		Investigation: ''
	};
	const initialValues = form
		? {
				...form,
				AdminPanel: form.AdminPanel.split(','),
				CsrPanel: form.CsrPanel.split(','),
				AmlPanel: form.AmlPanel.split(','),
				QaTool: form.QaTool.split(','),
				...omit(customerInfo, '_id')
		  }
		: initialFields;

	const validationSchema = yup.object().shape(
		form
			? {
					Business: yup.string().required('Business is required.'),
					Investigation: yup.string().required('Investigation is required.')
			  }
			: inList
			? {
					Customer: yup.string().required('Customer is required.').nullable(),
					Business: yup.string().required('Business is required.'),
					Investigation: yup.string().required('Investigation is required.')
			  }
			: {
					Business: yup.string().required('Business is required.'),
					FirstName: yup.string().required('FirstName is required.'),
					MiddleName: yup.string().required('MiddleName is required.'),
					LastName: yup.string().required('LastName is required.'),
					Gender: yup.string().required('Gender is required.'),
					Email: yup.string().email().required('Password is required.'),
					Phone: yup.string().required('Phone is required.'),
					Address: yup.string().required('Address is required.'),
					Country: yup.string().required('Country is required.'),
					Investigation: yup.string().required('Investigation Type is required.')
			  }
	);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues,
		validationSchema,
		onSubmit: async values => {
			try {
				const { AdminPanel = '', AmlPanel = '', CsrPanel = '', QaTool = '' } = values;
				if (form) {
					const updatedValues = {
						Id: values._id,
						...omit(values, '_id'),
						AdminPanel: AdminPanel ? AdminPanel.toString() : '',
						AmlPanel: AmlPanel ? AmlPanel.toString() : '',
						CsrPanel: CsrPanel ? CsrPanel.toString() : '',
						QaTool: QaTool ? QaTool.toString() : '',
						Customer: values.Customer._id
					};
					const response = await dispatch(update(updatedValues));
					message.success(response.message);
					formik.resetForm();
				} else {
					const dt = {
						...omit(values, '_id'),
						AdminPanel: AdminPanel ? AdminPanel.toString() : '',
						AmlPanel: AmlPanel ? AmlPanel.toString() : '',
						CsrPanel: CsrPanel ? CsrPanel.toString() : '',
						QaTool: QaTool ? QaTool.toString() : '',
						Date: dayjs().format('YYYY-MM-DD')
					};
					const response = await dispatch(create(dt));
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
				width={'80vw'}
				style={{ top: '5px' }}
				title="Case Form"
				footer={null}
				visible={modal}
				onCancel={close}
				closable={!formLoading}>
				<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit}>
					<Row>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Business"
								help={formik.errors['Business'] ? formik.errors['Business'] : ''}
								// hasFeedback={formik.errors['Business'] ? true : false}
								validateStatus={formik.errors['Business'] ? 'error' : ''}
								label="Business"
								required>
								<Radio.Group
									id="Business"
									size={'small'}
									placeholder="Choose Business"
									onChange={e => formik.setFieldValue('Business', e.target.value)}
									options={[
										{
											label: 'Virtual Currency',
											value: 1,
											key: 'Virtual Currency'
										},
										{ label: 'Money Exchange', value: 2, key: 'Money Exchange' }
									]}
									defaultValue={formik.values['Business']}
									value={formik.values['Business']}
								/>
							</Form.Item>
						</Col>
					</Row>
					{!form && (
						<Row gutter={24}>
							<Col span={12}>
								<Form.Item
									id="Customer"
									help={formik.errors['Customer'] ? formik.errors['Customer'] : ''}
									// hasFeedback={formik.errors['Customer'] ? true : false}
									validateStatus={formik.errors['Customer'] ? 'error' : ''}
									label="Customer"
									required>
									<Select
										allowClear
										showSearch
										style={{ width: '100%' }}
										onChange={e => {
											setInList(true);
											setSelectedCustomer(e);
											const Business = formik.values['Business'];
											const Investigation = formik.values['Investigation'];
											customerInfo && formik.setValues({ ...initialFields, ...customerInfo });
											formik.setFieldValue('Business', Business);
											formik.setFieldValue('Customer', e);
											formik.setFieldValue('Investigation', Investigation);
										}}
										placeholder="Search for Customer Email address"
										options={customersList}
										value={formik.values['Customer'] || null}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									id="inList"
									help={formik.errors['inList'] ? formik.errors['inList'] : ''}
									// hasFeedback={formik.errors['inList'] ? true : false}
									validateStatus={formik.errors['inList'] ? 'error' : ''}
									label="is in the List?">
									<Radio.Group
										id="inList"
										size={'small'}
										placeholder="Choose inList"
										onChange={e => {
											setInList(e.target.value);
											const Business = formik.values['Business'];
											const Investigation = formik.values['Investigation'];
											if (!e.target.value) {
												formik.setValues({ ...initialFields });
												formik.setFieldValue('Business', Business);
												formik.setFieldValue('Investigation', Investigation);
											}
										}}
										value={inList}
										options={[
											{ label: 'Yes', value: true, key: 'Yes' },
											{ label: 'No', value: false, key: 'No' }
										]}
									/>
								</Form.Item>
							</Col>
						</Row>
					)}
					<h3>Customer Information</h3>

					<Row gutter={24}>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="FirstName"
								help={formik.errors['FirstName'] ? formik.errors['FirstName'] : ''}
								// hasFeedback={formik.errors['FirstName'] ? true : false}
								validateStatus={formik.errors['FirstName'] ? 'error' : ''}
								label="First Name"
								required>
								<Input
									disabled={form}
									id="FirstName"
									placeholder="FirstName"
									onChange={formik.handleChange}
									value={formik.values.FirstName}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="MiddleName"
								help={formik.errors['MiddleName'] ? formik.errors['MiddleName'] : ''}
								// hasFeedback={formik.errors['MiddleName'] ? true : false}
								validateStatus={formik.errors['MiddleName'] ? 'error' : ''}
								label="Middle Name"
								required>
								<Input
									disabled={form}
									id="MiddleName"
									placeholder="Middle Name"
									onChange={formik.handleChange}
									value={formik.values.MiddleName}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="LastName"
								help={formik.errors['LastName'] ? formik.errors['LastName'] : ''}
								// hasFeedback={formik.errors['LastName'] ? true : false}
								validateStatus={formik.errors['LastName'] ? 'error' : ''}
								label="Last Name"
								required>
								<Input
									disabled={form}
									id="LastName"
									placeholder="Last Name"
									onChange={formik.handleChange}
									value={formik.values.LastName}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Email"
								help={formik.errors['Email'] ? formik.errors['Email'] : ''}
								// hasFeedback={formik.errors['Email'] ? true : false}
								validateStatus={formik.errors['Email'] ? 'error' : ''}
								label="Email"
								required>
								<Input
									disabled={form}
									id="Email"
									placeholder="Email"
									onChange={formik.handleChange}
									value={formik.values.Email}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Phone"
								help={formik.errors['Phone'] ? formik.errors['Phone'] : ''}
								// hasFeedback={formik.errors['Phone'] ? true : false}
								validateStatus={formik.errors['Phone'] ? 'error' : ''}
								label="Phone Number"
								required>
								<Input
									disabled={form}
									id="Phone"
									placeholder="Phone"
									onChange={formik.handleChange}
									value={formik.values.Phone}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Gender"
								help={formik.errors['Gender'] ? formik.errors['Gender'] : ''}
								// hasFeedback={formik.errors['Gender'] ? true : false}
								validateStatus={formik.errors['Gender'] ? 'error' : ''}
								label="Gender"
								required>
								<Radio.Group
									disabled={form}
									id="Gender"
									size={'small'}
									placeholder="Choose Gender"
									onChange={e => formik.setFieldValue('Gender', e.target.value)}
									value={formik.values['Gender'] || ''}
									options={[
										{ label: 'Male', value: 'Male', key: 'Male' },
										{ label: 'Female', value: 'Female', key: 'Female' }
									]}
									defaultValue={formik.values['Gender']}
								/>
							</Form.Item>
						</Col>
						{/* <Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Birthday"
								help={
									formik.errors['Birthday'] 
										? formik.errors['Birthday']
										: ''
								}
								// hasFeedback={formik.errors['Birthday']  ? true : false}
								validateStatus={formik.errors['Birthday']  ? 'error' : ''}
								label="Birthday"
								required>
								<DatePicker
									style={{ width: '100%' }}
									id="Birthday"
									placeholder="Birthday"
									onChange={e => {
										formik.setFieldValue('Birthday', moment(e));
									}}
									value={formik.values.Birthday}
								/>
							</Form.Item>
						</Col> */}
					</Row>
					<Row gutter={12}>
						<Col lg={16} md={24} xs={24}>
							<Form.Item
								id="Address"
								help={formik.errors['Address'] ? formik.errors['Address'] : ''}
								// hasFeedback={formik.errors['Address'] ? true : false}
								validateStatus={formik.errors['Address'] ? 'error' : ''}
								label="Address"
								required>
								<Input
									disabled={form}
									id="Address"
									placeholder="Address"
									onChange={formik.handleChange}
									value={formik.values.Address}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Country"
								help={formik.errors['Country'] ? formik.errors['Country'] : ''}
								// hasFeedback={formik.errors['Country'] ? true : false}
								validateStatus={formik.errors['Country'] ? 'error' : ''}
								label="Country"
								required>
								<Input
									disabled={form}
									id="Country"
									placeholder="Country"
									onChange={formik.handleChange}
									value={formik.values.Country}
								/>
							</Form.Item>
						</Col>
					</Row>
					<hr />

					<h3>Case Details</h3>
					<Row gutter={12}>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="AdminPanel"
								help={formik.errors['AdminPanel'] ? formik.errors['AdminPanel'] : ''}
								// hasFeedback={formik.errors['AdminPanel'] ? true : false}
								validateStatus={formik.errors['AdminPanel'] ? 'error' : ''}
								label="Admin Panel:">
								<Checkbox.Group
									style={{ display: 'block', width: '100%', marginLeft: 0 }}
									id="AdminPanel"
									options={[
										{
											label: 'Possible Hit CTR',
											value: 'Possible Hit CTR'
										},
										{
											label: 'Possible Hit STR',
											value: 'Possible Hit STR'
										},
										{
											label: 'Possible Hit Risk Country',
											value: 'Possible Hit Risk Country'
										},
										{
											label: 'Possible Hit Unusual Log-In Activity',
											value: 'Possible Hit Unusual Log-In Activity'
										},
										{
											label: 'Possible Watchlist Match',
											value: 'Possible Watchlist Match'
										}
									]}
									onChange={e => {
										formik.setFieldValue('AdminPanel', e);
									}}
									value={formik.values['AdminPanel'] || []}
									defaultValue={formik.values['AdminPanel']}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="CsrPanel"
								help={formik.errors['CsrPanel'] ? formik.errors['CsrPanel'] : ''}
								// hasFeedback={formik.errors['CsrPanel'] ? true : false}
								validateStatus={formik.errors['CsrPanel'] ? 'error' : ''}
								label="CSR Panel:">
								<Checkbox.Group
									id="CsrPanel"
									options={[
										{
											label: 'Possible Fraudulent Transaction Activity',
											value: 'Possible Fraudulent Transaction Activity'
										},
										{
											label: 'Possible Account Take Over by 3rd Party',
											value: 'Possible Account Take Over by 3rd Party'
										},
										{
											label: 'Friendly Fraud',
											value: 'Friendly Fraud'
										},
										{
											label: 'Reputational Risk',
											value: 'Reputational Risk'
										},
										{
											label: 'Legal Risk',
											value: 'Legal Risk'
										}
									]}
									onChange={e => {
										formik.setFieldValue('CsrPanel', e);
									}}
									value={formik.values['CsrPanel'] || []}
									defaultValue={formik.values['CsrPanel'] || []}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="AmlPanel"
								help={formik.errors['AmlPanel'] ? formik.errors['AmlPanel'] : ''}
								// hasFeedback={formik.errors['AmlPanel'] ? true : false}
								validateStatus={formik.errors['AmlPanel'] ? 'error' : ''}
								label="AML Panel:">
								<Checkbox.Group
									id="AmlPanel"
									options={[
										{
											label: 'Transaction Monitoring',
											value: 'Transaction Monitoring'
										},
										{
											label: 'Watchlist Monitoring',
											value: 'Watchlist Monitoring'
										},
										{
											label: 'Risk Profiling',
											value: 'Risk Profiling'
										}
									]}
									onChange={e => {
										formik.setFieldValue('AmlPanel', e);
									}}
									value={formik.values['AmlPanel'] || []}
									defaultValue={formik.values['AmlPanel'] || []}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="QaTool"
								help={formik.errors['QaTool'] ? formik.errors['QaTool'] : ''}
								// hasFeedback={formik.errors['QaTool'] ? true : false}
								validateStatus={formik.errors['QaTool'] ? 'error' : ''}
								label="QA Tool:">
								<Checkbox.Group
									id="QaTool"
									options={[
										{
											label: 'External',
											value: 'External'
										},
										{
											label: 'Internal',
											value: 'Internal'
										}
									]}
									onChange={e => {
										formik.setFieldValue('QaTool', e);
									}}
									value={formik.values['QaTool']}
									defaultValue={formik.values['QaTool']}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Investigation"
								help={formik.errors['Investigation'] ? formik.errors['Investigation'] : ''}
								// hasFeedback={formik.errors['Investigation'] ? true : false}
								validateStatus={formik.errors['Investigation'] ? 'error' : ''}
								label="Investigation:"
								required>
								<Radio.Group
									id="Investigation"
									size={'small'}
									placeholder="Choose Investigation"
									onChange={e => formik.setFieldValue('Investigation', e.target.value)}
									value={formik.values.Investigation}
									options={[
										{ label: 'internal', value: 'internal', key: 'internal' },
										{ label: 'external', value: 'external', key: 'external' }
									]}
									defaultValue={formik.values['Investigation']}
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

export default casesModal;
