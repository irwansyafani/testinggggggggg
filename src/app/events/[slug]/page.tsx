"use client";
import { useContract } from "@/components/utils/contract";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Input = ({
  type = "text",
  placeholder = "",
  label,
  defaultValue,
  editable = true,
  className = "",
  style,
  min,
}: any) => {
  return (
    <div className={`input ${className}`}>
      <label>{label}</label>
      <input
        style={style}
        min={min}
        placeholder={placeholder}
        contentEditable={editable}
        defaultValue={defaultValue}
        type={type}
      />
    </div>
  );
};

export default function EventDetails() {
  const [data, setData] = useState<any>({});
  const { getContractDetails, buyTicket } = useContract();
  const [vipQty, setVipQty] = useState<number>(0);
  const [regulerQty, setRegulerQty] = useState<number>(1);

  useEffect(() => {
    getContractDetails()
      .then(setData)
      .catch((err) => console.log(err));
  }, []);

  return (
    <main className="main-eventdetails">
      <div className="overlay" />
      <div className="content">
        <nav className="container gap-2">
          <Link href="/">
            <Image src="/logo.png" width={125} height={50} alt="logo" />
          </Link>
          {/* <div className="d-flex gap-2">
            <Link href="/" className="selected">
              Dashboard
            </Link>
            <Link href="/events">Events</Link>
          </div> */}
        </nav>
        <div className="d-flex justify-content-center">
          <div className="container px-md-5 text-white d-flex flex-column justify-content-center align-items-center text-center">
            <div>
              <Image
                src="/event-cover.png"
                width={400}
                height={400}
                alt="coldplay"
              />
            </div>
            <div>
              <h1>{data.name}</h1>
              <p>{data.location}</p>
              <p>{new Date(data.date).toLocaleString()}</p>
            </div>
          </div>
          <div className="container px-md-5 text-white d-flex flex-column justify-content-center align-items-center">
            {/* <div>
              <h2>Event Organizer Details</h2>
              <p>Lorem Ipsum</p>
            </div> */}
            <div className="d-flex align-items-center my-2">
              <p className="mb-0 mx-5">Regular</p>
              <Input
                type="number"
                min={0}
                style={{ width: 100 }}
                className="mx-5"
                defaultValue={1}
                value={regulerQty}
                onChange={(e: any) => setRegulerQty(+e.target.value)}
              />
              {/* <button className="button">Buy Ticket</button> */}
            </div>
            <div className="d-flex align-items-center my-2">
              <p className="mb-0 mx-5">VIP</p>
              <Input
                type="number"
                min={0}
                style={{ width: 100 }}
                className="mx-5"
                value={vipQty}
                defaultValue={0}
                onChange={(e: any) => setVipQty(+e.target.value)}
              />
            </div>
            <button
              className="button m-5"
              onClick={() => {
                buyTicket(vipQty, regulerQty);
              }}
            >
              Buy Ticket
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
