// import '../styles/globals.css'

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// export default MyApp
import '../styles/globals.css';
import 'antd/dist/antd.css';
import nextConfig from 'next/config';
// import { initialize } from '../sdk';
import store from '../redux/store';
import { Provider } from 'react-redux';

const { publicRuntimeConfig } = nextConfig();
const { CUSTOM_ENV: environment } = publicRuntimeConfig;

function MyApp({ Component, pageProps }) {
	// const { token } = pageProps;
	// initialize({ environment, token });

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
