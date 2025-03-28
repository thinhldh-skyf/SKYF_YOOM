import { EmailTemplate } from "@/components/ui/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body;

    const data = await resend.emails.send({
      from: "SKYTutor <skyf@gmail.com>",
      to: [`${email}`],
      subject: "Bạn được mời tham gia cuộc họp trên SKYTutor",
      react: EmailTemplate({ firstName: name }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
