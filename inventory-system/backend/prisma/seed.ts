import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Food & Beverage', slug: 'food-beverage' },
  { name: 'Tools', slug: 'tools' },
  { name: 'Office Supplies', slug: 'office-supplies' }
]

const suppliers = [
  { name: 'Apex Supplies', email: 'contact@apexsupplies.com', phone: '555-0101', address: '123 Industrial Way' },
  { name: 'Blue Ribbon Goods', email: 'orders@blueribbon.com', phone: '555-0102', address: '24 Market Lane' },
  { name: 'Capital Wholesale', email: 'hello@capitalwholesale.com', phone: '555-0103', address: '18 Commerce St.' },
  { name: 'Delta Distributors', email: 'support@deltadistributors.com', phone: '555-0104', address: '9 Supply Ave' },
  { name: 'Evergreen Trade', email: 'info@evergreentrade.com', phone: '555-0105', address: '72 Green Blvd' },
  { name: 'Frontier Inventory', email: 'sales@frontierinventory.com', phone: '555-0106', address: '450 Warehouse Rd' },
  { name: 'Global Goods', email: 'service@globalgoods.com', phone: '555-0107', address: '200 World Way' },
  { name: 'Harbor Stock', email: 'contact@harborstock.com', phone: '555-0108', address: '31 Harbor Dr' },
  { name: 'Island Imports', email: 'hello@islandimports.com', phone: '555-0109', address: '66 Ocean Ave' },
  { name: 'Jetstream Components', email: 'sales@jetstream.com', phone: '555-0110', address: '88 Flight Path' }
]

const products = [
  { name: 'Wireless Mouse', sku: 'ELEC-001', description: 'Ergonomic wireless mouse', price: 24.99, category: 'electronics', lowStockThreshold: 10, quantity: 45 },
  { name: 'Bluetooth Keyboard', sku: 'ELEC-002', description: 'Low-profile keyboard', price: 39.95, category: 'electronics', lowStockThreshold: 12, quantity: 12 },
  { name: 'Noise Cancelling Headphones', sku: 'ELEC-003', description: 'Over-ear headphones', price: 89.5, category: 'electronics', lowStockThreshold: 8, quantity: 7 },
  { name: 'LED Desk Lamp', sku: 'ELEC-004', description: 'Adjustable daylight lamp', price: 18.75, category: 'electronics', lowStockThreshold: 5, quantity: 15 },
  { name: 'Graphic Tee', sku: 'CLTH-001', description: '100% cotton t-shirt', price: 14.0, category: 'clothing', lowStockThreshold: 20, quantity: 54 },
  { name: 'Denim Jacket', sku: 'CLTH-002', description: 'Classic fit jacket', price: 59.99, category: 'clothing', lowStockThreshold: 6, quantity: 8 },
  { name: 'Running Shoes', sku: 'CLTH-003', description: 'Lightweight running sneakers', price: 74.99, category: 'clothing', lowStockThreshold: 10, quantity: 11 },
  { name: 'Organic Coffee Beans', sku: 'FOOD-001', description: 'Fresh roasted beans', price: 12.5, category: 'food-beverage', lowStockThreshold: 15, quantity: 24 },
  { name: 'Sparkling Water Pack', sku: 'FOOD-002', description: '12-pack sparkling water', price: 9.95, category: 'food-beverage', lowStockThreshold: 10, quantity: 9 },
  { name: 'Trail Mix', sku: 'FOOD-003', description: 'Snack-sized trail mix', price: 6.25, category: 'food-beverage', lowStockThreshold: 8, quantity: 19 },
  { name: 'Hammer', sku: 'TOOL-001', description: '16oz steel hammer', price: 15.9, category: 'tools', lowStockThreshold: 7, quantity: 13 },
  { name: 'Cordless Drill', sku: 'TOOL-002', description: '18V rechargeable drill', price: 69.99, category: 'tools', lowStockThreshold: 5, quantity: 4 },
  { name: 'Tape Measure', sku: 'TOOL-003', description: '25ft retractable tape', price: 7.5, category: 'tools', lowStockThreshold: 6, quantity: 10 },
  { name: 'Office Chair', sku: 'OFFC-001', description: 'Comfortable mesh chair', price: 119.99, category: 'office-supplies', lowStockThreshold: 3, quantity: 2 },
  { name: 'Notebook Pack', sku: 'OFFC-002', description: 'Set of 5 spiral notebooks', price: 12.5, category: 'office-supplies', lowStockThreshold: 20, quantity: 32 },
  { name: 'Stapler', sku: 'OFFC-003', description: 'Standard desk stapler', price: 8.5, category: 'office-supplies', lowStockThreshold: 10, quantity: 21 },
  { name: 'USB-C Cable', sku: 'ELEC-005', description: '2m charging cable', price: 7.99, category: 'electronics', lowStockThreshold: 15, quantity: 14 },
  { name: 'Sweatshirt', sku: 'CLTH-004', description: 'Pullover hoodie', price: 29.99, category: 'clothing', lowStockThreshold: 10, quantity: 25 },
  { name: 'Protein Bars', sku: 'FOOD-004', description: 'Pack of 12 bars', price: 19.99, category: 'food-beverage', lowStockThreshold: 12, quantity: 10 },
  { name: 'Screwdriver Set', sku: 'TOOL-004', description: 'Precision screwdriver kit', price: 21.5, category: 'tools', lowStockThreshold: 8, quantity: 16 },
  { name: 'Printer Ink', sku: 'OFFC-004', description: 'Black ink cartridge', price: 24.5, category: 'office-supplies', lowStockThreshold: 4, quantity: 6 },
  { name: 'Portable Charger', sku: 'ELEC-006', description: '10,000mAh power bank', price: 29.95, category: 'electronics', lowStockThreshold: 8, quantity: 9 },
  { name: 'Cargo Shorts', sku: 'CLTH-005', description: 'Multi-pocket shorts', price: 34.99, category: 'clothing', lowStockThreshold: 8, quantity: 20 },
  { name: 'Herbal Tea', sku: 'FOOD-005', description: 'Collection of herbal teas', price: 14.99, category: 'food-beverage', lowStockThreshold: 10, quantity: 13 },
  { name: 'Garden Shears', sku: 'TOOL-005', description: 'Pruning shears', price: 18.25, category: 'tools', lowStockThreshold: 5, quantity: 5 },
  { name: 'Desk Organizer', sku: 'OFFC-005', description: 'Wood desktop organizer', price: 22.5, category: 'office-supplies', lowStockThreshold: 7, quantity: 11 },
  { name: 'Wireless Charger', sku: 'ELEC-007', description: 'Qi charging pad', price: 19.99, category: 'electronics', lowStockThreshold: 10, quantity: 8 },
  { name: 'Sports Cap', sku: 'CLTH-006', description: 'Adjustable baseball cap', price: 12.0, category: 'clothing', lowStockThreshold: 10, quantity: 18 },
  { name: 'Snack Bars', sku: 'FOOD-006', description: 'Healthy snack bars', price: 8.75, category: 'food-beverage', lowStockThreshold: 9, quantity: 9 },
  { name: 'Notebook Mouse Pad', sku: 'OFFC-006', description: 'Large mouse pad', price: 11.99, category: 'office-supplies', lowStockThreshold: 10, quantity: 14 }
]

const users = [
  { name: 'Admin User', email: 'admin@inventory.com', password: 'Admin@1234', role: 'ADMIN' },
  { name: 'Staff One', email: 'staff1@inventory.com', password: 'Staff@1234', role: 'STAFF' },
  { name: 'Staff Two', email: 'staff2@inventory.com', password: 'Staff@1234', role: 'STAFF' }
]

const main = async (): Promise<void> => {
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.productSupplier.deleteMany()
  await prisma.product.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const createdUsers = [] as Array<{ id: string; email: string }>

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 12)
    const created = await prisma.user.create({ data: { name: user.name, email: user.email, passwordHash, role: user.role } })
    createdUsers.push({ id: created.id, email: created.email })
  }

  const categoryRecords = await Promise.all(categories.map((category) => prisma.category.create({ data: category })))
  const supplierRecords = await Promise.all(suppliers.map((supplier) => prisma.supplier.create({ data: supplier })))

  const productRecords = [] as Array<{ id: string; quantity: number; name: string }>

  for (const product of products) {
    const category = categoryRecords.find((item) => item.slug === product.category)
    if (!category) {
      continue
    }

    const created = await prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        categoryId: category.id,
        price: product.price,
        lowStockThreshold: product.lowStockThreshold
      }
    })

    const supplier = supplierRecords[Math.floor(Math.random() * supplierRecords.length)]
    await prisma.productSupplier.create({ data: { productId: created.id, supplierId: supplier.id, isPrimary: true } })
    productRecords.push({ id: created.id, quantity: product.quantity, name: created.name })
  }

  const adminId = createdUsers[0].id

  for (const product of productRecords) {
    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          productId: product.id,
          type: 'STOCK_IN',
          quantity: product.quantity,
          createdById: adminId
        }
      })
      await tx.product.update({ where: { id: product.id }, data: { quantity: product.quantity } })
    }, { isolationLevel: 'Serializable' })
  }

  const stockOuts = productRecords.slice(0, 15)
  for (const item of stockOuts) {
    const amount = Math.min(3, Math.max(1, Math.floor(item.quantity / 4)))
    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          productId: item.id,
          type: 'STOCK_OUT',
          quantity: amount,
          createdById: adminId
        }
      })
      await tx.product.update({ where: { id: item.id }, data: { quantity: Math.max(0, item.quantity - amount) } })
    }, { isolationLevel: 'Serializable' })
  }

  const adjustments = productRecords.slice(15, 20)
  for (const item of adjustments) {
    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          productId: item.id,
          type: 'ADJUSTMENT',
          quantity: 2,
          createdById: adminId
        }
      })
      await tx.product.update({ where: { id: item.id }, data: { quantity: item.quantity + 2 } })
    }, { isolationLevel: 'Serializable' })
  }

  console.log('Seed completed')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
