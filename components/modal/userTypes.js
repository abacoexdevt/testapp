import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isEqual } from 'lodash';

import { create, setForm, toggle, update } from '../../redux/actions/userTypes';

const UserTypeModal = () => {
	const dispatch = useDispatch();
	const { modal, form, formLoading } = useSelector(
		({ userTypes }) => ({ modal: userTypes.modal, form: userTypes.form, formLoading: userTypes.formLoading }),
		isEqual
	);

	const initialValues = form
		? form
		: {
				Label: '',
				Code: '',
				Level: ''
		  };
	const validationSchema = yup.object().shape({
		Label: yup.string().required('Label is required.'),
		Code: yup.string().required('Code is required.'),
		Level: yup.string().required('Level is required.')
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues,
		validationSchema,
		onSubmit: async values => {
			try {
				console.log(values);
				if (form) {
					// const updatedValues = {
					// 	Id: form._id,
					// 	...values
					// };
					// const response = await dispatch(update(updatedValues));
					// message.success(response.message);
				} else {
					const response = await dispatch(create(values));
					message.success(response.message);
				}
				close();
			} catch (error) {
				console.log(error);
				message.error(error.message);
			}
		}
	});

	const close = () => {
		formik.resetForm();
		dispatch(setForm(null));
		dispatch(toggle(false));
	};

	return (
		<>
			<Modal title="User Type Form" footer={null} visible={modal} onCancel={close} closable={!formLoading}>
				<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit}>
					<Form.Item
						id="Label"
						help={formik.errors['Label'] ? formik.errors['Label'] : ''}
						validateStatus={formik.errors['Label'] ? 'error' : ''}
						label="Label"
						required>
						<Input
							id="Label"
							placeholder="Label"
							onChange={formik.handleChange}
							value={formik.values.Label}
						/>
					</Form.Item>
					<Form.Item
						id="Code"
						help={formik.errors['Code'] ? formik.errors['Code'] : ''}
						validateStatus={formik.errors['Code'] ? 'error' : ''}
						label="Code"
						required>
						<Input id="Code" placeholder="Code" onChange={formik.handleChange} value={formik.values.Code} />
					</Form.Item>
					<Form.Item
						id="Level"
						help={formik.errors['Level'] ? formik.errors['Level'] : ''}
						validateStatus={formik.errors['Level'] ? 'error' : ''}
						label="Level"
						required>
						<Select
							id="Level"
							placeholder="Level"
							onChange={e => formik.setFieldValue('Level', e)}
							options={[
								{ label: 1, value: 1 },
								{ label: 2, value: 2 },
								{ label: 3, value: 3 },
								{ label: 4, value: 4 },
								{ label: 5, value: 5 }
							]}
							value={formik.values.Level}
						/>
					</Form.Item>

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

export default UserTypeModal;
