import React from 'react';
import { Avatar, Button, Dropdown, Layout, Menu, PageHeader } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Link from 'next/link';
const { Header } = Layout;

const header = ({ title = '', toggleCollapsed, collapsed }) => {
	const menu = (
		<Menu
			items={[
				{
					label: (
						<Link href="#">
							<a>Profile</a>
						</Link>
					),
					key: '0'
				},
				{
					label: (
						<Link href="/logout">
							<a>Sign Out</a>
						</Link>
					),
					key: '1'
				}
			]}
		/>
	);

	return (
		<>
			<Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
				<PageHeader
					ghost={false}
					style={{ padding: '15px 10px' }}
					title={
						<Button type="text" onClick={toggleCollapsed} style={{ margin: '0 0', padding: '0 10px' }}>
							{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						</Button>
					}
					subTitle={title}
					extra={[
						<Dropdown overlay={menu} trigger={['click']} key="userLog">
							<a onClick={e => e.preventDefault()}>
								<Avatar icon={<UserOutlined />} />
							</a>
						</Dropdown>
					]}
				/>
			</Header>
		</>
	);
};
export default header;
