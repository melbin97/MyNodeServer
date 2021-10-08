import * as nodemail from 'nodemailer'

const transporter = nodemail.createTransport(({
    service: 'gmail',
    auth: {
        user: 'watchthisprototype@gmail.com',
        pass: 'MacBook@97'
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