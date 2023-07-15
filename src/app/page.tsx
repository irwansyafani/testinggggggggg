"use client";
import { useContract } from "@/components/utils/contract";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<{}[]>([]);
  const { getContractDetails } = useContract();

  useEffect(() => {
    getContractDetails()
      .then((res) => {
        if (res) {
          setData([{ ...res }]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main>
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
      <div className="event-wrapper container py-4">
        <div className="row">
          {!data.length && <p className="text-white">There is no event yet</p>}
          {data?.map((item: any, i: any) => {
            return (
              <Link
                key={i}
                href={`/events/${item.address}`}
                className="event col-md-3 px-0"
              >
                <Image
                  src="/event-cover.png"
                  width={330}
                  height={330}
                  className="image"
                  alt="coldplay"
                />
                <div className="overlay">
                  <p>{item.name}</p>
                  <p>{new Date(item.date).toLocaleString()}</p>
                  <p>{item.location}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
