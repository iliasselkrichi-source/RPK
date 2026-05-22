export const baseTemplate = (content, lang = 'nl') => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
        .header { border-bottom: 2px solid #2dd4bf; padding-bottom: 10px; margin-bottom: 20px; }
        .footer { font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Fleetconnect</h2>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Fleetconnect. Fleetconnect@gmail.com
        </div>
    </div>
</body>
</html>
`;
