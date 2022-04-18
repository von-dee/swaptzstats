import { useState, useMemo, useEffect } from "react";
import {
  makeStyles,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Typography,
  Button,
  Select,
  MenuItem,
  Link,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useMarket, useOpenOrders, useDexContext } from "../context/Dex";
import { useTokenMap } from "../context/TokenList";
import { useMint, useOwnedTokenAccount } from "../context/Token";
import { DEX_PID } from "../utils/pubkeys";

const useStyles = makeStyles((theme) => ({
  table: {},
  closeAccount: {
    color: theme.palette.error.main,
  },
}));

export default function OpenOrdersDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "10px",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          onClick={onClose}
          style={{
            padding: 10,
          }}
        >
          <Close />
        </IconButton>
      </div>
      <DialogContent style={{ paddingTop: 0 }}>
        <OpenOrdersAccounts />
      </DialogContent>
    </Dialog>
  );
}

function OpenOrdersAccounts() {
  const styles = useStyles();
  const openOrders = useOpenOrders();
  
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table className={styles.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Market</TableCell>
            <TableCell align="center">Open Orders Account</TableCell>
            <TableCell align="center">Base Used</TableCell>
            <TableCell align="center">Base Free</TableCell>
            <TableCell align="center">Quote Used</TableCell>
            <TableCell align="center">Quote Free</TableCell>
            <TableCell align="center">Settle</TableCell>
            <TableCell align="center">Close</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {openOrdersEntries.map(([market, oos]) => {
            return (
              <OpenOrdersRow
                key={market.toString()}
                market={market}
                openOrders={oos}
              />
            );
          })} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
