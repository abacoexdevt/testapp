import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, Row, Col, Select, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isEqual } from 'lodash';

import { create, fetch as fetchRisk, setForm, toggle, update } from '../../redux/actions/riskAssesment';
import { fetch as fetchCases } from '../../redux/actions/cases';

const RiskModal = ({ account }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;
	const Case = cases.length > 0 ? cases[0] : null;

	const {
		data: risk,
		modal,
		form,
		formLoading
	} = useSelector(
		({ risk }) => ({
			data: risk.data,
			modal: risk.modal,
			form: risk.form,
			formLoading: risk.formLoading
		}),
		isEqual
	);

	const initialValues = form
		? form
		: {
				Degree: '',
				Status: '',
				Manager: ''
		  };

	const validationSchema = yup.object().shape({
		Degree: yup.string().required('Risk Degree is required.'),
		Status: yup.string().required('Status is required.'),
		Manager: yup.string().required('Assigned to is required.')
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
					const Values = { ...values, Case: query.id };
					const response = await dispatch(create(Values));
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
				width={'60vw'}
				title="Risk Assesment Triage Form"
				footer={null}
				visible={modal}
				onCancel={close}
				closable={!formLoading}>
				<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit}>
					<Row gutter={16}>
						<Col lg={6} md={12} xs={24}>
							<Form.Item
								id="Degree"
								help={formik.errors['Degree'] ? formik.errors['Degree'] : ''}
								// hasFeedback={formik.errors['Degree'] ? true : false}
								validateStatus={formik.errors['Degree'] ? 'error' : ''}
								label="Risk Degree"
								required>
								<Select
									id="Degree"
									placeholder="Select Risk Degree"
									onChange={e => formik.setFieldValue('Degree', e)}
									options={[
										{ label: 'Low', value: 'Low', key: 'Low' },
										{ label: 'Medium', value: 'Medium', key: 'Medium' },
										{ label: 'High', value: 'High', key: 'High' }
									]}
									value={formik.values.Degree || null}
								/>
							</Form.Item>
						</Col>
						<Col lg={10} md={12} xs={24}>
							<Form.Item
								id="Status"
								help={formik.errors['Status'] ? formik.errors['Status'] : ''}
								// hasFeedback={formik.errors['Status'] ? true : false}
								validateStatus={formik.errors['Status'] ? 'error' : ''}
								label="Status"
								required>
								<Select
									id="Status"
									placeholder="Select Status"
									onChange={e => formik.setFieldValue('Status', e)}
									options={[
										{ label: 'Open Unassigned', value: 'Open Unassigned', key: 'Open Unassigned' },
										{
											label: 'Assigned - Risk Officer',
											value: 'Assigned - Risk Officer',
											key: 'Assigned (Risk Officer)'
										},
										{
											label: 'Assigned - Risk Assesment',
											value: 'Assigned - Risk Assesment',
											key: 'Assigned - Risk Assesment'
										},
										{
											label: 'Assigned - Fact Finding',
											value: 'Assigned - Fact Finding',
											key: 'Assigned - Fact Finding'
										},
										{ label: 'Awaiting Review', value: 'Awaiting Review', key: 'Awaiting Review' },
										{ label: 'Closed - No Hit', value: 'Closed - No Hit' },
										{ label: 'Closed - Management Review', value: 'Closed - Management Review' },
										{ label: 'Closed - Transmitted', value: 'Closed - Transmitted' },
										{ label: 'Closed - Account Suspended', value: 'Closed - Account Suspended' },
										{
											label: 'Closed - Account Placed under imposed Restriction',
											value: 'Closed - Account Placed under imposed Restriction'
										},
										{
											label: 'Closed - Account Blocked, Customer T&C violation',
											value: 'Closed - Account Blocked, Customer T&C violation'
										}
									]}
									value={formik.values.Status || null}
								/>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={24}>
							<Form.Item
								id="Manager"
								help={formik.errors['Manager'] ? formik.errors['Manager'] : ''}
								// hasFeedback={formik.errors['Manager'] ? true : false}
								validateStatus={formik.errors['Manager'] ? 'error' : ''}
								label="Assigned To"
								required>
								<Select
									id="Manager"
									placeholder="Select Risk Manager"
									onChange={e => formik.setFieldValue('Manager', e)}
									options={[
										{ label: 'Risk Manager 1', value: 'Risk Manager 1', key: 'Risk Manager 1' },
										{ label: 'Risk Manager 2', value: 'Risk Manager 2', key: 'Risk Manager 2' }
									]}
									value={formik.values.Manager || null}
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

export default RiskModal;
