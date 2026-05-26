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
  { name: 'Logitech MX Master 3S Mouse', sku: 'ELEC-MX3S', description: 'Wireless productivity mouse with USB receiver', price: 99.99, category: 'electronics', lowStockThreshold: 8, quantity: 22 },
  { name: 'Keychron K2 Mechanical Keyboard', sku: 'ELEC-K2-V2', description: '75% wireless mechanical keyboard', price: 89.0, category: 'electronics', lowStockThreshold: 6, quantity: 14 },
  { name: 'Sony WH-1000XM5 Headphones', sku: 'ELEC-XM5', description: 'Noise cancelling Bluetooth over-ear headphones', price: 349.0, category: 'electronics', lowStockThreshold: 4, quantity: 9 },
  { name: 'Anker 735 GaN Charger', sku: 'ELEC-ANK735', description: '65W USB-C wall charger', price: 59.99, category: 'electronics', lowStockThreshold: 10, quantity: 27 },
  { name: 'Levi\'s 511 Slim Jeans', sku: 'CLTH-L511', description: 'Men\'s slim fit denim jeans', price: 68.0, category: 'clothing', lowStockThreshold: 7, quantity: 18 },
  { name: 'Nike Dri-FIT Training Tee', sku: 'CLTH-NKDFT', description: 'Performance training t-shirt', price: 32.0, category: 'clothing', lowStockThreshold: 12, quantity: 35 },
  { name: 'Adidas Runfalcon 3 Shoes', sku: 'CLTH-ADRF3', description: 'Everyday running shoes', price: 74.0, category: 'clothing', lowStockThreshold: 6, quantity: 16 },
  { name: 'Puma Essentials Hoodie', sku: 'CLTH-PMHD', description: 'Cotton blend pullover hoodie', price: 55.0, category: 'clothing', lowStockThreshold: 8, quantity: 20 },
  { name: 'Davidoff Rich Aroma Coffee 200g', sku: 'FOOD-DVCF', description: 'Instant coffee jar', price: 12.99, category: 'food-beverage', lowStockThreshold: 10, quantity: 26 },
  { name: 'Tata Tea Gold 1kg', sku: 'FOOD-TTG1K', description: 'Premium loose leaf tea', price: 8.99, category: 'food-beverage', lowStockThreshold: 9, quantity: 21 },
  { name: 'Bisleri Mineral Water 12x1L', sku: 'FOOD-BIS12', description: 'Case of 12 one-liter bottles', price: 6.5, category: 'food-beverage', lowStockThreshold: 15, quantity: 40 },
  { name: 'Kellogg\'s Muesli Fruit Nut 750g', sku: 'FOOD-KLGM', description: 'Breakfast cereal pack', price: 7.25, category: 'food-beverage', lowStockThreshold: 8, quantity: 19 },
  { name: 'Bosch GSB 500W Impact Drill', sku: 'TOOL-BSH500', description: 'Corded impact drill for metal and wood', price: 79.0, category: 'tools', lowStockThreshold: 5, quantity: 11 },
  { name: 'Stanley Claw Hammer 16oz', sku: 'TOOL-STN16', description: 'Forged steel claw hammer', price: 18.5, category: 'tools', lowStockThreshold: 8, quantity: 24 },
  { name: 'Taparia Screwdriver Set 8pc', sku: 'TOOL-TPR8', description: 'Mixed flat and Phillips set', price: 14.75, category: 'tools', lowStockThreshold: 7, quantity: 17 },
  { name: 'Black+Decker Tape Measure 5m', sku: 'TOOL-BD5M', description: 'Compact locking tape measure', price: 6.99, category: 'tools', lowStockThreshold: 12, quantity: 30 },
  { name: 'HP 802 Black Ink Cartridge', sku: 'OFFC-HP802B', description: 'Original black ink cartridge', price: 18.0, category: 'office-supplies', lowStockThreshold: 6, quantity: 13 },
  { name: 'Classmate Spiral Notebook A4', sku: 'OFFC-CLSA4', description: 'Single subject 300-page notebook', price: 3.25, category: 'office-supplies', lowStockThreshold: 20, quantity: 52 },
  { name: 'Cello Butterflow Ball Pens 10-pack', sku: 'OFFC-CLLP10', description: 'Blue ink smooth ball pens', price: 4.5, category: 'office-supplies', lowStockThreshold: 18, quantity: 60 },
  { name: 'Godrej Interio Motion Chair', sku: 'OFFC-GDJCH', description: 'Ergonomic office chair with lumbar support', price: 149.0, category: 'office-supplies', lowStockThreshold: 3, quantity: 7 }
]

const users = [
  { name: 'Spandan Choubey', email: 'spandanchoubey@gmail.com', password: 'Admin@1234', role: 'ADMIN' }
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
    await prisma.product.update({ where: { id: product.id }, data: { quantity: product.quantity } })
  }

  const sampleTransactions = [
    { index: 0, type: 'STOCK_IN', quantity: 12, note: 'Vendor replenishment from Apex Supplies - PO #APX-2041' },
    { index: 2, type: 'STOCK_OUT', quantity: 3, note: 'Issued to creative team for client video editing bays' },
    { index: 8, type: 'ADJUSTMENT', quantity: 2, note: 'Stock count correction after aisle audit' },
    { index: 12, type: 'STOCK_IN', quantity: 6, note: 'Restocked tools for maintenance workshop' },
    { index: 19, type: 'STOCK_OUT', quantity: 1, note: 'Allocated to new branch manager workstation setup' }
  ] as const

  for (const item of sampleTransactions) {
    const product = productRecords[item.index]
    if (!product) {
      continue
    }

    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          productId: product.id,
          type: item.type,
          quantity: item.quantity,
          note: item.note,
          createdById: adminId
        }
      })

      const nextQuantity = item.type === 'STOCK_OUT'
        ? Math.max(0, product.quantity - item.quantity)
        : product.quantity + item.quantity

      await tx.product.update({ where: { id: product.id }, data: { quantity: nextQuantity } })
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
