# Contributing to Express Production Starter

We welcome contributions from the community! This guide will help you get started.

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Guidelines](#guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Reporting Issues](#reporting-issues)

---

## 📜 Code of Conduct

### **Our Pledge**
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

### **Standards**
- Use welcoming and inclusive language
- Respect different viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

---

## 🚀 Getting Started

### **1. Fork the Repository**
```bash
# Fork on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/express-production-starter.git
cd express-production-starter
```

### **2. Set Up Development Environment**
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### **3. Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

---

## 💡 How to Contribute

### **1. Report Bugs**
- Use GitHub Issues
- Provide detailed information
- Include steps to reproduce
- Add environment details

### **2. Suggest Features**
- Open an issue with "Feature Request" label
- Describe the use case
- Explain why it's valuable
- Consider implementation details

### **3. Submit Code**
- Fix existing issues
- Add new features
- Improve documentation
- Optimize performance

### **4. Improve Documentation**
- Fix typos
- Add examples
- Improve explanations
- Translate to other languages

---

## 📝 Guidelines

### **Code Style**
- Use ESLint configuration
- Follow existing patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### **Commit Messages**
```
type(scope): description

Examples:
feat(auth): add 2FA support
fix(db): resolve connection leak
docs(readme): update installation guide
```

### **Testing**
- Write tests for new features
- Ensure all tests pass
- Test edge cases
- Update documentation

### **Security**
- Never commit secrets
- Use environment variables
- Follow security best practices
- Report security issues privately

---

## 🔄 Pull Request Process

### **1. Before Submitting**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

### **2. Submitting PR**
1. Push to your fork
2. Create pull request
3. Fill out PR template
4. Link related issues
5. Request reviews

### **3. PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### **4. After Submission**
- Respond to feedback promptly
- Make requested changes
- Keep PR up to date
- Be patient with reviews

---

## 🐛 Reporting Issues

### **Bug Report Template**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 20.04]
- Node.js: [e.g., 18.17.0]
- PostgreSQL: [e.g., 14.5]

## Additional Context
Screenshots, logs, etc.
```

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you thought of

## Additional Context
Examples, mockups, etc.
```

---

## 🏆 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors graph
- Special thanks in documentation

---

## Getting Help

- Create an issue for questions
- Join our discussions
- Check existing issues
- Read documentation
- Contact: yashnevase2727@gmail.com

---

Thank you for contributing!
