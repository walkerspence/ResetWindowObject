import { screen, render, fireEvent } from '@testing-library/react'
import { useEffect, useRef } from 'react'

const wait = (duration = 0) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const MyComponent = ({ set }) => {
  const divRef = useRef(undefined)

  useEffect(() => {
    if (set) {
      window.something = 'hi';
      document.something = 'hello'

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

      const myDiv = document.createElement('div')
      myDiv.setAttribute('data-testid', 'created-element')

      document.body.appendChild(myDiv)
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
    expect(document.something).toEqual('hello')
    screen.getByTestId('created-element')
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
    await wait(1000); // makes errors less likely to be hidden by RTL cleanup
    console.log('----------------------------END --------------------------');

  })

  test('my test 2', async () => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
    console.log('--------------------------TEST 2--------------------------');
    render(<MyComponent set={false} />)
    screen.getByText('Hello World')
    expect(window.something).toEqual(undefined)
    expect(document.something).toEqual(undefined)
    expect(screen.queryByTestId('created-element')).toEqual(null)
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
    await wait(1000); // makes errors less likely to be hidden by RTL cleanup
    console.log('----------------------------END --------------------------');
  })
})