"use server";

const brevo = require("@getbrevo/brevo");

export async function sendEmail({
  to,
  subject,
  content,
  replyTo,
  templateId,
  attachments,
  params,
}) {
  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const email = new brevo.SendSmtpEmail();
  email.to = to;
  email.subject = subject;
  email.htmlContent = content;
  email.replyTo = replyTo;
  email.templateId = templateId;
  email.attachment = attachments;
  email.params = params;

  try {
    const response = await apiInstance.sendTransacEmail(email);
    if (response.code !== "success") {
      return true;
    }
    return false;
  } catch (error) {
    console.error("error_while_sending_email:", error);
    return false;
  }
}
