import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactFormEmailProps {
  name: string;
  email: string;
  primaryCooperative: string;
  subject: string;
  message: string;
}

export const ContactFormEmail = ({
  name,
  email,
  primaryCooperative,
  subject,
  message,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <div style={header}>
            <Heading style={h1}>New Contact Form Submission</Heading>
            <Text style={headerSubtext}>FEDCOOP Website Contact Form</Text>
          </div>

          {/* Content */}
          <div style={content}>
            <Text style={paragraph}>
              You have received a new message from the FEDCOOP website contact
              form.
            </Text>

            <Hr style={hr} />

            {/* Contact Information */}
            <Section style={infoSection}>
              <Text style={label}>Name</Text>
              <Text style={value}>{name}</Text>
            </Section>

            <Section style={infoSection}>
              <Text style={label}>Email</Text>
              <Text style={valueLink}>
                <a href={`mailto:${email}`} style={link}>
                  {email}
                </a>
              </Text>
            </Section>

            <Section style={infoSection}>
              <Text style={label}>Primary Co-operative</Text>
              <Text style={value}>{primaryCooperative}</Text>
            </Section>

            <Section style={infoSection}>
              <Text style={label}>Subject</Text>
              <Text style={value}>{subject}</Text>
            </Section>

            <Hr style={hr} />

            {/* Message */}
            <Section style={messageSection}>
              <Text style={label}>Message</Text>
              <div style={messageBox}>
                <Text style={messageText}>{message}</Text>
              </div>
            </Section>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footerText}>
              💡 <strong>Quick Tip:</strong> Reply directly to{" "}
              <span style={{ color: "#2563eb", fontWeight: "500" }}>
                {email}
              </span>{" "}
              to respond to this inquiry.
            </Text>
          </div>

          {/* Footer Section */}
          <div style={footer}>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Federation of Federal Cooperatives
              (FEDCOOP)
            </Text>
            <Text style={footerAddress}>
              Federal Secretariat Complex, Phase 1, Abuja, FCT, Nigeria
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const header = {
  backgroundColor: "#2563eb",
  padding: "32px 40px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  lineHeight: "1.3",
};

const headerSubtext = {
  color: "#dbeafe",
  fontSize: "14px",
  margin: "8px 0 0 0",
};

const content = {
  padding: "32px 40px",
};

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const infoSection = {
  marginBottom: "16px",
};

const label = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const value = {
  color: "#111827",
  fontSize: "16px",
  margin: "0 0 16px",
  lineHeight: "24px",
};

const valueLink = {
  color: "#2563eb",
  fontSize: "16px",
  margin: "0 0 16px",
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
};

const messageSection = {
  marginBottom: "24px",
};

const messageBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  border: "1px solid #e5e7eb",
  marginTop: "8px",
};

const messageText = {
  color: "#111827",
  fontSize: "16px",
  lineHeight: "28px",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  fontStyle: "italic" as const,
  margin: "0",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "24px 40px",
  borderTop: "1px solid #e5e7eb",
};

const footerCopyright = {
  color: "#6b7280",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "0",
};

const footerAddress = {
  color: "#6b7280",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "4px 0 0",
};

export default ContactFormEmail;
