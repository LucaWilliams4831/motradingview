import React from "react"
import { Button, Link } from "@mui/material"
import { KeyboardDoubleArrowLeft } from "@mui/icons-material"
import { useEffect, useState } from "react";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

interface SidebarProps {
    setHide: React.Dispatch<React.SetStateAction<boolean>>;
    tokenAddress: string;
    pairAddress: string;
}

const linkList = [
    // {
    //     title: 'Home',
    //     url: 'https://wasabi.to',
    // },
    {
        title: 'Mainnet',
        url: 'https://mainnet.mochain.app',
    },
    {
        title: 'Testnet',
        url: 'https://testnet.mochain.app',
    },
    {
        title: 'Dex',
        url: 'https://mojito.to',
    },
    {
        title: 'Docs',
        url: 'https://modocs.app',
    },
    {
        title: 'Roadmap',
        url: 'https://Mandarin.to',
    },
    {
        title: 'Twitter',
        url: 'https://twitter.com/0xmochain',
    },
    {
        title: 'Telegram',
        url: 'https://t.me/mochain_official',
    },
];

const Sidebar = (props: SidebarProps) => {

    const [supply, setSupply] = useState(0);
    const [marketcap, setMarketcap] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                await setLiquidityInfo(props.pairAddress);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [props.pairAddress]);

    const setLiquidityInfo = async (pairAddr: any) => {
        const client = new ApolloClient({
            uri: 'https://api.pepelion.fun/subgraphs/name/mosubgraph/v2-subgraph',
            cache: new InMemoryCache(),
        });

        console.log("client", client);

        const QUERY = gql`
        query($pairAddr: String) {
          pairs(where: { id: $pairAddr }) {
            id
            totalSupply
            reserveUSD
          }
        }`;

        // console.log(QUERY, QUERY1, tokenAddress);
        const { data: queryResult } = await client.query({
            query: QUERY,
            variables: { pairAddr },
            fetchPolicy: "cache-first",
        });

        // console.log("queryResult", queryResult);

        if (queryResult.pairs.length > 0) {
            console.log(queryResult.pairs[0].id);
            setSupply(Math.floor(Number(queryResult.pairs[0].totalSupply)))
            setMarketcap(Math.floor(Number(queryResult.pairs[0].reserveUSD)))
        }
    }

    const onHideBtnClick = () => {
        props.setHide(true)
    }

    return (
        <div className="pt-2">
            <div className="flex flex-row justify-between px-4 mb-2">
                <div className="flex flex-col">
                    <span className="text-sm font-extrabold">Total Supply:</span>
                    <span className="text-sm font-extrabold">{supply}</span>
                </div>
                <div>
                    <Button variant="contained" className="bg-white" onClick={onHideBtnClick}>
                        <div className="flex items-center justify-center">
                            <KeyboardDoubleArrowLeft />
                            Hide
                        </div>
                    </Button>
                </div>
            </div>
            <div className="px-4 mb-4">
                <div>
                    <span className="text-sm font-extrabold">Market Cap:</span>
                    <span className="text-sm font-bold">(includes locked, excludes burned)</span>
                </div>
                <div>
                    <span className="text-sm font-bold text-green-400">
                        $ {marketcap}
                    </span>
                </div>
            </div>
            <div className="bg-[#262626] h-[1px]"></div>
            {linkList && linkList.map((link, index) => (
                <div key={index}>
                    <div className="flex flex-col gap-1 px-4 py-2">
                        <Link href={link.url} underline="hover" color="inherit" target="_blank">
                            <div className="flex flex-row items-center">
                                {/* <img src="/bnb.png" alt="" className="w-4 h-4 mr-2 rounded-full" /> */}
                                <span className="text-sm font-bold">{link.title}</span>
                            </div>
                        </Link>
                    </div>
                    <div className="bg-[#262626] h-[1px]"></div>
                </div>
            ))}
        </div>
    )
}

export default Sidebar