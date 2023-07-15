"use client";
import { Accordion } from "@/components/accordion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useContract } from "@/components/utils/contract";

const Input = ({
  type = "text",
  placeholder = "",
  label,
  defaultValue,
  editable = true,
  className = "",
  value,
  onChange = () => null,
}: any) => {
  return (
    <div className={`input ${className}`}>
      <label>{label}</label>
      <input
        placeholder={placeholder}
        contentEditable={editable}
        defaultValue={defaultValue}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const Information = ({ data, setData }: any) => {
  return (
    <div className="div-inf py-5">
      <Input
        label="Event's Name"
        value={data.eventName}
        onChange={(e: any) => setData({ ...data, eventName: e.target.value })}
      />
      <Input
        label="Event's Logo"
        value={data.eventLogo}
        onChange={(e: any) => setData({ ...data, eventLogo: e.target.value })}
      />
      <Input
        label="Max Ticket Per Wallet"
        type="number"
        min={0}
        value={data.ticketMaxPerWallets}
        onChange={(e: any) =>
          setData({ ...data, ticketMaxPerWallets: +e.target.value })
        }
      />
      <Input
        label="Transferable (y/del)"
        placeholder="blank for 'No'"
        className="my-3"
        value={data.ticketTransferable}
        onChange={(e: any) =>
          setData({
            ...data,
            ticketTransferable: e.target.value ? true : false,
          })
        }
      />
    </div>
  );
};
const LocationTime = ({ data, setData }: any) => {
  return (
    <div className="div-lt py-5">
      <Input
        label="Event's Location"
        value={data.eventLocation}
        onChange={(e: any) =>
          setData({ ...data, eventLocation: e.target.value })
        }
      />
    </div>
  );
};
const Dates = ({ onAdd, onDelete, onChange, data }: any) => {
  return (
    <div className="div-ds py-5">
      <button className="button" onClick={onAdd}>
        Add Day
      </button>
      {data.dateEvents?.map((t: any, i: number) => {
        const dateValue = new Date(new Date(t * 1000).getTime());
        const userTimezone = -new Date().getTimezoneOffset() / 60;
        dateValue.setTime(dateValue.getTime() + userTimezone * 60 * 60 * 1000);
        return (
          <div key={i} className="d-flex align-items-center mt-4">
            <Accordion
              title={`Day #${i + 1}`}
              className="w-100"
              bodyClassName="d-flex"
            >
              <Input
                label="Date"
                type="datetime-local"
                className="my-3 w-100 mx-2"
                // value={dateValue ? dateValue?.toISOString()?.slice(0, 16)}

                onChange={(e: any) => {
                  onChange(new Date(e.target.value).getTime() / 1000, i);
                }}
              />
            </Accordion>
            <button className="button mx-2" onClick={() => onDelete(i)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

const Tickets = ({ data, onChange, onAdd, onDelete }: any) => {
  return (
    <div className="div-tct py-5">
      <button className="button" onClick={onAdd}>
        Add Ticket
      </button>
      {data.ticketDatas?.map((t: any, i: number) => {
        return (
          <div key={i} className="d-flex align-items-center mt-4">
            <Accordion title={t?.name || `Ticket #${i + 1}`} className="w-100">
              <Input
                label="Name"
                className="mt-3"
                value={t.name}
                onChange={(e: any) => onChange(e.target.value, "name", i)}
              />

              <Input
                label="Max Quantity"
                type="number"
                className="my-3"
                value={t.amount}
                onChange={(e: any) => onChange(+e.target.value, "amount", i)}
              />
            </Accordion>
            <button className="button mx-2" onClick={() => onDelete(i)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};
const SellingDate = ({ data, onAdd, onDelete, onChange }: any) => {
  return (
    <div className="div-sd py-5">
      <button className="button" onClick={onAdd}>
        Add Period
      </button>
      {data.saleDatas?.map((t: any, i: number) => {
        return (
          <div key={i} className="d-flex align-items-center mt-4">
            <Accordion
              title={t.name || `Selling Period #${i + 1}`}
              className="w-100"
            >
              <Input
                label="Name"
                className="mt-3"
                value={t.name}
                onChange={(e: any) => {
                  onChange(e.target.value, "name", i);
                }}
              />
              <Input
                label="Date"
                type="datetime-local"
                className="my-3"
                // value={t.date ? t.date * 1000 : 0}
                onChange={(e: any) => {
                  onChange(
                    new Date(e.target.value).getTime() / 1000,
                    "date",
                    i
                  );
                }}
              />
              {t.ticketName?.map((c: any, j: any) => {
                return (
                  <div className="row">
                    <Input
                      label="Name"
                      className="mt-3 col-4"
                      defaultValue={c}
                      editable={false}
                    />
                    <Input
                      label="Max Quantity Sale"
                      className="mt-3 col-4"
                      type="number"
                      min={0}
                      value={t.ticketAmount[j]}
                      onChange={(e: any) => {
                        onChange(e.target.value, "ticketAmount", i, j);
                      }}
                    />
                  </div>
                );
              })}
            </Accordion>
            <button className="button mx-2" onClick={() => onDelete(i)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const { createContract } = useContract();

  const [step, setStep] = useState(1);

  const [data, setData]: any = useState({
    eventName: "",
    eventLogo: "",
    eventLocation: "",
    dateEvents: [],
    ticketTransferable: false,
    ticketMaxPerWallets: 0,
    ticketDatas: [],
    saleDatas: [],
  });

  return (
    <div className="div-event">
      <Image
        src="/ellipse.png"
        width={776}
        height={776}
        alt="ellipse"
        className="ellipse"
      />
      <nav className="container gap-2">
        <Image src="/logo.png" width={125} height={50} alt="logo" />
        {/* <div className="d-flex gap-2">
          <Link href="/">Dashboard</Link>
          <Link href="/events" className="selected">
            Events
          </Link>
        </div> */}
      </nav>
      <div className="container py-4">
        <div className="stepper">
          <div>Information</div>
          <label>{">"}</label>
          <div className={step < 2 ? "disabled" : ""}>Location</div>
          <label>{">"}</label>
          <div className={step < 3 ? "disabled" : ""}>Dates</div>
          <label>{">"}</label>
          <div className={step < 4 ? "disabled" : ""}>Tickets</div>
          <label>{">"}</label>
          <div className={step < 5 ? "disabled" : ""}>Selling Date</div>
        </div>
        {step === 1 && <Information data={data} setData={setData} />}
        {step === 2 && <LocationTime data={data} setData={setData} />}
        {step === 3 && (
          <Dates
            onAdd={() => {
              setData({
                ...data,
                dateEvents:
                  data.dateEvents?.length > 0 ? [...data.dateEvents, ""] : [""],
              });
            }}
            onDelete={(i: any) => {
              const cloned = {
                ...data,
                dateEvents: data.dateEvents.filter((_: any, j: any) => i !== j),
              };
              setData(cloned);
            }}
            onChange={(value: number, i: number) => {
              const cloned = { ...data };
              cloned.dateEvents[i] = value;
              setData(cloned);
            }}
            data={data}
          />
        )}
        {step === 4 && (
          <Tickets
            onAdd={() => {
              setData({
                ...data,
                ticketDatas:
                  data.ticketDatas?.length > 0
                    ? [
                        ...data.ticketDatas,
                        {
                          name: "",
                          amount: 0,
                          tokenIdFrom: data.ticketDatas.length * 50,
                          tokenId: data.ticketDatas.length * 50,
                        },
                      ]
                    : [
                        {
                          name: "",
                          amount: 0,
                          tokenIdFrom: data.ticketDatas.length * 50,
                          tokenId: data.ticketDatas.length * 50,
                        },
                      ],
              });
            }}
            onDelete={(i: any) => {
              const cloned = {
                ...data,
                ticketDatas: data.ticketDatas.filter(
                  (_: any, j: any) => i !== j
                ),
              };
              setData(cloned);
            }}
            onChange={(
              value: string | number,
              key: "name" | "amount",
              i: number
            ) => {
              const cloned = { ...data };
              cloned.ticketDatas[i][key] =
                key === "amount" ? Number(value) : value;
              setData(cloned);
            }}
            data={data}
          />
        )}
        {step === 5 && (
          <SellingDate
            onAdd={() => {
              setData({
                ...data,
                saleDatas:
                  data.saleDatas?.length > 0
                    ? [
                        ...data.saleDatas,
                        { name: "", date: 0, ticketName: [], ticketAmount: [] },
                      ]
                    : [{ name: "", date: 0, ticketName: [], ticketAmount: [] }],
              });
            }}
            onDelete={(i: any) => {
              const cloned = {
                ...data,
                saleDatas: data.saleDatas.filter((_: any, j: any) => i !== j),
              };
              setData(cloned);
            }}
            onChange={(
              value: string | number,
              key: "name" | "date" | "ticketName" | "ticketAmount",
              i: number,
              j: number
            ) => {
              const cloned = { ...data };
              if (j) {
                cloned.saleDatas[i]["ticketName"][j] =
                  cloned.ticketDatas[j].name;
                cloned.saleDatas[i]["ticketAmount"][j] = Number(value || 0);
                setData(cloned);
              } else {
                if (key == "date") {
                  cloned.saleDatas[i][key] = Number(value);
                } else {
                  cloned.saleDatas[i][key] = value;
                }
                setData(cloned);
              }
            }}
            data={data}
          />
        )}
        <div className="buttons">
          <button disabled={step === 1} onClick={() => setStep(step - 1)}>
            Back
          </button>
          <button
            onClick={() => {
              if (step === 4) {
                setData({
                  ...data,
                  saleDatas: [
                    {
                      name: "",
                      date: 0,
                      ticketName:
                        data.ticketDatas?.map((item: any) => item.name) || [],
                      ticketAmount:
                        data.ticketDatas?.map((item: any) => item.amount) || [],
                    },
                  ],
                });
              }
              if (step === 5) {
                createContract(data);
              } else {
                setStep(step + 1);
              }
            }}
          >
            {step === 5 ? "Create Contract" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
