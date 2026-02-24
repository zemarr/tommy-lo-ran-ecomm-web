'use client'

import { Button } from '@/components/ui/button'
import { approvePaystackOrder } from '@/lib/server/actions/order.actions'
import { toast } from 'sonner'
import { nairaToKobo } from '../../lib/utils'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const PaystackButton = dynamic(
  () => import('react-paystack').then(mod => mod.PaystackButton),
  { ssr: false }
)

const PaymentComponent = ({ order, paystackPublicKey, user }: { order: any, paystackPublicKey: string, user: any }) => {
  const router = useRouter();
  // const handleSubmit = async (event: FormEvent) => {
  //   event.preventDefault();
  //   const res = await createOrder();

  //   if (res.redirectTo) router.push(res.redirectTo)
  // }

  useEffect(() => {
    if (!paystackPublicKey) {
      toast.error("Paystack public key not found");
    }
  }, [ paystackPublicKey ])

  const paystackConfig = {
    publicKey: paystackPublicKey || '',
    // token: "test",
    currency: "NGN",
    email: user?.email,
    amount: nairaToKobo(Number(order.totalPrice)),
    reference: (new Date()).getTime().toString(),
    callback: (data: any) => {
      console.log(data, 'payment data');
    },
    metadata: {
      custom_fields: [
        {
          display_name: 'Email',
          variable_name: 'email',
          value: user?.email
        },
        {
          display_name: 'Amount',
          variable_name: 'amount',
          value: Number(order.totalPrice)
        },
        {
          display_name: 'Currency',
          variable_name: 'currency',
          value: 'Naira'
        }
      ]
    },
    onSuccess: () => {
      toast.success('Payment successful');
    },
    onClose: () => {
      console.log('Payment cancelled');
    },
    onError: () => {
      console.log('Payment failed. Please try again');
    }
  }

  return (
    <>
      {order.paidAt?.toString()}
      {
        !order.isPaid && order.paymentMethod === 'Paystack' && (
          <>
            <Button className='w-full'>Pay via Paystack</Button>
            {/* <PaystackButton text='Pay via Paystack'
              className='bg-foreground text-background w-full rounded-md py-2 px-4 cursor-pointer'
              {...paystackConfig}
              onSuccess={(data) => {
                approvePaystackOrder(order.id, data.reference).then((res) => {
                  if (res.success) {
                    toast.success(res.message);
                    router.push(`/checkout?step=confirmation`);
                  } else {
                    toast.error(res.message);
                  }
                })
              }}
            /> */}
          </>
        )
      }
    </>
  )
}

export default PaymentComponent