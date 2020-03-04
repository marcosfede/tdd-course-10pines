import { Catalog } from './catalog'
import { Book } from './book'
import { BookNotInCatalog } from '../../exceptions'

describe('Cart', () => {
  beforeEach(() => {})

  it('create and check for books', async () => {
    const catalog = new Catalog([{ isbn: '123', price: 10 }])
    expect(catalog.contains(new Book('123'))).toBe(true)
    expect(catalog.contains(new Book('321'))).toBe(false)
  })

  it('get the book price', async () => {
    const catalog = new Catalog([{ isbn: '123', price: 10 }])
    expect(catalog.getPrice(new Book('123'))).toEqual(10)
  })

  it('throw when checking price not in catalog', async () => {
    const catalog = new Catalog([{ isbn: '123', price: 10 }])
    const shouldRaise = () => catalog.getPrice(new Book('321'))
    expect(shouldRaise).toThrow(BookNotInCatalog)
  })
})
