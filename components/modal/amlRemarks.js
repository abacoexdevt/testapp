import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Row, Col, Select, message, Checkbox, Radio } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isEqual } from 'lodash';
import { differenceInYears } from 'date-fns';

import { create, setForm, toggle, update } from '../../redux/actions/amlRemarks';
import dayjs from 'dayjs';
import moment from 'moment';

const riskModal = ({ account }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { query } = router;
	const { modal, form, formLoading } = useSelector(
		({ aml }) => ({ modal: aml.modal, form: aml.form, formLoading: aml.formLoading }),
		isEqual
	);

	const initialValues = form
		? { ...form }
		: {
				Outcome: '',
				Reason: '',
				Remarks: '',
				OtherRemarks: '',
				Resolution: ''
		  };
	const validationSchema = yup.object().shape({
		Outcome: yup.string().required('Outcome is required.'),
		Reason: yup.string().required('Reason is required.'),
		Resolution: yup.string().required('Resolution is required.')
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues,
		validationSchema,
		onSubmit: async values => {
			try {
				console.log('values', values);
				if (form) {
					// const updatedValues = {
					// 	Id: form._id,
					// User: account.UserId,
					// 	...values
					// };
					// const response = await dispatch(update(updatedValues));
					// message.success(response.message);
				} else {
					const Values = { ...values, Case: query.id, User: account.UserId };
					console.log(Values, 'values');
					// const response = await dispatch(create(Values));
					// message.success(response.message);
				}
				// close();
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
				width={'50vw'}
				title="Aml Remarks Form"
				footer={null}
				visible={modal}
				onCancel={close}
				closable={!formLoading}>
				<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit}>
					<Row gutter={[12, 12]}>
						<Col lg={12} md={12} xs={24}>
							<Form.Item
								id="Outcome"
								help={formik.errors['Outcome'] ? formik.errors['Outcome'] : ''}
								// hasFeedback={formik.errors['Outcome'] ? true : false}
								validateStatus={formik.errors['Outcome'] ? 'error' : ''}
								label="Case Outcome:"
								required>
								<Select
									id="Outcome"
									placeholder="Outcome"
									onChange={e => formik.setFieldValue('Outcome', e)}
									options={[
										{ label: 'Case Overruled', value: 'Case Overruled' },
										{ label: 'Case Escalated', value: 'Case Escalated' },
										{ label: 'Valid Case', value: 'Valid Case' }
									]}
									value={formik.values.Outcome || null}
								/>
							</Form.Item>
						</Col>
						<Col lg={12} md={12} xs={24}>
							<Form.Item
								id="Reason"
								help={formik.errors['Reason'] ? formik.errors['Reason'] : ''}
								// hasFeedback={formik.errors['Reason'] ? true : false}
								validateStatus={formik.errors['Reason'] ? 'error' : ''}
								label="Case Reason:"
								required>
								<Select
									id="Reason"
									placeholder="Reason"
									onChange={e => formik.setFieldValue('Reason', e)}
									options={[
										{
											label: 'Insufficient / Lacking Evidence',
											value: 'Insufficient / Lacking Evidence'
										},
										{ label: 'Management Review', value: 'Management Review' },
										{ label: 'Sufficient Evidence Found', value: 'Sufficient Evidence Found' }
									]}
									value={formik.values.Reason || null}
								/>
							</Form.Item>
						</Col>
						<Col lg={24} md={24} xs={24}>
							<Form.Item
								id="Resolution"
								help={formik.errors['Resolution'] ? formik.errors['Resolution'] : ''}
								// hasFeedback={formik.errors['Resolution'] ? true : false}
								validateStatus={formik.errors['Resolution'] ? 'error' : ''}
								label="Case Resolution"
								required>
								<Select
									id="Resolution"
									placeholder="Resolution"
									onChange={e => formik.setFieldValue('Resolution', e)}
									options={[
										{ label: 'Closed - No Hit', value: 'Closed - No Hit' },
										{ label: 'Closed - Management Review', value: 'Closed - Management Review' },
										{ label: 'Closed - Transmitted', value: 'Closed - Transmitted' },
										{ label: 'Closed - Account Suspended', value: 'Closed - Account Suspended' },
										{ label: 'Imposed Limeted Access', value: 'Imposed Limeted Access' },
										{
											label: 'Closed - Account Placed under imposed Restriction',
											value: 'Closed - Account Placed under imposed Restriction'
										},
										{
											label: 'Closed - Account Blocked, Customer T&C violation',
											value: 'Closed - Account Blocked, Customer T&C violation'
										}
									]}
									value={formik.values.Resolution || null}
								/>
							</Form.Item>
						</Col>
						<Col lg={24} md={24} xs={24}>
							<Form.Item
								id="OtherRemarks"
								help={formik.errors['OtherRemarks'] ? formik.errors['OtherRemarks'] : ''}
								// hasFeedback={formik.errors['OtherRemarks'] ? true : false}
								validateStatus={formik.errors['OtherRemarks'] ? 'error' : ''}
								label="Remarks">
								<Checkbox.Group
									style={{ display: 'block', width: '100%', marginLeft: 0 }}
									id="Remarks"
									options={[
										{
											label: 'Account placed under none suspiscious',
											value: 'Account placed under none suspiscious'
										},
										{
											label: 'Abusive Customer',
											value: 'Abusive Customer'
										},
										{
											label: 'Recurring T & C Violation',
											value: 'Recurring T & C Violation'
										},
										{
											label: 'High Legal Risk',
											value: 'High Legal Risk'
										},
										{
											label: 'High Reputational Risk',
											value: 'High Reputational Risk'
										},
										{
											label: 'Watchlist Match',
											value: 'Watchlist Match'
										},
										{
											label: 'High Financial Risk',
											value: 'High Financial Risk'
										},
										{
											label: 'Delinquent Account',
											value: 'Delinquent Account'
										}
									]}
									onChange={e => {
										formik.setFieldValue('Remarks', e);
									}}
									value={formik.values['Remarks'] || []}
									defaultValue={formik.values['Remarks']}
								/>
							</Form.Item>
						</Col>
						<Col lg={24} md={24} xs={24}>
							<Form.Item
								id="OtherRemarks"
								help={formik.errors['OtherRemarks'] ? formik.errors['OtherRemarks'] : ''}
								// hasFeedback={formik.errors['OtherRemarks'] ? true : false}
								validateStatus={formik.errors['OtherRemarks'] ? 'error' : ''}
								label="Other Remarks">
								<Input
									id="OtherRemarks"
									placeholder="OtherRemarks"
									onChange={formik.handleChange}
									value={formik.values.OtherRemarks}
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

export default riskModal;
