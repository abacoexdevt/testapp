import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Image from 'next/image';
const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
	const items = [
		{
			key: 'Dashboard',
			icon: <UserOutlined />,
			label: (
				<Link href="/dashboard">
					<a>Dashboard</a>
				</Link>
			)
		},
		{
			key: 'Customers',
			icon: <UserOutlined />,
			label: (
				<Link href="/customers">
					<a>Customers</a>
				</Link>
			)
		},
		{
			key: 'Watchlist',
			icon: <UserOutlined />,
			label: (
				<Link href="/watchlist">
					<a>Watchlist</a>
				</Link>
			)
		},
		{
			key: 'Cases',
			icon: <UserOutlined />,
			label: (
				<Link href="/cases">
					<a>Cases</a>
				</Link>
			)
		},
		{
			key: 'Users',
			icon: <UserOutlined />,
			label: (
				<Link href="/users">
					<a>Users</a>
				</Link>
			)
		},
		{
			key: 'UserTypes',
			icon: <UserOutlined />,
			label: (
				<Link href="/usertypes">
					<a>User Types</a>
				</Link>
			)
		},
		{
			key: 'AMLCPortal',
			icon: <UserOutlined />,
			label: (
				<Link href="https://portal.amlc.gov.ph/amlc/">
					<a target="_blank">AMLC Portal</a>
				</Link>
			)
		},
		{
			key: 'CoexAdmin',
			icon: <UserOutlined />,
			label: (
				<Link href="https://admin.coexstar.ph/Adm/login/login.php">
					<a target="_blank">Coex Admin</a>
				</Link>
			)
		},
		{
			key: 'FATF',
			icon: <UserOutlined />,
			label: 'FATF',
			children: [
				{
					key: 'FATFDocuments',
					icon: <UserOutlined />,
					label: (
						<Link href="https://www.fatf-gafi.org/publications/virtualassets/documents/virtual-assets.html?hf=10&b=0&s=desc(fatf_releasedate)">
							<a target="_blank">FATF Documents</a>
						</Link>
					)
				},
				{
					key: 'FATFWikipedia',
					icon: <UserOutlined />,
					label: (
						<Link href="https://en.wikipedia.org/wiki/FATF_blacklist">
							<a target="_blank">FATF Wikipedia</a>
						</Link>
					)
				}
			]
		},
		{
			key: 'OFAC',
			icon: <UserOutlined />,
			label: 'OFAC',
			children: [
				{
					key: 'SanctionList',
					icon: <UserOutlined />,
					label: (
						<Link href="https://sanctionssearch.ofac.treas.gov/">
							<a target="_blank">Sanction List Search</a>
						</Link>
					)
				},
				{
					key: 'OFACSource',
					icon: <UserOutlined />,
					label: (
						<Link href="https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information">
							<a target="_blank">OFAC Source</a>
						</Link>
					)
				}
			]
		},
		{
			key: 'PEPQuestionaire',
			icon: <UserOutlined />,
			label: (
				<Link href="https://dilisense.com/en_US">
					<a target="_blank">PEP Questionaire</a>
				</Link>
			)
		}
	];

	return (
		<>
			<Sider breakpoint="lg" collapsedWidth="0" trigger={null} collapsible collapsed={collapsed}>
				<div className="logo">
					<Image
						src="https://info.coexph.com/wp-content/uploads/2020/09/coexstar_logo_og.png"
						alt="Coexstar PH"
						width={200}
						height={50}
					/>
				</div>
				<Menu theme="dark" mode="inline" defaultSelectedKeys={['0']} items={items} />
			</Sider>
		</>
	);
};
export default Sidebar;
