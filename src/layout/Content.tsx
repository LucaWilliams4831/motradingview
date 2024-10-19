import React, { useState } from "react"
import { Button } from "@mui/material";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import Chart from '../tradingview/Chart';
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { useEffect } from "react";

interface ContentProps {
    setHide: React.Dispatch<React.SetStateAction<boolean>>;
    hide: boolean;
    setTokenAddress: React.Dispatch<React.SetStateAction<string>>;
    tokenAddress: string;
    setPairAddress: React.Dispatch<React.SetStateAction<string>>;
    pairAddress: string;
    sym0: string;
    sym1: string;
}

const Content = (props: ContentProps) => {
    const navigate = useNavigate();
    //const [pairAddress, setPairAddress] = useState("0x2e9e3984b96c405193eecd3c561bf9354d44ed18");
    const [symbol0, setSymbol0] = useState("");
    const [symbol1, setSymbol1] = useState("");
    // const tokenAddress = props.tokenAddress;
    // const pairAddress = props.pairAddress;
    // console.log(tokenAddress, "_________________________________")

    useEffect(() => {
        console.log("__________________", props)
        setSymbol0(props.sym0);
        setSymbol1(props.sym1);
    }, [props.sym0, props.sym1]);

    const onChange = (e: any) => {
        props.setTokenAddress(e.target.value.toLowerCase());
    };

    const onClick = async () => {
        const client = new ApolloClient({
            uri: 'https://api.pepelion.fun/subgraphs/name/mosubgraph/v2-subgraph',
            cache: new InMemoryCache(),
        });

        const tokenAddress = props.tokenAddress;

        console.log("client", client);

        const QUERY = gql`
        query($tokenAddress: String) {
          pairs(where: { token0: $tokenAddress }) {
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
        query($tokenAddress: String) {
          pairs(where: { token1: $tokenAddress }) {
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
            variables: { tokenAddress },
            fetchPolicy: "cache-first",
        });

        // console.log("queryResult", queryResult);

        if (queryResult.pairs.length == 0) {
            const { data: queryResult1 } = await client.query({
                query: QUERY1,
                variables: { tokenAddress },
                fetchPolicy: "cache-first",
            });

            if (queryResult1.pairs.length == 0)
                return

            props.setPairAddress(queryResult1.pairs[0].id);
            setSymbol0(queryResult1.pairs[0].token0.symbol)
            setSymbol1(queryResult1.pairs[0].token1.symbol)
            navigate(`/token/${tokenAddress}`);
        } else {
            props.setPairAddress(queryResult.pairs[0].id);
            setSymbol0(queryResult.pairs[0].token0.symbol)
            setSymbol1(queryResult.pairs[0].token1.symbol)
            navigate(`/token/${tokenAddress}`);
        }
    }


    // console.log(props.hide)
    const onShowBtnClick = () => {
        props.setHide(false)
    }
    return (
        <div className="w-full p-2">
            <div className="flex items-center justify-start mb-2">
                <div className={`${!props.hide && 'hidden'}`}>
                    <Button variant="contained" className={`bg-white hidden`} onClick={onShowBtnClick}>
                        <div className="flex items-center justify-center">
                            <KeyboardDoubleArrowRight />
                            Info
                        </div>
                    </Button>
                </div>
                <span className="ml-2 text-base font-extrabold text-white">
                    {symbol0 && symbol1 ? `${symbol0}/${symbol1}` : ' '}
                </span>
            </div>
            <div className="mb-2">
                <div className="w-full" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <input className="form-control form-control-sm text-black pl-3" type="text" placeholder="Enter token address..." value={props.tokenAddress} onChange={onChange} style={{ width: '400px', height: '30px', backgroundColor: 'white' }} />
                    <button className="button" style={{ marginLeft: '20px' }} onClick={onClick}>Show</button>
                </div>
            </div>
            <div className="w-full">
                <Chart
                    stock={"Stock"}
                    interval="60"
                    width="100%"
                    height="100%"
                    symbol={`${symbol0}/${symbol1}`}
                    pairAddress={props.pairAddress}
                />
            </div>
        </div>
    )
}

export default Content