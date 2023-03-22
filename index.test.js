describe('my describe', () => {
  test('my test', () => {
    window.something = 'hi';
    expect(window.something).toEqual('hi')
  })

  test('my test', () => {
    expect(window.something).toEqual(undefined)
  })
})