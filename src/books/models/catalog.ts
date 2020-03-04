import { BookNotInCatalog } from "../../exceptions"
import { Book } from "./book"

interface CatalogEntry {
  isbn: string
  price: number
}
export class Catalog {
  private catalog: CatalogEntry[]
  constructor(entries: CatalogEntry[]) {
    this.catalog = entries
  }

  public contains(book: Book) {
    return this.catalog.some(b => b.isbn === book.isbn)
  }

  public getPrice(book: Book) {
    if (!this.contains(book)) {
      throw new BookNotInCatalog('Book is not in the catalog')
    }
    return this.catalog.find(b => b.isbn === book.isbn)!.price
  }
}
