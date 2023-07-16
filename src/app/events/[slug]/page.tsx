"use client";
import { Accordion } from "@/components/accordion";
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
  onChange = () => null,
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
        onChange={onChange}
      />
    </div>
  );
};

export default function EventDetails() {
  const [data, setData] = useState<any>({});
  const { getContractDetails, buyTicket } = useContract();

  const [tickets, setTickets] = useState<string[]>([]);
  const [ticketQtys, setTicketQtys] = useState<number[]>([]);

  useEffect(() => {
    getContractDetails()
      .then((response: any) => {
        setTickets(response.sales?.[2]);
        setTicketQtys([...new Array(response.sales?.[2].length)].map((_) => 0));
        setData(response);
      })
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
            <div>
              <h2>{data.sales?.[0] || ""}</h2>
            </div>
            <>
              {[...new Array(data.days || 0)]?.map((_, i) => {
                return (
                  <Accordion key={i + 1} title={`Day #${i + 1}`}>
                    {data.sales?.[2]?.map((item: string, j: number) => {
                      return (
                        <div
                          key={`Chilld-${i}`}
                          className="d-flex align-items-center my-2"
                        >
                          <p className="mb-0 mx-5">{item}</p>
                          <Input
                            type="number"
                            style={{ width: 100 }}
                            className="mx-5"
                            defaultValue={ticketQtys[j]}
                            value={ticketQtys[j]}
                            onChange={(e: any) => {
                              const cloned = [...ticketQtys];
                              if (+e.target.value) {
                                cloned[j] = +e.target.value;
                                setTicketQtys(cloned);
                              } else if (e.target.value == "") {
                                cloned[j] = 0;
                                setTicketQtys(cloned);
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </Accordion>
                );
              })}
            </>
            <button
              className="button m-5"
              disabled={!data.days}
              onClick={() => {
                buyTicket(tickets, ticketQtys);
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
