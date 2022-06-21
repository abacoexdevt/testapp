exports.environment = process.env.CUSTOM_ENV;

exports.apiUrl = {
	development: 'https://coex-api.herokuapp.com/',
	sandbox: 'https://coex-api.herokuapp.com/',
	staging: 'https://coex-api.herokuapp.com/',
	production: 'https://coexapi.herokuapp.com/'
};

// this will be inputed in bashrc to update the bashrc enter in terminal nano ~/.bashrc
// export NODE_ENV=development
// export CUSTOM_ENV=development
// export WITH_CRON=true
