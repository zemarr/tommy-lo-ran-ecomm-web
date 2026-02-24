import CartTable from './components/cart-table'

export const metadata = {
  title: 'Shopping cart'
}

const CartPage = async () => {
  return (
    <div>
      <CartTable />
    </div>
  )
}

export default CartPage