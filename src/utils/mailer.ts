import config from '../config/config';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: config.EMAIL_HOST,
  auth: {
    user: config.EMAIL_FROM_ADDRESS,
    pass: config.EMAIL_PASSWORD,
  },
  port: config.EMAIL_PORT,
});

export default transport;
