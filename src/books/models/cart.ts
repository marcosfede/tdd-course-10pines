import { Book } from './book'
import { BookNotInCatalog, InvalidBookQuantity } from '../../exceptions'
import { Catalog } from './catalog'

const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)

export class Cart {
  private book_map = new Map<string, number>()
  private catalog: Catalog

  constructor(catalog: Catalog) {
    this.catalog = catalog
  }

  private totalNumberOfBooks() {
    return sum([...this.book_map.values()])
  }

  public bookQuantity(book: Book) {
    return this.book_map.get(book.isbn) ?? 0
  }

  public isEmpty() {
    return this.totalNumberOfBooks() === 0
  }

  public getItems(): { [isbn: string]: number } {
    const res = {}
    this.book_map.forEach((quantity, isbn) => {
      res[isbn] = quantity
    })
    return res
  }

  public addBook(book: Book, quantity: number = 1) {
    if (!this.catalog.contains(book)) {
      throw new BookNotInCatalog('Book is not in catalog')
    }
    if (quantity <= 0) {
      throw new InvalidBookQuantity('Quantity must be positive')
    }
    this.book_map.set(book.isbn, (this.book_map.get(book.isbn) ?? 0) + quantity)
  }

  public getTotalPrice() {
    return sum(
      Array.from(this.book_map.entries()).map(
        ([isbn, quantity]) => quantity * this.catalog.getPrice(new Book(isbn)),
      ),
    )
  }
}
