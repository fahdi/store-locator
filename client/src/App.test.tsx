import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders BlueSky Store Locator heading', () => {
    render(<App />)
    const heading = screen.getByText(/BlueSky Store Locator/i)
    expect(heading).toBeInTheDocument()
  })

  it('shows development setup indicators', () => {
    render(<App />)
    expect(screen.getByText(/React \+ TypeScript/i)).toBeInTheDocument()
    expect(screen.getByText(/Vite \+ Tailwind CSS/i)).toBeInTheDocument()
    expect(screen.getByText(/Modern Development Setup/i)).toBeInTheDocument()
  })
})