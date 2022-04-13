import { useContext } from "react";
import { FirebaseContext } from "./FirebaseContext";

export const useFirebase = () => useContext(FirebaseContext);
