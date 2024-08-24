import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API);
export const sendEmailVerification = (token) => {
     const url = `http://localhost:3000/auth/verify-email?token=${token.token}`;
     return resend.emails.send({
          from: "onboarding@resend.dev",
          to: token.email,
          subject: "Վերիֆիկացնել ձեր էլ․ Փոստի հասցեն",
          html: `
               <h1 style="color: #002a4f">Վերիֆիկացնել ձեր հաշիվը</h1>
               <p>Բարև ${token.name.split(' ')[0]}, Մենք ուրախ ենք "Հարց" հավելվածում գրանցվելու համար։ Ուսումնասիրելու և գիտելիքդ փորձելու համար խնդրում ենք հաստատել ձեր էլ․ փոստի հասցեն</p>
               <a href="${url}">Վերիֆիկացնել</a>
               <p>Կամ Պատճենել այս հղումը՝ <a href="${url}">${url}</a></p>
          `
     })
}
export const sendPasswordReset = (name,email,token) => {
     const url = `http://localhost:3000/auth/reset-password/${token}?email=${email}`;
     return resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Գաղտնաբառի վերականգնում",
          html: `
               <h1 style="color: #002a4f">Գաղտնաբառի վերականգնում</h1>
               <p>Բարև ${name.split(' ')[0]}, Ոնց որ դու մոռացել ես գաղտնաբառը։ Եթե այո, սեղմել այս հղումը՝</p>
               <a href="${url}">Վերականգնել</a>
               <p>Կամ Պատճենել այս հղումը՝ <a href="${url}">${url}</a></p>
               <p>Եթե հիշում ես գաղտնաբառը, դու կարող ես անտեսել այս նամակը</p>
          `
     })
}