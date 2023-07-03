import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import React from "react";

interface TransactionId {
    id: string
    paymentType: string
}
  
export default function Redirect() {
  const router = useRouter();
  const { order_id, status_code, transaction_status } = router.query;

  if (status_code == "200") {
    UpdateStatus();
  }

  async function UpdateStatus() {
    const transactionId:TransactionId = {id: order_id as string};
    console.log(transactionId);
    //await axios.post(`http://localhost:3000/api/cart/success`, transactionId);
  }

  return (
    <div>
      <p>{order_id}</p>
      <p>{status_code}</p>
      <p>{transaction_status}</p>
      <p>{status_code == "200" ? "Pembayaran Berhasil" : "Pembayaran Gagal"}</p>
      <button className="w-64 btn btn-sm btn-primary rounded-sm" onClick={()=>router.push("/")}>Kembali ke halaman utama</button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const options = {
    method: "GET",
    url: `https://api.sandbox.midtrans.com/v2/${context.query.order_id}/status`,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000/',
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization":
        "Basic U0ItTWlkLXNlcnZlci12WGVDYnVkd3R2WTZZTldDRjBqVTZzM1A=",
    }
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      if(response.data.status_code == 200){
        const data = {id: context.query.order_id, paymentType: response.data.payment_type};
        console.log("data: ", data);
        axios.post(`http://localhost:3000/api/cart/success`, data);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  //const res = await axios.get(`https://api.sandbox.midtrans.com/v2/${order_id}/status`);

  return {
    props: {
      
    },
  };
};
