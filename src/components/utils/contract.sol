// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract EventNFTNew is Ownable, ERC721URIStorage {
    string public eventName;
    string public eventLogo;
    string public eventLocation;
    uint public totalDays;
    uint public ticketMaxPerWallet;
    uint public allTicketMinted = 0;
    string public baseTokenURI;
    bool public ticketTransferable;

    mapping(address => uint) userTicketAmount;

    struct Ticket {
        string name;
        uint amount;
        uint tokenIdFrom;
        uint tokenId;
    }

    struct Sale {
        string name;
        uint date;
        string[] ticketName;
        uint[] ticketAmount;
    }

    struct DailyEvent {
        uint dateEvent;
        Ticket[] tickets;
        Sale[] sales;
        uint ticketTotal;
        uint ticketAvailable;
        uint ticketMinted;
        bool completedDailyEvent;
    }

    // struct AllEvent {
    //     DailyEvent[] allEvents;
    // }

    DailyEvent[] public dailyEvents;
    Ticket[] public tickets;
    Sale[] public sales;

    mapping(string => uint) ticketNameToIndex;
    mapping(string => bool) ticketNameExist;

    struct EventData {
        string eventName;
        string eventLogo;
        string eventLocation;
        uint[] dateEvents;
        bool ticketTransferable;
        uint ticketMaxPerWallets;
        Ticket[] ticketDatas;
        Sale[] saleDatas;
    }

    constructor(
        EventData memory eventData,
        string memory baseUri_
    ) ERC721(eventData.eventName, eventData.eventLogo) {
        eventName = eventData.eventName;
        eventLogo = eventData.eventLogo;
        eventLocation = eventData.eventLocation;
        totalDays = eventData.dateEvents.length;
        ticketTransferable = eventData.ticketTransferable;
        ticketMaxPerWallet = eventData.ticketMaxPerWallets;
        setBaseURI(baseUri_);

        for (uint i = 0; i < eventData.dateEvents.length; i++) {
            DailyEvent storage dailyEventData = dailyEvents.push();
            dailyEventData.dateEvent = eventData.dateEvents[i];

            for (uint j = 0; j < eventData.ticketDatas.length; j++) {
                uint totalAmount;
                uint newTokenId;
                if (i == 0) {
                    for (uint k = 0; k <= j; k++) {
                        totalAmount += eventData.ticketDatas[k].amount;
                    }
                    newTokenId =
                        (totalAmount - eventData.ticketDatas[j].amount) +
                        1;
                } else {
                    for (uint k = 0; k < eventData.ticketDatas.length; k++) {
                        totalAmount += eventData.ticketDatas[k].amount;
                    }
                    totalAmount = totalAmount * i;
                    for (uint l = 0; l <= j; l++) {
                        totalAmount += eventData.ticketDatas[l].amount;
                    }
                    newTokenId =
                        (totalAmount - eventData.ticketDatas[j].amount) +
                        1;
                }
                Ticket memory ticketData = Ticket(
                    eventData.ticketDatas[j].name,
                    eventData.ticketDatas[j].amount,
                    newTokenId,
                    newTokenId
                );
                ticketNameToIndex[eventData.ticketDatas[j].name] = j;
                ticketNameExist[eventData.ticketDatas[j].name] = true;
                dailyEventData.tickets.push(ticketData);
                tickets.push(ticketData);
                dailyEventData.ticketTotal += eventData.ticketDatas[j].amount;
            }

            for (uint j = 0; j < eventData.saleDatas.length; j++) {
                Sale memory saleData = Sale(
                    eventData.saleDatas[j].name,
                    eventData.saleDatas[j].date,
                    eventData.saleDatas[j].ticketName,
                    eventData.saleDatas[j].ticketAmount
                );
                dailyEventData.sales.push(saleData);
                sales.push(saleData);
            }

            dailyEventData.ticketAvailable = dailyEventData.ticketTotal;
            dailyEventData.ticketMinted = 0;
            dailyEventData.completedDailyEvent = false;
        }
    }

    function setBaseURI(string memory baseTokenURI_) public onlyOwner {
        baseTokenURI = baseTokenURI_;
    }

    function buyTicket(
        uint dayIndex,
        string[] memory ticketNameToBuy,
        uint[] memory ticketAmountToBuy,
        uint saleIndex
    ) public {
        DailyEvent storage dailyEventData = dailyEvents[dayIndex];
        require(
            block.timestamp < dailyEventData.dateEvent,
            "Event is Already Started"
        );
        require(
            block.timestamp > dailyEventData.sales[saleIndex].date,
            string(
                abi.encodePacked(
                    dailyEventData.sales[saleIndex].name,
                    ": Ticket Sale is Not Opened"
                )
            )
        );
        if (saleIndex + 1 < dailyEventData.sales.length) {
            require(
                block.timestamp < dailyEventData.sales[saleIndex + 1].date,
                string(
                    abi.encodePacked(
                        dailyEventData.sales[saleIndex].name,
                        ": This Type of Sale is Closed"
                    )
                )
            );
        }

        uint ticketTotal;
        for (uint i = 0; i < ticketAmountToBuy.length; i++) {
            ticketTotal += ticketAmountToBuy[i];
        }

        userTicketAmount[msg.sender] += ticketTotal;
        require(
            ticketMaxPerWallet >= ticketTotal &&
                userTicketAmount[msg.sender] <= ticketMaxPerWallet,
            string(abi.encodePacked("You Have Exceeded Max Amount of Ticket"))
        );

        for (uint i = 0; i < ticketNameToBuy.length; i++) {
            require(
                ticketNameExist[ticketNameToBuy[i]],
                string(
                    abi.encodePacked(
                        ticketNameToBuy[i],
                        ": This Ticket is Not Exist"
                    )
                )
            );
            uint index = ticketNameToIndex[ticketNameToBuy[i]];
            Ticket storage ticketData = dailyEventData.tickets[index];
            require(
                ticketData.amount >= ticketAmountToBuy[i],
                string(
                    abi.encodePacked(
                        ticketData.name,
                        ": Ticket is Not Available To Buy"
                    )
                )
            );

            Sale storage saleData = dailyEventData.sales[saleIndex];
            require(
                saleData.ticketAmount[i] >= ticketAmountToBuy[i],
                string(
                    abi.encodePacked(
                        ticketData.name,
                        ": Ticket is Not Available To Buy"
                    )
                )
            );

            for (uint j = 0; j < ticketAmountToBuy[i]; j++) {
                _safeMint(msg.sender, ticketData.tokenId);
                ticketData.tokenId += 1;
                allTicketMinted += 1;
            }

            saleData.ticketAmount[i] -= ticketAmountToBuy[i];
            dailyEventData.ticketAvailable -= ticketAmountToBuy[i];
            dailyEventData.ticketMinted += ticketAmountToBuy[i];
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint tokenId,
        uint batchSize
    ) internal view override {
        require(
            from == address(0) || ticketTransferable == true,
            "Ticket is Not Transferable"
        );
    }

    function getStructDetail(
        uint index
    )
        public
        view
        returns (uint, Ticket[] memory, Sale[] memory, uint, uint, uint, bool)
    {
        DailyEvent storage dailyEventData = dailyEvents[index];
        return (
            dailyEventData.dateEvent,
            dailyEventData.tickets,
            dailyEventData.sales,
            dailyEventData.ticketTotal,
            dailyEventData.ticketAvailable,
            dailyEventData.ticketMinted,
            dailyEventData.completedDailyEvent
        );
    }

    function getContractDetail()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            bool,
            uint,
            uint,
            string memory
        )
    {
        return (
            eventName,
            eventLogo,
            eventLocation,
            ticketTransferable,
            ticketMaxPerWallet,
            allTicketMinted,
            baseTokenURI
        );
    }

    function getAllEventDetails()
        public
        view
        returns (uint, Ticket memory, Sale[] memory)
    {
        return (dailyEvents.length, tickets[0], sales);
    }

    function getTicketDetails() public view returns (Ticket memory) {
        return tickets[0];
    }

    function getSaleDetails() public view returns (Sale memory) {
        return sales[0];
    }
}
