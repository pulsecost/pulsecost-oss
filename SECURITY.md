# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

Report security vulnerabilities through public GitHub issues.

### What to Include

When reporting a security vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if you have them)
- Your contact information (optional)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Initial Response**: We will provide an initial response within 72 hours
- **Regular Updates**: We will keep you informed of our progress
- **Resolution**: We will work to resolve the issue as quickly as possible

### Responsible Disclosure

We follow responsible disclosure practices:

1. **Confidentiality**: We will keep your report confidential until the issue is resolved
2. **Timeline**: We aim to resolve critical issues within 30 days
3. **Credit**: We will credit you in our security advisories (unless you prefer to remain anonymous)
4. **Coordination**: We will coordinate with you on the disclosure timeline

### Security Best Practices

When using OptiLM, please follow these security best practices:

#### API Security

- **Use HTTPS**: Always use HTTPS in production
- **API Keys**: Keep your API keys secure and rotate them regularly
- **Environment Variables**: Store sensitive configuration in environment variables
- **Network Security**: Use proper firewall rules and network segmentation

#### Database Security

- **Authentication**: Use strong database credentials
- **Encryption**: Enable encryption at rest and in transit
- **Access Control**: Limit database access to necessary services only
- **Backups**: Regular backups with proper encryption

#### Application Security

- **Dependencies**: Keep all dependencies up to date
- **Input Validation**: Validate all inputs
- **Error Handling**: Don't expose sensitive information in error messages
- **Logging**: Log security events appropriately

### Security Features

OptiLM includes several security features:

- **Input Validation**: All API inputs are validated using Zod schemas
- **Error Handling**: Secure error handling that doesn't expose sensitive information
- **Logging**: Comprehensive logging for security monitoring
- **CORS**: Configurable CORS settings
- **Helmet**: Security headers using Helmet.js

### Known Security Considerations

- **API Keys**: OptiLM handles API keys for LLM providers - ensure these are stored securely
- **Database**: The application stores request/response data - ensure your database is properly secured
- **Network**: The proxy nature means all traffic flows through OptiLM - ensure proper network security

### Security Updates

We will announce security updates through:

- GitHub Security Advisories
- Release notes
- Email notifications (for critical issues)

### Contact

For security-related questions or concerns, please contact:

- **Email**: security@pulsecost-oss.dev
- **GitHub**: Open a private security issue (if available)

### Acknowledgments

We thank the security researchers and community members who help keep OptiLM secure through responsible disclosure.
