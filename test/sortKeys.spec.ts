import { compareStrings, EntityContentItemReference, sortKeys } from '../src/ADR32.js'

const RHS = -1
const LHS = 1
const EQ = 0

const suite: [string, string, number][] = [
  ['a', 'a', EQ],
  ['a', '', LHS],
  ['', '', EQ],
  ['', 'a', RHS],
  ['a', 'b', RHS],
  ['b', 'b', EQ],
  ['b', 'a', LHS],
  ['aa', 'a', LHS],
  ['aa', 'ab', RHS],
  ['ab', 'ab', EQ],
  ['a', 'ab', RHS]
]

describe('sorting keys', () => {
  suite.forEach(([a, b, n]) => it(`compare(${a}, ${b}) == ${n}`, () => expect(compareStrings(a, b)).toEqual(n)))
  suite.forEach(([a, b, n]) =>
    it(`compare(${a}, ${b}) == node(a > b)`, () => expect(compareStrings(a, b)).toEqual(a == b ? 0 : a > b ? 1 : -1))
  )

  it('sanity 1', () => {
    const init: EntityContentItemReference[] = [
      {
        file: 'a',
        hash: 'QmA'
      },
      {
        file: 'b',
        hash: 'QmB'
      },
      {
        file: 'c',
        hash: 'QmC'
      }
    ].sort(sortKeys)

    expect(init.map(($) => $.file)).toEqual(['a', 'b', 'c'])
    expect(init.map(($) => $.hash)).toEqual(['QmA', 'QmB', 'QmC'])
  })

  it('sanity 2', () => {
    const init: EntityContentItemReference[] = [
      {
        file: 'c',
        hash: 'QmC'
      },
      {
        file: 'b',
        hash: 'QmB'
      },
      {
        file: 'a',
        hash: 'QmA'
      }
    ].sort(sortKeys)

    expect(init.map(($) => $.file)).toEqual(['a', 'b', 'c'])
    expect(init.map(($) => $.hash)).toEqual(['QmA', 'QmB', 'QmC'])
  })

  it('sanity 3', () => {
    const init: EntityContentItemReference[] = [
      {
        file: 'a',
        hash: 'QmC'
      },
      {
        file: 'a',
        hash: 'QmB'
      },
      {
        file: 'a',
        hash: 'QmA'
      }
    ].sort(sortKeys)

    expect(init.map(($) => $.file)).toEqual(['a', 'a', 'a'])
    expect(init.map(($) => $.hash)).toEqual(['QmA', 'QmB', 'QmC'])
  })

  it('a', () => {
    expect(sortKeys({ file: 'aaaa', hash: 'aaaa' }, { file: 'aaaa', hash: 'aaaa' })).toEqual(0)
    expect(sortKeys({ file: 'aaaa', hash: 'aaaa' }, { file: 'bbbb', hash: 'bbbb' })).toEqual(-1)
    expect(sortKeys({ file: 'bbbb', hash: 'bbbb' }, { file: 'aaaa', hash: 'aaaa' })).toEqual(1)
    expect(sortKeys({ file: 'aaaa', hash: 'bbbb' }, { file: 'aaaa', hash: 'aaaa' })).toEqual(1)
    expect(sortKeys({ file: 'aaaa', hash: 'a' }, { file: 'aaaa', hash: 'a' })).toEqual(0)
    expect(sortKeys({ file: 'aaab', hash: 'a' }, { file: 'aaaa', hash: 'a' })).toEqual(1)
    expect(sortKeys({ file: 'aaaa', hash: 'aaaa' }, { file: 'bbbb', hash: 'bbbb' })).toEqual(-1)
    expect(sortKeys({ file: 'bbbb', hash: 'bbbb' }, { file: 'aaaa', hash: 'aaaa' })).toEqual(1)
    expect(sortKeys({ file: 'aaaa', hash: 'bbbb' }, { file: 'aaaa', hash: 'aaaa' })).toEqual(1)
  })
})
