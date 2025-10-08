# Components Directory

This directory contains reusable React components for the BlueSky Store Locator.

## Structure

```
components/
├── auth/           # Authentication components
├── layout/         # Layout components (Header, Sidebar, etc.)
├── map/            # Map-related components
├── mall/           # Mall-specific components  
├── store/          # Store-specific components
├── common/         # Common/shared components
└── ui/             # Basic UI components (Button, Modal, etc.)
```

## Guidelines

- Each component should be in its own directory with an index.ts file
- Include TypeScript interfaces for props
- Use Tailwind CSS for styling
- Follow React best practices
- Add proper error boundaries where needed