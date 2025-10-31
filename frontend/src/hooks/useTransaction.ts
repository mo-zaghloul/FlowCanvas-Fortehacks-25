// src/hooks/useTransaction.ts
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { toast } from "sonner";

export type TransactionStatus = "IDLE" | "PENDING" | "EXECUTED" | "SEALED" | "EXPIRED" | "ERROR";

export const useTransaction = () => {
  const [status, setStatus] = useState<TransactionStatus>("IDLE");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = async (transactionFunc: () => Promise<string>) => {
    try {
      setStatus("PENDING");
      setError(null);
      
      const txId = await transactionFunc();
      setTransactionId(txId);
      
      toast.info("Transaction submitted!", {
        description: `Transaction ID: ${txId.slice(0, 8)}...`
      });

      // Monitor transaction status
      const unsubscribe = fcl.tx(txId).subscribe((tx: any) => {
        if (tx.errorMessage) {
          setStatus("ERROR");
          setError(tx.errorMessage);
          toast.error("Transaction failed", {
            description: tx.errorMessage
          });
          unsubscribe();
          return;
        }

        switch (tx.status) {
          case 1: // PENDING
            setStatus("PENDING");
            break;
          case 2: // EXECUTED
            setStatus("EXECUTED");
            toast.info("Transaction executed!");
            break;
          case 3: // SEALED
            setStatus("SEALED");
            toast.success("Transaction confirmed!");
            unsubscribe();
            break;
          case 4: // EXPIRED
            setStatus("EXPIRED");
            toast.error("Transaction expired");
            unsubscribe();
            break;
          default:
            setStatus("IDLE");
        }
      });

      return txId;
    } catch (err: any) {
      setStatus("ERROR");
      setError(err.message || "Transaction failed");
      toast.error("Transaction failed", {
        description: err.message
      });
      throw err;
    }
  };

  const reset = () => {
    setStatus("IDLE");
    setTransactionId(null);
    setError(null);
  };

  return {
    status,
    transactionId,
    error,
    executeTransaction,
    reset,
    isPending: status === "PENDING",
    isExecuted: status === "EXECUTED",
    isSealed: status === "SEALED",
    isError: status === "ERROR"
  };
};