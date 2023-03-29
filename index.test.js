import { screen, render, fireEvent, within } from '@testing-library/react'
import { useEffect, useRef } from 'react'
import { inspect } from 'util'

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

      const myBodyDiv = document.createElement('div')
      myBodyDiv.setAttribute('data-testid', 'created-body-element')
      const myHeadDiv = document.createElement('div')
      myHeadDiv.setAttribute('data-testid', 'created-head-element')

      // const myScript = document.createElement('script')
      // myScript.setAttribute('data-testid', 'created-script')
      // myScript.type = 'text/javascript';
      // myScript.src = 'https://gist.githubusercontent.com/walkerspence/0ca32159641a1a19e1f7392cfcfeb1bd/raw/85d0d64e9375fd9953a5f7a29722871da86a4df6/test.js'

      // document.head.appendChild(myScript)
      document.body.appendChild(myBodyDiv)
      document.head.appendChild(myHeadDiv)
    }
  }, [set])

  return <div ref={divRef}>Hello World</div>
}

describe('my describe',  () => {
  test.only('with set=true, modifies document and window with appendChild, addEventListener and new keys',async () => {
    console.log('--------------------------TEST 1--------------------------');
    render(<MyComponent set={true} />)
    screen.getByText('Hello World')
    expect(window.something).toEqual('hi')
    expect(document.something).toEqual('hello')
    screen.getByTestId('created-body-element')
    within(document.head).getByTestId('created-head-element')
    // within(document.head).getByTestId('created-script')
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

  test.only('with set=false, does not carry over any document/window modifications', async () => {
    console.log('--------------------------TEST 2--------------------------');
    render(<MyComponent set={false} />)
    screen.getByText('Hello World')
    expect(window.something).toEqual(undefined)
    expect(document.something).toEqual(undefined)
    expect(screen.queryByTestId('created-body-element')).toEqual(null)
    expect(within(document.head).queryByTestId('created-head-element')).toEqual(null)
    expect(within(document.head).queryByTestId('created-script')).toEqual(null)
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

  // test.only('with set=true, does not collide with script from previous run',async () => {
  //   console.log('--------------------------TEST 3--------------------------');
  //   console.log('initial', document.documentElement.innerHTML)
  //   render(<MyComponent set={true} />)
  //   within(document.head).getByTestId('created-script') // will fail if >1 match is found
  //   await wait(1000); // makes errors less likely to be hidden by RTL cleanup
  //   console.log('----------------------------END --------------------------');
  // })
})