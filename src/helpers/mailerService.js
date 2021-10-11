import * as nodemail from 'nodemailer'

const transporter = nodemail.createTransport(({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.PASSWORD
    }
}))

export const sendVerificationMail = async (toEmail, text) => {
    try {
        const mailOptions = {
            from: 'Watch This Prototype',
            to: toEmail,
            subject: 'Account verification for WatchThis',
            text:  text
        }
        transporter.sendMail(mailOptions)
        return true
    } catch(error) {
        console.log('mailer error', error)
        return false
    }
}