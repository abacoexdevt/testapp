import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isEqual } from 'lodash';

import { create, setForm, toggle, update } from '../../redux/actions/users';
import { fetch as fetchUserTypes } from '../../redux/actions/userTypes';
import { useEffect } from 'react';

const UserModal = () => {
	const dispatch = useDispatch();
	const { modal, form, formLoading } = useSelector(
		({ users }) => ({ modal: users.modal, form: users.form, formLoading: users.formLoading }),
		isEqual
	);
	const { data: userTypes, loading } = useSelector(
		({ userTypes }) => ({ data: userTypes.data, loading: userTypes.formLoading }),
		isEqual
	);

	useEffect(() => {
		dispatch(fetchUserTypes({ all: true }));
	}, [dispatch]);

	const initialValues = form
		? form
		: {
				FirstName: '',
				LastName: '',
				Gender: null,
				Email: '',
				Password: '',
				Confirm: '',
				UserType: null
		  };
	const validationSchema = yup.object().shape(
		!form
			? {
					FirstName: yup.string().required('FirstName is required.'),
					LastName: yup.string().required('LastName is required.'),
					Email: yup.string().email().required('Password is required.'),
					Password: yup
						.string()
						.min(8, 'Password atleast minimum 8 and maximum of 16 character')
						.max(16)
						.required('Password is required.'),
					Confirm: yup
						.string()
						.oneOf([yup.ref('Password'), null], 'Confirm Password is not match')
						.required('Confirm Password is required.'),
					UserType: yup.number('User Type is required.').required('User Type is required.')
			  }
			: {
					FirstName: yup.string().required('FirstName is required.'),
					LastName: yup.string().required('LastName is required.'),
					Email: yup.string().email().required('Password is required.'),
					UserType: yup.number('User Type is required').required('User Type is required.')
			  }
	);

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
			<Modal title="User Form" footer={null} visible={modal} onCancel={close} closable={!formLoading}>
				<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit}>
					<Form.Item
						id="FirstName"
						help={formik.errors['FirstName'] ? formik.errors['FirstName'] : ''}
						validateStatus={formik.errors['FirstName'] ? 'error' : ''}
						label="First Name"
						required>
						<Input
							id="FirstName"
							placeholder="FirstName"
							onChange={formik.handleChange}
							value={formik.values.FirstName}
						/>
					</Form.Item>
					<Form.Item
						id="LastName"
						help={formik.errors['LastName'] ? formik.errors['LastName'] : ''}
						validateStatus={formik.errors['LastName'] ? 'error' : ''}
						label="Last Name"
						required>
						<Input
							id="LastName"
							placeholder="Last Name"
							onChange={formik.handleChange}
							value={formik.values.LastName}
						/>
					</Form.Item>
					<Form.Item
						id="Gender"
						help={formik.errors['Gender'] ? formik.errors['Gender'] : ''}
						validateStatus={formik.errors['Gender'] ? 'error' : ''}
						label="Gender">
						<Select
							id="Gender"
							placeholder="Choose Gender"
							onChange={e => formik.setFieldValue('Gender', e)}
							value={formik.values['Gender'] || null}
							options={[
								{ label: 'Male', value: 'Male', key: 'Male' },
								{ label: 'Female', value: 'Female', key: 'Female' }
							]}
						/>
					</Form.Item>
					<Form.Item
						id="Email"
						help={formik.errors['Email'] ? formik.errors['Email'] : ''}
						validateStatus={formik.errors['Email'] ? 'error' : ''}
						label="Email"
						required>
						<Input
							id="Email"
							placeholder="Email"
							onChange={formik.handleChange}
							value={formik.values.Email}
						/>
					</Form.Item>
					{!form && (
						<>
							<Form.Item
								id="Password"
								help={formik.errors['Password'] ? formik.errors['Password'] : ''}
								validateStatus={formik.errors['Password'] ? 'error' : ''}
								label="Password"
								required>
								<Input.Password
									id="Password"
									placeholder="Password"
									onChange={formik.handleChange}
									value={formik.values.Password}
								/>
							</Form.Item>
							<Form.Item
								name="Confirm"
								help={formik.errors['Confirm'] ? formik.errors['Confirm'] : ''}
								validateStatus={formik.errors['Confirm'] ? 'error' : ''}
								label="Confirm Password"
								dependencies={['Password']}
								required>
								<Input.Password
									id="Confirm"
									placeholder="Confirm Password"
									onChange={formik.handleChange}
									value={formik.values.FirstName}
								/>
							</Form.Item>
						</>
					)}
					<Form.Item
						id="UserType"
						help={formik.errors['UserType'] ? formik.errors['UserType'] : ''}
						validateStatus={formik.errors['UserType'] ? 'error' : ''}
						label="User Type"
						required>
						<Select
							id="UserType"
							placeholder="Choose User Type"
							allowClear
							onChange={e => formik.setFieldValue('UserType', e)}
							value={formik.values.UserType || null}
							options={userTypes.map(d => ({ label: d.Label, value: d._id }))}
						/>
					</Form.Item>
					{form && (
						<Form.Item
							id="Status"
							help={formik.errors['Status'] ? formik.errors['Status'] : ''}
							validateStatus={formik.errors['Status'] ? 'error' : ''}
							label="Status">
							<Select
								id="Status"
								placeholder="Choose Status"
								onChange={e => formik.setFieldValue('Status', e)}
								value={formik.values.Status}
								options={[
									{ label: 'Active', value: 'Active', key: 'Active' },
									{ label: 'Deactivated', value: 'Deactivated', key: 'Deactivated' }
								]}
							/>
						</Form.Item>
					)}

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

export default UserModal;
