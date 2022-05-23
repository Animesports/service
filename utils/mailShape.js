import { currency, month } from "./converter.js";

export function WinnerNotification({ data, season, award, position }) {
  const p = position;
  const n = data.name.split(" ")[0];
  const a = currency().get(award);
  const m = month(season);
  return {
    text: ` 
        Animesports.cf
        ---
        ${n}, parabéns!
        Você ficou em ${p}° lugar na temporada de ${m} e conquistou o prêmio de ${a}. O valor será enviado para sua chave PIX registrada em até 5 dias úteis. 
        ---
        © animesports.cf`,
    html: ` <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;800;900&display=swap); font-family: Poppins, 'Karla', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <a href="https://animesports.cf/" title="logo" target="_blank">
                                <img height="70" src="https://github.com/Animesports/animesports/blob/main/public/email-logo.png?raw=true" title="Animesports" alt="Animesports">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:400; margin:0;font-size:32px;font-family: Poppins,sans-serif;">${n}, parabéns!</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                               Você ficou em <strong>${p}° lugar</strong> na temporada de <strong>${m}</strong> e conquistou o prêmio de <strong>${a}</strong>. O valor será enviado para sua chave PIX registrada em até 5 dias úteis. 
                                            </p>
    
    
    
                                            
                                             
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        
                        <tr>
                            <td style="text-align:center;">
                                <a  href="https://animesports.cf/" target="_blank" style="text-decoration: none !important;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>animesports.cf</strong></p></a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!-- CREDITS: RaKesh Mandal https://codepen.io/rKalways/pen/VwwQKpV -->
      </body>`,
  };
}

export function TokenValidation(token) {
  return {
    text: `
    Animesports.cf
    ---
    Confirmação de email
    Cole o link abaixo no navegador para prosseguir com a validação. Este meio é exclusivo, expira em 10 minutos e não deve ser compartilhado com ninguém.
    ---
    https://animesports.cf/api/validation/email/${token}
    ---
    © animesports.cf`,
    html: `
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;800;900&display=swap); font-family: Poppins, 'Karla', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="https://animesports.cf/" title="logo" target="_blank">
                            <img height="70" src="https://github.com/Animesports/animesports/blob/main/public/email-logo.png?raw=true" title="Animesports" alt="Animesports">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:400; margin:0;font-size:32px;font-family: Poppins,sans-serif;">Confirmação de email</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            Clique no <strong>botão</strong> ou cole o <strong>link</strong> abaixo no navegador para prosseguir com a validação. Este meio é exclusivo, <strong>expira em 10 minutos</strong> e não deve ser compartilhado com ninguém.
                                        </p>
                                        <a href="https://animesports.cf/api/validation/email/${token}"
                                            style="background: #2c9ed6;font-weight:700; margin-top:35px; color:#fff;text-transform:uppercase; font-size:20px;padding:10px 24px;display:inline-block;border-radius:5px;text-decoration:none;">
                                           Confirmar
                                        </a>
                                         <p style="margin-top:35px;color:#455056; font-size:9px;line-height:12px;">
                                           https://animesports.cf/api/validation/email/${token}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    
                    <tr>
                        <td style="text-align:center;">
                            <a  href="https://animesports.cf/" target="_blank" style="text-decoration: none !important;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>animesports.cf</strong></p></a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!-- CREDITS: RaKesh Mandal https://codepen.io/rKalways/pen/VwwQKpV -->
  </body>
    `,
  };
}
export function CodeValidation(code) {
  return {
    text: `
      Animesports.cf
      ---
      Confirmação de endereço de email.
      Utilize o código abaixo na página em que foi solicitado para prosseguir com a validação. Este código é exclusivo, expira em 10 minutos e não deve ser compartilhado com ninguém.
      ---
      Código: ${code}
      ---
      © animesports.cf
    `,
    html: `
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;700;800;900&display=swap); font-family: Poppins, 'Karla', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="https://animesports.cf/" title="logo" target="_blank">
                            <img height="70" src="https://github.com/Animesports/animesports/blob/main/public/email-logo.png?raw=true" title="Animesports" alt="Animesports">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:400; margin:0;font-size:32px;font-family: Poppins,sans-serif;">Confirmação de email</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            Utilize o código abaixo na página em que foi solicitado para prosseguir com a validação. Este código é exclusivo, <strong>expira em 10 minutos</strong> e não deve ser compartilhado com ninguém.
                                        </p>
                                        <span href="javascript:void(0);"
                                            style="background: #2c9ed6;font-weight:700; margin-top:35px; color:#fff;text-transform:uppercase; font-size:20px;padding:10px 24px;display:inline-block;border-radius:5px;">
                                            ${code}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <a  href="https://animesports.cf/" target="_blank" style="text-decoration: none !important;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>animesports.cf</strong></p></a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!-- CREDITS: RaKesh Mandal https://codepen.io/rKalways/pen/VwwQKpV -->
  </body>
  `,
  };
}
