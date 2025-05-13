# Trojan Dashboard

Trojan Dashboard is a modern, data-driven admin dashboard built with **React** and **Tailwind CSS**. It provides a comprehensive interface for managing and monitoring laptop requests within the Trojan system, along with user authentication and state management.

## Overview

This project offers a clean and responsive admin panel designed to help administrators efficiently manage and analyze laptop request data. The dashboard includes modules and components to facilitate request submission, approval workflows, and user management.

### Key Features

- Laptop Request management with submission and tracking
- User authentication and authorization
- Responsive and accessible UI built with React and Tailwind CSS
- Dark mode support
- Modular and extensible architecture with reusable UI components
- State management using a centralized store
- API service integrations for backend communication

## Installation

### Prerequisites

- Node.js 18.x or later (Node.js 20.x recommended)
- npm or yarn package manager

### Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open your browser and navigate to `http://localhost:3001` (or the port specified in your environment) to access the dashboard.

## Project Structure

- `src/pages/LaptopRequest/` - Manage laptop request submissions and tracking
- `src/pages/LoginPage/` - User authentication and login
- `src/components/` - Reusable UI components
- `src/services/` - API service integrations
- `src/store/` - State management
- `src/layout/` - Application layout components (sidebar, header, etc.)
