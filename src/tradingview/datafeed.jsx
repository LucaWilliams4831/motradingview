/* eslint-disable no-unused-vars */
import { serverUrl } from "../constant/constant";

import { ApolloClient, from, gql, InMemoryCache } from "@apollo/client";

var latestBar;
const sendResolutions = {
  1: "1min",
  5: "5min",
  15: "15min",
  30: "30min",
  45: "45min",
  60: "1h",
  120: "2h",
  240: "4h",
  "1D": "1day",
};

function printDate(mm) {
  let date = new Date(mm);
  let tt =
    date.getFullYear() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  return tt;
}

function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  };
}

export const configurationData = {
  supported_resolutions: [
    "15",
    "30",
    "60",
    "120",
    "240",
    "360",
    "D",
    "W",
    "M",
  ],
};

function convertResolution(resolution) {
  var interval;
  if (resolution === "1") {
    interval = "1m";
  } else if (resolution === "5") {
    interval = "5m";
  } else if (resolution === "10") {
    interval = "10m";
  } else if (resolution === "15") {
    interval = "15m";
  } else if (resolution === "30") {
    interval = "30m";
  } else if (resolution === "45") {
    interval = "45m";
  } else if (resolution === "60") {
    interval = "1h";
  } else if (resolution === "120") {
    interval = "2h";
  } else if (resolution === "240") {
    interval = "4h";
  } else if (resolution === "1D") {
    interval = "24h";
  } else {
    interval = resolution;
  }
  return interval;
}

const INTERVAL_SECONDS = {
  "1m": 60,
  "5m": 300,
  "10m": 600,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "4h": 14400,
  "12h": 43200,
  "24h": 86400,
};

const channelToSubscription = new Map();
// const socket = socketIO.connect(process.env.API_URL);
// socket.on("connect", () => {
//   console.log("[socket] Connected");
// });

// socket.on("disconnect", (reason) => {
//   console.log("[socket] Disconnected:", reason);
// });

// socket.on("error", (error) => {
//   console.log("[socket] Error:", error);
// });

// socket.on("m", (data) => {
//   console.log("[socket] Message:", data);
//   const [
//     eventTypeStr,
//     exchange,
//     fromSymbol,
//     toSymbol,
//     ,
//     ,
//     tradeTimeStr,
//     ,
//     tradePriceStr,
//   ] = data.split("~");

//   if (parseInt(eventTypeStr) !== 0) {
//     // Skip all non-trading events
//     return;
//   }
//   const tradePrice = parseFloat(tradePriceStr);
//   const tradeTime = parseInt(tradeTimeStr);
//   const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
//   const subscriptionItem = channelToSubscription.get(channelString);
//   if (subscriptionItem === undefined) {
//     return;
//   }
//   const lastDailyBar = subscriptionItem.lastDailyBar;
//   const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time);

//   let bar;
//   if (tradeTime >= nextDailyBarTime) {
//     bar = {
//       time: nextDailyBarTime,
//       open: tradePrice,
//       high: tradePrice,
//       low: tradePrice,
//       close: tradePrice,
//     };
//     console.log("[socket] Generate new bar", bar);
//   } else {
//     bar = {
//       ...lastDailyBar,
//       high: Math.max(lastDailyBar.high, tradePrice),
//       low: Math.min(lastDailyBar.low, tradePrice),
//       close: tradePrice,
//     };
//     console.log("[socket] Update the latest bar by price", tradePrice);
//   }
//   subscriptionItem.lastDailyBar = bar;

//   // Send data to every subscriber of that symbol
//   subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
// });
function getNextDailyBarTime(barTime) {
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}

// Chart Methods
// eslint-disable-next-line import/no-anonymous-default-export
const datafeed = (tokenId, pairAddress) => {
  return {
    onReady: (callback) => {
      setTimeout(() => callback(configurationData));
    },
    searchSymbols: async () => {
      // Code here...
    },
    resolveSymbol: async (
      symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback
    ) => {
      let symbolInfo = {
        name: symbolName,
        has_intraday: true,
        has_no_volume: false,
        session: "24x7",
        timezone: "Europe/Athens",
        exchange: "",
        minmov: 0.00000000000001,
        pricescale: 100000000000,
        has_weekly_and_monthly: false,
        volume_precision: 2,
        data_status: "streaming",
        supported_resolutions: configurationData.supported_resolutions,
      };

      onSymbolResolvedCallback(symbolInfo);
    },

    getBars: async (
      symbolInfo,
      resolution,
      periodParams,
      onHistoryCallback,
      onErrorCallback
      // firstDataRequest
    ) => {
      const resName = sendResolutions[resolution];
      const { from, to, firstDataRequest } = periodParams;
      try {


        let interval = 3600;
        if (resName === "15min") {
          interval = 900;
        } else if (resName === "30min") {
          interval = 1800;
        } else if (resName === "1h") {
          interval = 3600;
        } else if (resName === "2h") {
          interval = 7200;
        } else if (resName === "4h") {
          interval = 14400;
        } else if (resName === "6h") {
          interval = 21600;
        } else if (resName === "1day") {
          interval = 86400;
        } else if (resName === "1week") {
          interval = 604800;
        } else {
          interval = 3600;
        }
        // let url = `https://api.twelvedata.com/time_series?symbol=${symbolInfo.name}&outputsize=1000&interval=${resName}&apikey=${API_KEY}`;
        // let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/token/get_feed_data?tokenId=${tokenId}&from=${from}&to=${to}`;

        const client = new ApolloClient({
          uri: 'https://api.pepelion.fun/subgraphs/name/mosubgraph/v2-subgraph',
          cache: new InMemoryCache(),
        });

        // console.log("client", client);

        const QUERY = gql`
        query($from:Int, $to:Int, $pairAddress:String) {
          swaps(first: 1000, orderBy: timestamp, orderDirection: asc, where: {pair: $pairAddress, timestamp_gte: $from, timestamp_lte: $to}) {
          timestamp
          amountUSD
          amount0In
          amount1In
          amount0Out
          amount1Out
        }
        }
      `;
        const { data: queryResult, error: error } = await client.query({
          query: QUERY,
          variables: { from, to, pairAddress },
          fetchPolicy: "cache-first",
        });

        // console.log(queryResult);

        const ohlcvData = processData(queryResult?.swaps);

        //console.log(ohlcvData);

        // if (response.status !== 200) {
        //   onHistoryCallback([], { noData: false });
        //   return;
        // }

        // console.log(ohlcvData.length)

        if (!ohlcvData.length) {
          onHistoryCallback([], { noData: true });
        }

        // let bars = ohlcvData.map((el) => {
        //   let dd = new Date(el.startTimestampSeconds * 1000);
        //   return {
        //     time: dd.getTime(), //TradingView requires bar time in ms
        //     low: el.low,
        //     high: el.high,
        //     open: el.open,
        //     close: el.close,
        //     volume: el.volumeUsd,
        //   };
        // });
        let bars = ohlcvData;
        bars = bars.sort(function (a, b) {
          if (a.time < b.time) return -1;
          else if (a.time > b.time) return 1;
          return 0;
        });
        latestBar = bars[bars.length - 1];
        window.delta = 0;

        onHistoryCallback(bars, { noData: false });
      } catch (error) {
        onErrorCallback(error);
      }
    },
    subscribeBars: (
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastDailyBar
    ) => {
      const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
      const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
      const handler = {
        id: subscribeUID,
        callback: onRealtimeCallback,
      };
      let subscriptionItem = channelToSubscription.get(channelString);
      if (subscriptionItem) {
        // Already subscribed to the channel, use the existing subscription
        subscriptionItem.handlers.push(handler);
        return;
      }
      subscriptionItem = {
        subscribeUID,
        resolution,
        lastDailyBar,
        handlers: [handler],
      };
      channelToSubscription.set(channelString, subscriptionItem);
      console.log(
        "[subscribeBars]: Subscribe to streaming. Channel:",
        channelString
      );
      socket.emit("SubAdd", { subs: channelString });
      // const resName = sendResolutions[resolution];
      // const symbolName = symbolInfo.name;
      // console.log('[rec]', symbolInfo.name, resolution, resName)

      // try {
      //   let ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`);
      //   ws.onopen = (e) => {
      //     window.delta = 0;
      //     console.log('[ws onopen]');
      //     let sendData = {
      //       "action": "subscribe",
      //       "params": {
      //         "symbols": [{
      //           "symbol": symbolName,
      //           "exchange": "NASDAQ",
      //           "price": true
      //         }],
      //         "event": "price"
      //       }
      //     }
      //     ws.send(JSON.stringify(sendData));
      //   }

      //   ws.onmessage = e => {
      //     let transaction = JSON.parse(e.data);

      //     console.log('[onmsg]', transaction);
      //     if (transaction.event == 'price') {
      //       const seconds = INTERVAL_SECONDS[convertResolution(resolution)]

      //       var txTime = Math.floor(transaction.timestamp / seconds) * seconds * 1000 - (1440 + 30) * 60 * 1000
      //       console.log('[input_time]', printDate(latestBar.time), printDate(txTime));

      //       var current = new Date();
      //       // var d_time = (current.getDate() * 86400 + current.getHours() * 3600 + current.getMinutes() * 60) - (current.getUTCDate() * 86400 + current.getUTCHours() * 3600 + current.getUTCMinutes() * 60) + 73800;
      //       var d_time = (16 * 60 + 30) * 60 * 1000;

      //       if(window.delta == 0) {
      //         window.delta = latestBar.time - txTime;
      //       }

      //       txTime += window.delta;

      //       console.log("[delta time]", printDate(latestBar.time), printDate(txTime));

      //       if (latestBar && txTime == latestBar.time) {
      //         latestBar.close = transaction.price
      //         if (transaction.price > latestBar.high) {
      //           latestBar.high = transaction.price
      //         }

      //         if (transaction.price < latestBar.low) {
      //           latestBar.low = transaction.price
      //         }

      //         latestBar.volume += transaction.day_volume
      //         console.log('[update bar]', printDate(latestBar.time));
      //         onRealtimeCallback(latestBar)
      //       } else if (latestBar && txTime > latestBar.time) {
      //         const newBar = {
      //           low: transaction.price,
      //           high: transaction.price,
      //           open: transaction.price,
      //           close: transaction.price,
      //           volume: transaction.day_volume,
      //           time: txTime
      //         }
      //         latestBar = newBar
      //         console.log('[new Bar]', printDate(newBar.time))
      //         onRealtimeCallback(newBar)
      //       }

      //       // lastBar.time
      //     }

      //   }

      //   ws.onclose = function () {
      //     console.log('[onclose]');
      //   }

      // } catch (err) {
      //   console.log(err);
      // }
      // // Code here...
      // window.resetCacheNeededCallback = onResetCacheNeededCallback;
    },
    unsubscribeBars: (subscriberUID) => {
      // Code here...
    },
  };
};

function processData(swaps) {
  const ohlcvData = [];
  let currentCandle = null;
  let beforePrice = 0;

  swaps.forEach(swap => {
    const date = new Date(swap.timestamp * 1000);
    //const day = date.toISOString().split('T')[0];

    let amount = beforePrice;
    if (swap.amount1Out !== "0") {
      amount = swap.amount0In / swap.amount1Out;
    }
    else if (swap.amount1In !== "0") {
      amount = swap.amount0Out / swap.amount1In;
    }

    if (!beforePrice)
      beforePrice = amount;

    if (!currentCandle || currentCandle.time !== date.getTime()) {
      if (currentCandle) ohlcvData.push(currentCandle);

      currentCandle = {
        time: date.getTime(),
        open: parseFloat(beforePrice),
        high: parseFloat(amount),
        low: parseFloat(amount),
        close: parseFloat(amount),
        volume: parseFloat(amount),
      };
    } else {
      currentCandle.high = Math.max(currentCandle.high, parseFloat(amount));
      currentCandle.low = Math.min(currentCandle.low, parseFloat(amount));
      currentCandle.close = parseFloat(amount);
      currentCandle.volume += parseFloat(amount);
    }

    beforePrice = amount;
  });

  if (currentCandle) ohlcvData.push(currentCandle);

  return ohlcvData;
}

export default datafeed;
