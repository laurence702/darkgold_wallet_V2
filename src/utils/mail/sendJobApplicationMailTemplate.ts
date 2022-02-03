export const sendJobApplicationMailTemplate = async (
  name: string,
  title: string,
): Promise<any> => {
  return (
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>` +
    title +
    `</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <style type="text/css">
        a[x-apple-data-detectors] {color: inherit !important;}
    </style>

    </head>
    <body style="margin: 0; padding: 0;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
        <td style="padding: 15px 0 20px 0;">

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #83c324;">
    <tr>
        <td align="center" bgcolor=#282D62 style="padding: 20px 0 15px 0;">
        <img width="400" height="80" style="display: block;" />
        </td>
    </tr>
    <tr>
        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
            <td style="color: #153643; font-family: Arial, sans-serif;">
                <h1 style="font-size: 12px; margin: 0;"> Hello ` +
    name +
    `, </h1>
            </td>
            </tr>
            <tr>
            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 12px; line-height: 24px; padding: 20px 0 30px 0;">
                Congratulations! We received your application and look forward to reviewing it as soon as we can. Keep an eye out for an email from a member of the Cloudticians team!.
            </td>
            </tr>
            <tr>
            <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td width="260" valign="top">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                        <tr> </tr>
                        <tr>
                        <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 25px 0 0 0;"><p style="margin: 0;">Warm Regards, Dr. Lucky</p></td>
                        </tr>
                    </table>
                    </td>
    </tr>
                </table>
            </td>
            </tr>
        </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#83c324" style="padding: 30px 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
            <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;"><p style="margin: 0;">&reg; Cloudticians<br />
            </p></td>
            <td align="right">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                    <td>
                    <a href="http://www.twitter.com/">
                        
                    </a>
                    </td>
                    <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                    <td>
                    <a href="http://www.twitter.com/">
                        
                    </a>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </td>
    </tr>
    </table>

        </td>
        </tr>
    </table>
    </body>
    </html>`
  );
};
