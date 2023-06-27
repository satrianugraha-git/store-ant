import { Product, TransactionStatus } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  htmlElementId: string,
  selectProductCallback: () => any;
}

interface Order {
  id: number,
  transactionId: number,
  productId: number,
  count: number,
  createdAt: Date,
  updatedAt: Date,
  product: Product
}

interface Transaction {
  id: number,
  userId: number,
  shopId: number,
  status: TransactionStatus,
  createdAt: Date,
  updatedAt: Date,
  paymentMethod: string,
  order: Order[]
}
  
interface Params {
    id: number;
    price: number
}
  
interface TransactionToken {
    token: string;
    redirectUrl: string;
}
  
const PaymentModal = ({htmlElementId: id, selectProductCallback} : Props) => {
  const {
    selectedTransaction
  } : 
  { 
    selectedTransaction: Transaction
  } = selectProductCallback();
  const [isUsingBalance, setUsingBalance] = useState<boolean>(false);
  const router = useRouter();
    
  const onClose = () => {
    console.log("close"); 
    console.log("transaction modal ", selectedTransaction);
  }
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const handleChange = () => {
    setUsingBalance(!isUsingBalance);
    console.log(isUsingBalance);
  };

  async function onBayar() {
    const params : Params = {id: selectedTransaction.id, price: (selectedTransaction.count * selectedTransaction.product.price)};
    const transactionToken : TransactionToken = (await axios.post(`http://localhost:3000/api/cart/pay`, params)).data;
    window.open(transactionToken.redirectUrl);
  }

  async function onBayarDenganSaldo() {
    const params : Params = {id: selectedTransaction.id, price: (selectedTransaction.count * selectedTransaction.product.price)};
    const transactionToken : TransactionToken = (await axios.post(`http://localhost:3000/api/cart/paywithbalance`, params)).data;
    window.open(transactionToken.redirectUrl);
  }

  const onSubmit = async () => {
    if(isUsingBalance)
        onBayarDenganSaldo();
    else
        onBayar();
  }

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle"/>
      <div id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box space-y-2">
          <div className="flex">
            <h1 className="text-lg font-bold">Payment</h1>
            <div className="w-full flex justify-end" onClick={onClose}>
                <label htmlFor={id} className="text-lg font-bold">✕</label>
            </div>
          </div>
          <div id="product-box" className="p-2 space-x-2 flex flex-row">
            <div id="product-detail-img-container" className=" flex justify-center items-center">
                <img className="w-20 h-20 object-cover" 
                    src={`http://localhost:3000/${selectedTransaction?.product.image.split(",")[0]}`}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                    }}
                    alt=''
                />
            </div>
            <div className="mx-5">                
                <h1 className="text-lg font-bold">{selectedTransaction?.product.name}</h1>
                <p>{formatter.format(selectedTransaction?.product.price)}</p>
                <p>Qty. {selectedTransaction?.count}</p>
            </div>
          </div>
          <h1 className="text-md">Total: {formatter.format(selectedTransaction?.product.price * selectedTransaction?.count)}</h1>
          <form id="review-form" action="" className="py-1 space-y-1">
            <label>
                <input type="checkbox" checked={isUsingBalance} onChange={handleChange}/>
                Bayar dengan Saldo
            </label>
          </form>
          <div className="" onClick={onSubmit}>
            <label htmlFor={id} className="h-10 w-full rounded text-white bg-indigo-700 hover:bg-indigo-900 hover:cursor-pointer flex justify-center items-center">
              Submit
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;