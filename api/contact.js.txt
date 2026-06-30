import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Allow only POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {
        const {
            name,
            email,
            phone,
            company,
            message
        } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Email validation
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        // Send email
        await resend.emails.send({

            from: "Indiquad <noreply@indiquad.com>",

            to: [
                "contact@indiquad.com"
            ],

            replyTo: email,

            subject: `New Website Enquiry - ${name}`,

            html: `
                <h2>New Contact Form Submission</h2>

                <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">

                    <tr>
                        <td><strong>Name</strong></td>
                        <td>${name}</td>
                    </tr>

                    <tr>
                        <td><strong>Email</strong></td>
                        <td>${email}</td>
                    </tr>

                    <tr>
                        <td><strong>Phone</strong></td>
                        <td>${phone || "-"}</td>
                    </tr>

                    <tr>
                        <td><strong>Company</strong></td>
                        <td>${company || "-"}</td>
                    </tr>

                    <tr>
                        <td><strong>Message</strong></td>
                        <td>${message}</td>
                    </tr>

                </table>

                <br>

                <small>
                Submitted from www.indiquad.com
                </small>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Thank you! Your enquiry has been submitted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to send email."
        });

    }
}