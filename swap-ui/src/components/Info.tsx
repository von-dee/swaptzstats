import {
  makeStyles,
  Typography,
  Link,
  Popover,
  IconButton,
} from "@material-ui/core";
import { Info } from "@material-ui/icons";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { PublicKey } from "@solana/web3.js";
import { useTokenMap } from "../context/TokenList";
import { useSwapContext, useSwapFair } from "../context/Swap";
import { useMint } from "../context/Token";
import { useRoute, useMarketName, useBbo } from "../context/Dex";
import { SettingsButton } from "./Settings";

const useStyles = makeStyles(() => ({
  infoLabel: {
    color: "white !important",
    marginTop: "20px",
    marginBottom: "20px",
    alignItems: "left"
  },
  labelWithButton: {
    display: "flex",
    justifyContent: "flex-start"
  },
  labelText: {
    fontSize: "12px", 
    width: '150%'
  },
  labelValue: {
    fontSize: "12px", 
    textAlign: 'center', 
    width: '20%'
  },
  infoButton: {
    marginLeft: "5px",
    padding: 0,
    fontSize: "14px",
  },
}));

export function InfoLabel() {
  const styles = useStyles();

  const { fromMint, toMint } = useSwapContext();
  const fromMintInfo = useMint(fromMint);
  const fair = useSwapFair();

  const tokenMap = useTokenMap();
  let fromTokenInfo = tokenMap.get(fromMint.toString());
  let toTokenInfo = tokenMap.get(toMint.toString());

  return (
    <div className={styles.infoLabel}>

      {/* <div className={styles.labelWithButton}>
        <Typography color="textSecondary" style={{ fontSize: "14px" }}>
          {fair !== undefined && toTokenInfo && fromTokenInfo
            ? `1 ${toTokenInfo.symbol} = ${fair.toFixed(
                fromMintInfo?.decimals
              )} ${fromTokenInfo.symbol}`
            : `-`}
        </Typography>
        <InfoButton />
      </div> */}
      <div className={styles.labelWithButton}>
        <Typography className={styles.labelText}>
          Transaction Settings
        </Typography>
        <Typography className={styles.labelValue}>
          <SettingsButton />
        </Typography>
      </div>
      <div className={styles.labelWithButton}>
        <Typography className={styles.labelText}>
          Slippage Tolerance
        </Typography>
        <Typography className={styles.labelValue}>
          0
        </Typography>
      </div>

      <div className={styles.labelWithButton}>
        <Typography className={styles.labelText}>
          Minimum Received
        </Typography>
        <Typography className={styles.labelValue}>
          0
        </Typography>
      </div>

      <div className={styles.labelWithButton}>
        <Typography className={styles.labelText}>
          Swap Fee
        </Typography>
        <Typography className={styles.labelValue}>
          0
        </Typography>
      </div>
    </div>
  );
}

function InfoButton() {
  const styles = useStyles();
  return (
    <PopupState variant="popover">
      {
        //@ts-ignore
        (popupState) => (
          <div style={{ display: "flex" }}>
            <IconButton
              {...bindTrigger(popupState)}
              className={styles.infoButton}
            >
              <Info fontSize="small" />
            </IconButton>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{ style: { borderRadius: "10px" } }}
              disableRestoreFocus
            >
              <InfoDetails />
            </Popover>
          </div>
        )
      }
    </PopupState>
  );
}

function InfoDetails() {
  const { fromMint, toMint } = useSwapContext();
  const route = useRoute(fromMint, toMint);
  const tokenMap = useTokenMap();
  const fromMintTicker = tokenMap.get(fromMint.toString())?.symbol;
  const toMintTicker = tokenMap.get(toMint.toString())?.symbol;
  const addresses = [
    { ticker: fromMintTicker, mint: fromMint },
    { ticker: toMintTicker, mint: toMint },
  ];

  return (
    <div style={{ padding: "15px", width: "250px" }}>
      <div>
        <Typography
          color="textSecondary"
          style={{ fontWeight: "bold", marginBottom: "5px" }}
        >
          Trade Route
        </Typography>
        {route ? (
          route.map((market: PublicKey) => {
            return <MarketRoute key={market.toString()} market={market} />;
          })
        ) : (
          <Typography color="textSecondary">Route not found</Typography>
        )}
      </div>
      <div style={{ marginTop: "15px" }}>
        <Typography
          color="textSecondary"
          style={{ fontWeight: "bold", marginBottom: "5px" }}
        >
          Tokens
        </Typography>
        {addresses.map((address) => {
          return (
            <div
              key={address.mint.toString()}
              style={{
                marginTop: "5px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link
                href={`https://explorer.solana.com/address/${address.mint.toString()}`}
                target="_blank"
                rel="noopener"
              >
                {address.ticker}
              </Link>
              <code style={{ width: "128px", overflow: "hidden" }}>
                {address.mint.toString()}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketRoute({ market }: { market: PublicKey }) {
  const marketName = useMarketName(market);
  const bbo = useBbo(market);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "5px",
      }}
    >
      <Link
        href={`https://dex.projectserum.com/#/market/${market.toString()}`}
        target="_blank"
        rel="noopener"
      >
        {marketName}
      </Link>
      <code style={{ marginLeft: "10px" }}>
        {bbo && bbo.mid ? bbo.mid.toFixed(6) : "-"}
      </code>
    </div>
  );
}
