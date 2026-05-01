const baseUrl = process.env.BASE_URL;
const transferUrl = `${window.location.origin}${baseUrl}/#/${window.location.pathname.slice(`${baseUrl}`.length + 1)}`;
location.replace(transferUrl);
