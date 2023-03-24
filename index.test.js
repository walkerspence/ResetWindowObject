import { screen, render, fireEvent } from '@testing-library/react'
import { useEffect, useRef } from 'react'

const wait = (duration = 0) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const MyComponent = ({ set }) => {
  const divRef = useRef(undefined)

  useEffect(() => {
    if (set) {
      window.something = 'hi';

      window.addEventListener('click', () => {
        console.log('clicked window')
        if (!divRef.current) {
          throw new Error('No value for .current on divRef in the window listener. This probably means the listener persisted from a previous test case and the div has since been unmounted.')
        }
        divRef.current.setAttribute('clicked-window', 'true')
      });

      document.addEventListener('click', () => {
        console.log('clicked document')
        if (!divRef.current) {
          throw new Error('No value for .current on divRef in the document listener. This probably means the listener persisted from a previous test case and the div has since been unmounted.')
        }
        divRef.current.setAttribute('clicked-document', 'true')
      });
    }
  }, [set])

  return <div ref={divRef}>Hello World</div>
}

describe('my describe',  () => {
  test('my test 1',async () => {
    console.log('--------------------------TEST 1--------------------------');
    render(<MyComponent set={true} />)
    screen.getByText('Hello World')
    expect(window.something).toEqual('hi')

    fireEvent(
      window,
      new MouseEvent('click', {
        bubbles: false,
        cancelable: true,
      }),
    )
    fireEvent(
      document,
      new MouseEvent('click', {
        bubbles: false,
        cancelable: true,
      }),
    )
    expect(screen.getByText('Hello World').getAttribute('clicked-window')).toEqual('true')
    expect(screen.getByText('Hello World').getAttribute('clicked-document')).toEqual('true')
    console.log('----------------------------END --------------------------');

  })

  test('my test 2', async () => {
    console.log('--------------------------TEST 2--------------------------');
    render(<MyComponent set={false} />)
    screen.getByText('Hello World')
    expect(window.something).toEqual('hi') // BAD

    fireEvent(
      window,
      new MouseEvent('click', {
        bubbles: false,
        cancelable: true,
      }),
    )
    fireEvent(
      document,
      new MouseEvent('click', {
        bubbles: false,
        cancelable: true,
      }),
    )
    expect(screen.getByText('Hello World').getAttribute('clicked-window')).toEqual(null)
    expect(screen.getByText('Hello World').getAttribute('clicked-document')).toEqual(null)
    console.log('----------------------------END --------------------------');
  })
})