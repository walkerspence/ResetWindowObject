import { screen, render } from '@testing-library/react'
import { useEffect } from 'react'

const MyComponent = ({ set }) => {
  useEffect(() => {
    if (set) {
      window.something = 'hi';
    }
  }, [set])

  return <div>Hello World</div>
}

describe('my describe', () => {
  test('my test', () => {
    render(<MyComponent set={true} />)
    expect(window.something).toEqual('hi')
    screen.getByText('Hello World')
  })

  test('my test', () => {
    render(<MyComponent set={false} />)
    expect(window.something).toEqual(undefined)
    screen.getByText('Hello World')
  })
})