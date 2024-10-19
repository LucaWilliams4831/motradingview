import Sidebar from "./Sidebar";
import Content from "./Content";
import { useEffect, useState } from "react";

import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const ChartBody = (props: any) => {
    const [tokenAddress, setTokenAddress] = useState("");
    const [pairAddress, setPairAddress] = useState("");
    const [sym0, setSymbol0] = useState("");
    const [sym1, setSymbol1] = useState("");

    useEffect(() => {
        console.log("location: ", props.location);
        routingLocation(props.location);
    }, [props.location]);

    useEffect(() => {
        (async () => {
            try {
                await setPairInfo(tokenAddress);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [tokenAddress]);

    const routingLocation = (location: any) => {
        const url: string = location.pathname;
        const path: string[] = url.split("/");
        console.log(path);
        if (path.length == 3 && path[1] == "token")
            setTokenAddress(path[2].toLowerCase());
    }

    const setPairInfo = async (tokenAddr: any) => {
        const client = new ApolloClient({
            uri: 'https://api.pepelion.fun/subgraphs/name/mosubgraph/v2-subgraph',
            cache: new InMemoryCache(),
        });

        console.log("client", client);

        const QUERY = gql`
        query($tokenAddr: String) {
          pairs(where: { token0: $tokenAddr }) {
            id
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
          }
        }`;

        const QUERY1 = gql`
        query($tokenAddr: String) {
          pairs(where: { token1: $tokenAddr }) {
            id
            token0 {
              id
              symbol
            }
            token1 {
              id
              symbol
            }
          }
        }`;

        // console.log(QUERY, QUERY1, tokenAddress);
        const { data: queryResult } = await client.query({
            query: QUERY,
            variables: { tokenAddr },
            fetchPolicy: "cache-first",
        });

        // console.log("queryResult", queryResult);

        if (queryResult.pairs.length == 0) {
            const { data: queryResult1 } = await client.query({
                query: QUERY1,
                variables: { tokenAddr },
                fetchPolicy: "cache-first",
            });

            if (queryResult1.pairs.length == 0)
                return

            setPairAddress(queryResult1.pairs[0].id);
            setSymbol0(queryResult1.pairs[0].token0.symbol)
            setSymbol1(queryResult1.pairs[0].token1.symbol)
        } else {
            setPairAddress(queryResult.pairs[0].id);
            setSymbol0(queryResult.pairs[0].token0.symbol)
            setSymbol1(queryResult.pairs[0].token1.symbol)
        }
    }

    return (
        <div className='fixed grid w-full h-screen grid-cols-10 gap-2 top-16'>
            <div className={`col-span-2 bg-[#303032] ${props.hide && 'hidden'}`}>
                <Sidebar setHide={props.setHide} tokenAddress={tokenAddress} pairAddress={pairAddress} />
            </div>
            <div className={props.hide ? 'col-span-10' : 'col-span-8'}>
                <Content setHide={props.setHide} hide={props.hide} setTokenAddress={setTokenAddress} tokenAddress={tokenAddress} setPairAddress={setPairAddress} pairAddress={pairAddress} sym0={sym0} sym1={sym1} />
            </div>
        </div>
    )
}

export default ChartBody;