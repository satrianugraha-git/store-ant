import React from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { prisma } from "../../lib/prisma"
import Link from 'next/link'
import ProductCard from '@/components/product_card'
import Navbar from '../navbar'
import Footer from '../footer'
import { Status } from '@prisma/client'
import ShopDashboard from '../../components/shop/shop_dashboard'

interface CartItems {
  cartItems: {
    id: Number;
    product: Product;
    count: Number;
    price: Number;
    status: Status;
  }[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface CartId {
  id: Number;
}

export default function Orders({ cartItems, shop }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const{data:session} = useSession();
  let dikemas = new Array();
  let dikirim = new Array();
  let selesai = new Array();
  let dibatalkan = new Array();
  let dikembalikan = new Array();

  if(cartItems){
    let i: number;
    for(i = 0; i < cartItems.length; i++){
      if(cartItems[i].status === Status.PACKING || cartItems[i].status === Status.CANCELING || cartItems[i].status === Status.CANCEL_REJECTED)
        dikemas.push(cartItems[i]);
    }
    console.log(dikemas);
    
    for(i = 0; i < cartItems.length; i++){
        if(cartItems[i].status === Status.DELIVERING || cartItems[i].status === Status.RETURNING || cartItems[i].status === Status.NEED_ADMIN_REVIEW)
            dikirim.push(cartItems[i]);
    }
    console.log(dikirim);
    
    for(i = 0; i < cartItems.length; i++){
        if(cartItems[i].status === Status.FINISHED || cartItems[i].status === Status.RETURN_REJECTED)
            selesai.push(cartItems[i]);
    }
    console.log(selesai);
    
    for(i = 0; i < cartItems.length; i++){
      if(cartItems[i].status === Status.CANCELED)
        dibatalkan.push(cartItems[i]);
    }
    console.log(dibatalkan);
    
    for(i = 0; i < cartItems.length; i++){
      if(cartItems[i].status === Status.RETURNED)
        dikembalikan.push(cartItems[i]);
    }
    console.log(dikembalikan);
  }

  async function onDeliver(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('http://localhost:3000/api/shop/deliver', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          //console.log(error)
      }
  }

  async function onCancel(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('http://localhost:3000/api/shop/cancel', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          //console.log(error)
      }
  }

  async function onReject(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('http://localhost:3000/api/shop/reject', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          //console.log(error)
      }
  }

  async function onReturn(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('http://localhost:3000/api/shop/return', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          //console.log(error)
      }
  }

  async function onFinish(id: Number) {
    const cartId: CartId = {id: id};
    try{
        fetch('http://localhost:3000/api/shop/finish', {
            body: JSON.stringify(cartId),
            headers: {
                'Content-Type' : 'application/json'
            },
            method: 'PUT'
        }).then(()=> router.reload())
      }catch(error){
          //console.log(error)
      }
  }

  return (
    <>
      <Navbar />
      <div className='flex flex-row py-4 space-x-2'>
          <ShopDashboard shop={shop}/>
          <div className="w-full">
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Dikemas</p>
                    </div>
                </section> 
                {dikemas.length !==0 ? (
                    <div>
                        {dikemas.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>                                                                                                                                  
                                            {cartItem.status === Status.CANCELING ? (    
                                                <div className="flex gap-x-2">                                                
                                                    <button onClick={() => onCancel(Number(cartItem.id))} className="w-16 btn btn-primary">Setuju</button>
                                                    <button onClick={() => onReject(Number(cartItem.id))} className="w-16 btn btn-primary">Tolak</button>                                               
                                                </div>            
                                            ) : (
                                                <div className="flex gap-x-2">
                                                    <button onClick={() => onDeliver(Number(cartItem.id))} className="w-16 btn btn-primary">Kirim</button> 
                                                    <button onClick={() => onCancel(Number(cartItem.id))} className="w-32 btn btn-primary">Batalkan</button>                                               
                                                </div>
                                            )}  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Dikirim</p>
                    </div>
                </section> 
                {dikirim.length !==0 ? (
                    <div>
                        {dikirim.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>                                                                                      
                                            {cartItem.status === Status.RETURNING ? (    
                                                <div className="flex gap-x-2">                                                
                                                    <button onClick={() => onReturn(Number(cartItem.id))} className="w-16 btn btn-primary">Setuju</button>
                                                    <button onClick={() => onFinish(Number(cartItem.id))} className="w-16 btn btn-primary">Tolak</button>                                               
                                                </div>            
                                            ) : (
                                                <div>
                                                    {cartItem.status === Status.NEED_ADMIN_REVIEW? (
                                                        <div>
                                                            <p>Menunggu review admin untuk pengembalian</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-x-2">
                                                            <button className="w-16 btn btn-primary">Lacak</button>                                                
                                                        </div>
                                                    )}
                                                </div>
                                            )}  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Selesai</p>
                    </div>
                </section> 
                {selesai.length !==0 ? (
                    <div>
                        {selesai.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Dibatalkan</p>
                    </div>
                </section> 
                {dibatalkan.length !==0 ? (
                    <div>
                        {dibatalkan.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
            <div className='w-full mx-10 bg-gray-100 py-5'>
                <section className="w-full mx-auto flex flex-col gap-10">
                    <div className="title">
                            <p className="text-lg">Dikembalikan</p>
                    </div>
                </section> 
                {dikembalikan.length !==0 ? (
                    <div>
                        {dikembalikan.map((cartItem) => (
                        <div
                            className="card bg-base-100 shadow-xl text-md"
                            key={String(cartItem.id)}
                        >
                            <div className="flex">
                                <div className="card-body py-5">
                                    <figure className="rounded-md h-40 w-40">
                                        {cartItem.product.image? (
                                            <img src={`http://localhost:3000/${cartItem.product.image}`}/>
                                        ) : (
                                            <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"/>
                                        )}
                                    </figure>
                                </div>
                                <div className="w-full">
                                    <div className="py-5 px-10 flex w-full">
                                        <div>
                                            <h2 className="card-title">{cartItem.product.name}</h2>
                                            <p>{cartItem.product.price}</p>
                                            <p>{cartItem.count}</p>
                                            <p>{cartItem.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>No on going transaction</p>
                )}
            </div>
          </div>
      </div>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const shop = await prisma.shop.findFirst({
    where:{userId: session?.user?.id!}
  })

  const cartItems = await prisma.productInCart.findMany({
    where:{
        product: {shopId: shop?.id!},
        status: {not: Status.UNPAID}
    },
    select:{
        id: true,
        product: true,
        count: true,
        status: true
    }
  })
  return {
    props: {
      shop,
      cartItems,
    },
  };
}