import { type SchemaTypeDefinition } from 'sanity'
import { Category } from './category'
import { product } from './product'
import {order} from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    Category,
    order
  ],
}
