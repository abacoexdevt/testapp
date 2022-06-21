import React, { useState } from 'react';
import { Layout } from 'antd';

import Meta from './meta';
import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';

const { Content } = Layout;

const Wrapper = ({ children, title }) => {
	const [collapsed, setCollapsed] = useState(false);
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};
	return (
		<>
			<Meta title={title} />
			<Layout>
				<Sidebar collapsed={collapsed} />
				<Layout>
					<Header title={title} collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
					<Content style={{ margin: '15px' }}>
						<div className="site-layout-background" style={{ padding: 10, minHeight: '80vh' }}>
							{children}
						</div>
					</Content>
					<Footer />
				</Layout>
			</Layout>
		</>
	);
};

export default Wrapper;
