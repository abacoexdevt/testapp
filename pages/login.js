import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { Form, Input, Button, Checkbox, message } from 'antd';
import styles from '../styles/Login.module.scss';
import 'antd/dist/antd.css';
import * as yup from 'yup';
// import { auth } from '../sdk';

const Login = ({ application = 'AML Portal', title, keywords, description }) => {
	const router = useRouter();
	const initialValues = { emailAddress: '', password: '', rememberMe: false };

	const validationSchema = yup.object().shape({
		emailAddress: yup.string().email('Email Address must be a valid email.').required('Email Address is required.'),
		password: yup.string().required('Password is required.')
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues,
		validationSchema,
		onSubmit: async values => {
			try {
				// const response = await auth.loginWithEmail(values);
				console.log('values', values);
				window.location = '/';
				// message.success(response.message);
			} catch (error) {
				console.log(error);
				message.error(error.message);
			}
		}
	});

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="keywords" content={keywords} />
				<meta name="description" content={description} />
				<meta charSet="utf-8" />
				<link rel="icon" href="/coexstaricon.ico" />
				<title>{title}</title>
			</Head>
			<div className={styles.loginPage}>
				<div className={styles.loginForm}>
					<div className={styles.loginHeader}>
						<div className={styles.logo}>
							<Image
								src="https://info.coexph.com/wp-content/uploads/2020/09/coexstar_logo_og.png"
								alt="Coexstar PH"
								width={350}
								height={75}
							/>
						</div>
						<div className={styles.appTitle}>
							<h1>{`${application}`}</h1>
						</div>
					</div>

					<Form layout="vertical" requiredMark={true} onFinish={formik.handleSubmit} autoComplete="off">
						<Form.Item
							id="emailAddress"
							help={formik.errors['emailAddress'] ? formik.errors['emailAddress'] : ''}
							validateStatus={formik.errors['emailAddress'] ? 'error' : ''}
							label="Email Address"
							required>
							<Input
								id="emailAddress"
								placeholder="Email Address"
								onChange={formik.handleChange}
								value={formik.values.EmailAddress}
							/>
						</Form.Item>
						<Form.Item
							id="password"
							help={formik.errors['password'] ? formik.errors['password'] : ''}
							validateStatus={formik.errors['password'] ? 'error' : ''}
							label="Password"
							required>
							<Input.Password
								id="password"
								placeholder="Password"
								onChange={formik.handleChange}
								value={formik.values.Password}
							/>
						</Form.Item>

						<Form.Item name="remember" valuePropName="checked">
							<Checkbox>Remember me</Checkbox>
						</Form.Item>

						<Form.Item>
							<Button className={styles.btnSubmit} type="primary" htmlType="submit">
								Login
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</>
	);
};

export async function getServerSideProps() {
	return { props: { title: 'AML Portal | Coexstar PH', keywords: 'AMLC', description: 'AMLC Portal' } };
}

export default Login;
