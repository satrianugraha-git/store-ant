import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from "../../../lib/prisma"
import { TransactionStatus } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {id} = req.body
  const session = await getSession({req})

  try {
    const transaction = await prisma.transaction.update({
        where:{id: Number(id)},
        data:{
            status: transaction.RETURNED
        }
    })

    const product = await prisma.product.findFirst({
      where:{id: Number(productInCart.productId)}
    })

    const productUpdate = await prisma.product.update({
      where:{id: Number(product?.id)},
      data:{
        stock: Number(Number(product?.stock) + Number(productInCart.count))
      }
    })    

    const returnAmount: number = Number(productInCart?.count) * Number(product?.price);
    
    const user = await prisma.user.findFirst({
        where:{id: session?.user?.id}
    });

    const userUpdate = await prisma.user.update({
        where: {id: user?.id},
        data:{
            balance: Number(user?.balance) + returnAmount
        }
    });

    const transaction = await prisma.transaction.update({
      where: {productInCartId: Number(id)},
      data: {
        status: TransactionStatus.REFUNDED
      }
    })

    res.status(200).json({ message: "Success!" })
  } catch (error) {
    //console.log(error)
    res.status(400).json({ message: "Fail" })
  }
}